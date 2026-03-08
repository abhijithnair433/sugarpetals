from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from .models import DeliveryAgent, Delivery
from .serializers import DeliveryAgentSerializer, DeliverySerializer
from accounts.permissions import IsDeliveryAgent
from orders.models import Order

class RegisterDeliveryAgentView(APIView):
    # delivery agent registers their profile
    permission_classes = [IsAuthenticated, IsDeliveryAgent]

    def post(self, request):
        # check if already registered
        if hasattr(request.user, 'deliveryagent'):
            return Response({'error': 'You are already registered as a delivery agent'}, status=status.HTTP_400_BAD_REQUEST)

        city = request.data.get('city')
        if not city:
            return Response({'error': 'City is required'}, status=status.HTTP_400_BAD_REQUEST)

        agent = DeliveryAgent.objects.create(
            user=request.user,
            city=city
        )
        serializer = DeliveryAgentSerializer(agent)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DeliveryAgentProfileView(APIView):
    # agent views and updates their own profile
    permission_classes = [IsAuthenticated, IsDeliveryAgent]

    def get(self, request):
        agent = request.user.deliveryagent
        serializer = DeliveryAgentSerializer(agent)
        return Response(serializer.data)

    def patch(self, request):
        agent = request.user.deliveryagent
        serializer = DeliveryAgentSerializer(agent, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyDeliveriesView(generics.ListAPIView):
    # agent sees all deliveries assigned to them
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated, IsDeliveryAgent]

    def get_queryset(self):
        return Delivery.objects.filter(agent=self.request.user.deliveryagent)


class UpdateDeliveryStatusView(APIView):
    # agent updates delivery status
    permission_classes = [IsAuthenticated, IsDeliveryAgent]

    def patch(self, request, pk):
        try:
            delivery = Delivery.objects.get(id=pk, agent=request.user.deliveryagent)
        except Delivery.DoesNotExist:
            return Response({'error': 'Delivery not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in ['picked_up', 'delivered']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        delivery.status = new_status

        # auto set timestamps
        if new_status == 'picked_up':
            delivery.picked_up_at = timezone.now()
        elif new_status == 'delivered':
            delivery.delivered_at = timezone.now()
            # also update the order status
            delivery.order.status = 'delivered'
            delivery.order.save()

        delivery.save()
        return Response(DeliverySerializer(delivery).data)


class AdminAssignDeliveryView(APIView):
    # admin assigns a delivery agent to an order
    permission_classes = [IsAdminUser]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        # check if delivery already exists for this order
        if hasattr(order, 'delivery'):
            return Response({'error': 'Delivery already assigned for this order'}, status=status.HTTP_400_BAD_REQUEST)

        agent_id = request.data.get('agent_id')
        try:
            agent = DeliveryAgent.objects.get(id=agent_id, is_available=True)
        except DeliveryAgent.DoesNotExist:
            return Response({'error': 'Agent not found or not available'}, status=status.HTTP_404_NOT_FOUND)

        delivery = Delivery.objects.create(
            order=order,
            agent=agent
        )

        # update order status
        order.status = 'out_for_delivery'
        order.save()

        serializer = DeliverySerializer(delivery)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminDeliveryListView(generics.ListAPIView):
    # admin sees all deliveries
    serializer_class = DeliverySerializer
    permission_classes = [IsAdminUser]
    queryset = Delivery.objects.all()


class AvailableAgentsView(generics.ListAPIView):
    # admin sees all available agents
    serializer_class = DeliveryAgentSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return DeliveryAgent.objects.filter(is_available=True)
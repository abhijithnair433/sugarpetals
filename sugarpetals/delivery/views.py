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
from orders.serializers import OrderSerializer


class RegisterDeliveryAgentView(APIView):
    # delivery agent registers their profile
    permission_classes = [IsAuthenticated, IsDeliveryAgent]

    def post(self, request):
        if hasattr(request.user, 'deliveryagent'):
            return Response({'error': 'You are already registered as a delivery agent'}, status=status.HTTP_400_BAD_REQUEST)

        city = request.data.get('city')
        if not city:
            return Response({'error': 'City is required'}, status=status.HTTP_400_BAD_REQUEST)

        agent = DeliveryAgent.objects.create(user=request.user, city=city)
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

        if new_status == 'picked_up':
            delivery.picked_up_at = timezone.now()
        elif new_status == 'delivered':
            delivery.delivered_at = timezone.now()
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

        if hasattr(order, 'delivery'):
            return Response({'error': 'Delivery already assigned for this order'}, status=status.HTTP_400_BAD_REQUEST)

        agent_id = request.data.get('agent_id')
        try:
            agent = DeliveryAgent.objects.get(id=agent_id, is_available=True)
        except DeliveryAgent.DoesNotExist:
            return Response({'error': 'Agent not found or not available'}, status=status.HTTP_404_NOT_FOUND)

        delivery = Delivery.objects.create(order=order, agent=agent)
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


# ── NEW: Agent self-pickup ────────────────────────────────────────────────

class AvailableOrdersForAgentView(APIView):
    """
    GET /delivery/available-orders/
    Returns all orders that are out_for_delivery and not yet assigned to any agent.
    Optionally filter by ?city=Mumbai to show only orders from stores in that city.
    Only accessible by delivery agents.
    """
    permission_classes = [IsAuthenticated, IsDeliveryAgent]

    def get(self, request):
        # Get IDs of orders that already have a delivery assigned
        assigned_order_ids = Delivery.objects.values_list('order_id', flat=True)

        # Filter: out_for_delivery + not yet assigned
        orders = Order.objects.filter(
            status='out_for_delivery'
        ).exclude(
            id__in=assigned_order_ids
        ).select_related('store')

        # Optional city filter — matches agent's city automatically if passed
        city = request.query_params.get('city')
        if city:
            orders = orders.filter(store__city__icontains=city)

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class AgentSelfPickupView(APIView):
    """
    POST /delivery/pickup/<order_id>/
    Delivery agent self-assigns themselves to an available order.
    - Order must be out_for_delivery
    - Order must not already be assigned
    - Agent must be available (is_available=True)
    Admin assignment (AdminAssignDeliveryView) still works alongside this.
    """
    permission_classes = [IsAuthenticated, IsDeliveryAgent]

    def post(self, request, order_id):
        # Get the order
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Must be out_for_delivery
        if order.status != 'out_for_delivery':
            return Response(
                {'error': 'This order is not ready for pickup yet.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Must not already be assigned
        if hasattr(order, 'delivery'):
            return Response(
                {'error': 'This order has already been taken by another agent.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Agent must exist and be available
        try:
            agent = DeliveryAgent.objects.get(user=request.user, is_available=True)
        except DeliveryAgent.DoesNotExist:
            return Response(
                {'error': 'You must be an available delivery agent to pick up orders. Set yourself Online first.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the delivery record — agent self-assigned
        delivery = Delivery.objects.create(order=order, agent=agent)

        serializer = DeliverySerializer(delivery)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import CartItem
from accounts.permissions import IsSeller
from decimal import Decimal

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)  # customer sees their own orders


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class PlaceOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_items = CartItem.objects.filter(user=request.user)

        if not cart_items.exists():
            return Response({'error': 'Your cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # get store from first cart item's product
        store = cart_items.first().product.store

        # check all items belong to same store
        for item in cart_items:
            if item.product.store != store:
                return Response(
                    {'error': 'All items in cart must be from the same store'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # calculate total price
        total_price = sum(item.product.price * item.quantity for item in cart_items)

        # calculate commission and seller earnings
        commission_rate = Decimal(str(store.commission_rate)) / Decimal('100')
        platform_commission = total_price * commission_rate
        seller_earnings = total_price - platform_commission

        # create the order
        order = Order.objects.create(
            user=request.user,
            store=store,
            total_price=total_price,
            platform_commission=platform_commission,
            seller_earnings=seller_earnings
        )

        # create order items
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                unit_price=item.product.price  # snapshot price at time of order
            )

        # clear the cart
        cart_items.delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SellerOrderListView(generics.ListAPIView):
    # seller sees all orders for their store
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsSeller]

    def get_queryset(self):
        return Order.objects.filter(store=self.request.user.store)


class SellerOrderUpdateView(APIView):
    # seller updates order status e.g. pending → baking → out_for_delivery
    permission_classes = [IsAuthenticated, IsSeller]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(id=pk, store=request.user.store)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        valid_statuses = ['confirmed', 'baking', 'out_for_delivery', 'delivered', 'cancelled']
        if new_status not in valid_statuses:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save()
        return Response(OrderSerializer(order).data)


class AdminOrderListView(generics.ListAPIView):
    # admin sees all orders across all stores
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
    queryset = Order.objects.all()
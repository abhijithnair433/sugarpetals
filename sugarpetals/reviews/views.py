from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Review
from .serializers import ReviewSerializer
from orders.models import Order, OrderItem

class AddReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        # check if user has actually ordered this product
        has_ordered = OrderItem.objects.filter(
            order__user=request.user,
            order__status='delivered',
            product_id=product_id
        ).exists()

        if not has_ordered:
            return Response(
                {'error': 'You can only review products you have ordered and received'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # check if already reviewed
        if Review.objects.filter(user=request.user, product_id=product_id).exists():
            return Response(
                {'error': 'You have already reviewed this product'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # get the order for this product
        order = Order.objects.filter(
            user=request.user,
            status='delivered',
            items__product_id=product_id
        ).first()

        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                user=request.user,
                product_id=product_id,
                order=order
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductReviewsView(generics.ListAPIView):
    # anyone can see reviews for a product
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Review.objects.filter(product_id=self.kwargs['product_id'])


class MyReviewsView(generics.ListAPIView):
    # user sees all their own reviews
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)


class DeleteReviewView(APIView):
    # user can delete their own review
    permission_classes = [IsAuthenticated]

    def delete(self, request, product_id):
        try:
            review = Review.objects.get(user=request.user, product_id=product_id)
            review.delete()
            return Response({'message': 'Review deleted'}, status=status.HTTP_204_NO_CONTENT)
        except Review.DoesNotExist:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)
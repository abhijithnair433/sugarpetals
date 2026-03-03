from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Product, Category
from .serializers import ProductSerializer, ProductCreateSerializer, CategorySerializer
from accounts.permissions import IsSeller

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.filter(is_available=True)
        store_id = self.request.query_params.get('store')  # filter by store e.g. /api/products/?store=1
        if store_id:
            queryset = queryset.filter(store_id=store_id)
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class SellerProductListView(generics.ListAPIView):
    # seller sees only their own store's products
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsSeller]

    def get_queryset(self):
        return Product.objects.filter(store=self.request.user.store)


class SellerProductCreateView(generics.CreateAPIView):
    # seller adds a product to their store
    serializer_class = ProductCreateSerializer
    permission_classes = [IsAuthenticated, IsSeller]

    def perform_create(self, serializer):
        serializer.save(store=self.request.user.store)  # auto assign their store


class SellerProductUpdateView(generics.RetrieveUpdateDestroyAPIView):
    # seller edits or deletes their own product
    serializer_class = ProductCreateSerializer
    permission_classes = [IsAuthenticated, IsSeller]

    def get_queryset(self):
        return Product.objects.filter(store=self.request.user.store)  # can only edit their own


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
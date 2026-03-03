from rest_framework import serializers
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)  # show name not ID
    store_name = serializers.CharField(source='store.name', read_only=True)        # show store name

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'stock', 'is_available', 'category', 'category_name', 'store_name', 'created_at']
        read_only_fields = ['created_at']


class ProductCreateSerializer(serializers.ModelSerializer):
    # used when seller creates a product — store is set automatically
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'stock', 'is_available', 'category']
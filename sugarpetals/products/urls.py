from django.urls import path
from . import views

urlpatterns = [
    # public
    path('', views.ProductListView.as_view(), name='product-list'),
    path('<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),

    # seller
    path('my-products/', views.SellerProductListView.as_view(), name='seller-products'),
    path('my-products/add/', views.SellerProductCreateView.as_view(), name='seller-product-add'),
    path('my-products/<int:pk>/', views.SellerProductUpdateView.as_view(), name='seller-product-edit'),
]
from django.urls import path
from . import views

urlpatterns = [
    # customer
    path('', views.OrderListView.as_view(), name='order-list'),
    path('place/', views.PlaceOrderView.as_view(), name='order-place'),
    path('<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),

    # seller
    path('my-orders/', views.SellerOrderListView.as_view(), name='seller-orders'),
    path('my-orders/<int:pk>/status/', views.SellerOrderUpdateView.as_view(), name='seller-order-status'),

    # admin
    path('admin/all/', views.AdminOrderListView.as_view(), name='admin-orders'),
]
from django.urls import path
from . import views

urlpatterns = [
    path('', views.OrderListView.as_view(), name='order-list'),             # GET all orders
    path('place/', views.PlaceOrderView.as_view(), name='order-place'),     # POST place order
    path('<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),# GET one order
]
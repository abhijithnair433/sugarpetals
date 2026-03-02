from django.urls import path
from . import views

urlpatterns = [
    path('', views.CartView.as_view(), name='cart'),                        # GET all cart items
    path('add/', views.AddToCartView.as_view(), name='cart-add'),           # POST add item
    path('<int:pk>/remove/', views.RemoveFromCartView.as_view(), name='cart-remove'),  # DELETE item
]
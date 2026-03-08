from django.urls import path
from . import views

urlpatterns = [
    path('', views.CartView.as_view(), name='cart'),
    path('add/', views.AddToCartView.as_view(), name='cart-add'),
    path('<int:pk>/remove/', views.RemoveFromCartView.as_view(), name='cart-remove'),
    path('<int:pk>/update/', views.UpdateCartItemView.as_view(), name='cart-update'),  # ← new
]
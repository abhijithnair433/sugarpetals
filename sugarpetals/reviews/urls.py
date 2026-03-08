from django.urls import path
from . import views

urlpatterns = [
    path('product/<int:product_id>/', views.ProductReviewsView.as_view(), name='product-reviews'),      # GET all reviews for a product
    path('product/<int:product_id>/add/', views.AddReviewView.as_view(), name='add-review'),            # POST add review
    path('product/<int:product_id>/delete/', views.DeleteReviewView.as_view(), name='delete-review'),   # DELETE review
    path('my-reviews/', views.MyReviewsView.as_view(), name='my-reviews'),                              # GET my reviews
]
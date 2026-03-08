from django.db import models
from django.conf import settings
from products.models import Product
from orders.models import Order

class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='reviews')  # can only review if ordered
    rating = models.PositiveIntegerField()  # 1 to 5
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'product']  # one review per product per user

    def __str__(self):
        return f"{self.user.username} - {self.product.name} - {self.rating}★"
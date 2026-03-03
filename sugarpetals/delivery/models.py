from django.db import models

from django.conf import settings  # ← use settings.AUTH_USER_MODEL for flexibility
from orders.models import Order

# Create your models here.
class DeliveryAgent(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_available = models.BooleanField(default=True)
    city = models.CharField(max_length=100)

class Delivery(models.Model):
    STATUS = [
        ('assigned', 'Assigned'),
        ('picked_up', 'Picked Up'),
        ('delivered', 'Delivered'),
    ]
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    agent = models.ForeignKey(DeliveryAgent, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS, default='assigned')
    picked_up_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

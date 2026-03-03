from django.db import models
from django.conf import settings  # ← use settings.AUTH_USER_MODEL for flexibility

# Create your models here.
class Store(models.Model):
    STATUS = [
        ('pending', 'Pending'),      # waiting for admin approval
        ('approved', 'Approved'),
        ('suspended', 'Suspended'),
    ]
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='store')
    name = models.CharField(max_length=200)
    description = models.TextField()
    address = models.TextField()
    city = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS, default='pending')
    commission_rate = models.DecimalField(max_digits=4, decimal_places=2, default=10.00)  # platform takes 10%
    created_at = models.DateTimeField(auto_now_add=True)
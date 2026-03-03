from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('seller', 'Seller'),
        ('delivery', 'Delivery Agent'),
        ('admin', 'Admin'),
    ]
    phone = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True
    )

    def __str__(self):
        return f"{self.username} ({self.role})"

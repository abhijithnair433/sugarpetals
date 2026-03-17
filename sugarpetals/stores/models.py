from django.db import models
from django.conf import settings


class Store(models.Model):
    STATUS_CHOICES = [
        ('pending',   'Pending'),
        ('approved',  'Approved'),
        ('suspended', 'Suspended'),
    ]

    owner           = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='store')
    name            = models.CharField(max_length=200)
    description     = models.TextField(blank=True)
    address         = models.TextField()
    city            = models.CharField(max_length=100)
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
    created_at      = models.DateTimeField(auto_now_add=True)

    # ── FSSAI compliance fields ──────────────────────────────
    # blank=True + default='' so existing rows migrate without issues.
    # Enforcement (required on new registrations) is handled in the serializer.
    fssai_number      = models.CharField(max_length=14, blank=True, default='')
    fssai_certificate = models.ImageField(upload_to='fssai_certs/', blank=True, default='')
    rejection_reason  = models.TextField(blank=True, default='')

    def __str__(self):
        return self.name

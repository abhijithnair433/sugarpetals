from django.contrib import admin
from .models import DeliveryAgent, Delivery

@admin.register(DeliveryAgent)
class DeliveryAgentAdmin(admin.ModelAdmin):
    list_display  = ['user', 'city', 'is_available']
    search_fields = ['user__username', 'city']
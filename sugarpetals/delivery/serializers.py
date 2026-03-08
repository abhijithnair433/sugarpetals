from rest_framework import serializers
from .models import DeliveryAgent, Delivery

class DeliveryAgentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = DeliveryAgent
        fields = ['id', 'username', 'city', 'is_available']
        read_only_fields = ['username']


class DeliverySerializer(serializers.ModelSerializer):
    agent_name = serializers.CharField(source='agent.user.username', read_only=True)
    order_id = serializers.IntegerField(source='order.id', read_only=True)
    customer_name = serializers.CharField(source='order.user.username', read_only=True)
    store_name = serializers.CharField(source='order.store.name', read_only=True)

    class Meta:
        model = Delivery
        fields = ['id', 'order_id', 'customer_name', 'store_name', 'agent_name', 'status', 'picked_up_at', 'delivered_at']
        read_only_fields = ['order_id', 'customer_name', 'store_name', 'agent_name', 'picked_up_at', 'delivered_at']
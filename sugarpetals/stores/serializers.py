from rest_framework import serializers
from .models import Store

class StoreSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)  # shows username instead of ID

    class Meta:
        model = Store
        fields = ['id', 'owner', 'name', 'description', 'address', 'city', 'status', 'commission_rate', 'created_at']
        read_only_fields = ['status', 'commission_rate', 'created_at', 'owner']
        # ↑ seller can't set their own status or commission, only admin can
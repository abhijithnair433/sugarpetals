from rest_framework import serializers
from .models import Store


class StoreSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model  = Store
        fields = [
            'id', 'owner', 'name', 'description', 'address', 'city',
            'status', 'commission_rate', 'created_at',
            'fssai_number', 'fssai_certificate', 'rejection_reason',
        ]
        read_only_fields = ['id', 'owner', 'status', 'commission_rate', 'created_at', 'rejection_reason']


class StoreRegisterSerializer(serializers.ModelSerializer):
    """Used only on POST /stores/register/ — accepts multipart/form-data."""
    fssai_certificate = serializers.ImageField()

    class Meta:
        model  = Store
        fields = ['name', 'description', 'address', 'city', 'fssai_number', 'fssai_certificate']

    def validate_fssai_number(self, value):
        value = value.strip()
        if not value.isdigit() or len(value) != 14:
            raise serializers.ValidationError('FSSAI number must be exactly 14 digits.')
        return value

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return Store.objects.create(**validated_data)


class AdminStoreStatusSerializer(serializers.ModelSerializer):
    """Used by admin PATCH /stores/admin/<id>/status/"""
    class Meta:
        model  = Store
        fields = ['status', 'commission_rate', 'rejection_reason']
        extra_kwargs = {
            'status':           {'required': False},
            'commission_rate':  {'required': False},
            'rejection_reason': {'required': False},
        }

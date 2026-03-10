from rest_framework import serializers

from .models import Image

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        mmodel = Image
        field = '__all__'
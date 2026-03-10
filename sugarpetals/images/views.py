from rest_framework import viewsets, permissions

from .models import Image
from .serializers import ImageSerializer
from accounts.permissions import IsSeller
from rest_framework.permissions import IsAuthenticated


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticated, IsSeller]
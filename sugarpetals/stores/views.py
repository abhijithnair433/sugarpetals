from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Store
from .serializers import StoreSerializer, StoreRegisterSerializer, AdminStoreStatusSerializer


# ── Permission helpers ─────────────────────────────────────────────────────────
class IsSeller(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'seller'


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)


# ── Public ─────────────────────────────────────────────────────────────────────
class ApprovedStoreListView(generics.ListAPIView):
    """GET /stores/  — public listing of approved stores."""
    serializer_class   = StoreSerializer
    permission_classes = [permissions.AllowAny]
    queryset           = Store.objects.filter(status='approved')


# ── Seller ─────────────────────────────────────────────────────────────────────
class StoreRegisterView(APIView):
    """
    POST /stores/register/
    Content-Type: multipart/form-data
    Fields: name, description, address, city, fssai_number, fssai_certificate (file)
    """
    permission_classes = [IsSeller]
    parser_classes     = [MultiPartParser, FormParser]   # ← required for file upload

    def post(self, request):
        if Store.objects.filter(owner=request.user).exists():
            return Response({'error': 'You already have a registered store.'}, status=400)

        serializer = StoreRegisterSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            store = serializer.save()
            return Response(StoreSerializer(store).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyStoreView(APIView):
    """GET / PUT  /stores/my-store/"""
    permission_classes = [IsSeller]
    parser_classes     = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            store = Store.objects.get(owner=request.user)
            return Response(StoreSerializer(store).data)
        except Store.DoesNotExist:
            return Response({'error': 'No store found.'}, status=404)

    def put(self, request):
        try:
            store = Store.objects.get(owner=request.user)
        except Store.DoesNotExist:
            return Response({'error': 'No store found.'}, status=404)

        serializer = StoreSerializer(store, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# ── Admin ──────────────────────────────────────────────────────────────────────
class AdminStoreListView(generics.ListAPIView):
    """GET /stores/admin/all/  — all stores regardless of status."""
    serializer_class   = StoreSerializer
    permission_classes = [IsAdminUser]
    queryset           = Store.objects.all().select_related('owner')


class AdminStoreStatusView(APIView):
    """
    PATCH /stores/admin/<id>/status/
    Body (JSON): { "status": "approved"|"suspended"|"pending", "commission_rate": 12.5, "rejection_reason": "..." }
    When suspending/rejecting, pass rejection_reason so the seller can see why.
    """
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            store = Store.objects.get(pk=pk)
        except Store.DoesNotExist:
            return Response({'error': 'Store not found.'}, status=404)

        serializer = AdminStoreStatusSerializer(store, data=request.data, partial=True)
        if serializer.is_valid():
            # Auto-clear rejection_reason when approving
            if request.data.get('status') == 'approved':
                serializer.validated_data['rejection_reason'] = ''
            serializer.save()
            return Response(StoreSerializer(store).data)
        return Response(serializer.errors, status=400)

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Store
from .serializers import StoreSerializer
from accounts.permissions import IsSeller

class RegisterStoreView(generics.CreateAPIView):
    serializer_class = StoreSerializer
    permission_classes = [IsAuthenticated, IsSeller]  # only sellers can create a store

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)  # auto assign logged in user as owner


class MyStoreView(generics.RetrieveUpdateAPIView):
    serializer_class = StoreSerializer
    permission_classes = [IsAuthenticated, IsSeller]

    def get_object(self):
        return self.request.user.store  # seller can only see their own store


class AllStoresView(generics.ListAPIView):
    # public — customers can browse all approved stores
    serializer_class = StoreSerializer

    def get_queryset(self):
        return Store.objects.filter(status='approved')


class AdminStoreView(generics.ListAPIView):
    # admin sees all stores including pending and suspended
    serializer_class = StoreSerializer
    permission_classes = [IsAdminUser]
    queryset = Store.objects.all()


class AdminApproveStoreView(APIView):
    # admin approves or suspends a store
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            store = Store.objects.get(id=pk)
        except Store.DoesNotExist:
            return Response({'error': 'Store not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in ['approved', 'suspended', 'pending']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        store.status = new_status
        store.save()
        return Response({'message': f'Store {new_status} successfully'})
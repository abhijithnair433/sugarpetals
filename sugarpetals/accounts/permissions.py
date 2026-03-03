from rest_framework.permissions import BasePermission

class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'customer'

class IsSeller(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'seller'

class IsDeliveryAgent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'delivery'

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'
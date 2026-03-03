from django.urls import path
from . import views

urlpatterns = [
    path('', views.AllStoresView.as_view(), name='store-list'),               # GET all approved stores
    path('register/', views.RegisterStoreView.as_view(), name='store-register'),  # POST create store
    path('my-store/', views.MyStoreView.as_view(), name='my-store'),          # GET/PUT seller's store
    path('admin/all/', views.AdminStoreView.as_view(), name='admin-stores'),  # GET all stores (admin)
    path('admin/<int:pk>/status/', views.AdminApproveStoreView.as_view(), name='admin-approve'),  # PATCH approve/suspend
]
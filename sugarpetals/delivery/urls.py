from django.urls import path
from . import views

urlpatterns = [
    # delivery agent
    path('register/', views.RegisterDeliveryAgentView.as_view(), name='delivery-register'),
    path('profile/', views.DeliveryAgentProfileView.as_view(), name='delivery-profile'),
    path('my-deliveries/', views.MyDeliveriesView.as_view(), name='my-deliveries'),
    path('my-deliveries/<int:pk>/status/', views.UpdateDeliveryStatusView.as_view(), name='delivery-status'),

    # admin
    path('admin/all/', views.AdminDeliveryListView.as_view(), name='admin-deliveries'),
    path('admin/agents/', views.AvailableAgentsView.as_view(), name='admin-agents'),
    path('admin/assign/<int:order_id>/', views.AdminAssignDeliveryView.as_view(), name='admin-assign'),
]
from django.urls import path
from . import views

urlpatterns = [
    # delivery agent
    path('register/', views.RegisterDeliveryAgentView.as_view(), name='delivery-register'),
    path('profile/', views.DeliveryAgentProfileView.as_view(), name='delivery-profile'),
    path('my-deliveries/', views.MyDeliveriesView.as_view(), name='my-deliveries'),
    path('my-deliveries/<int:pk>/status/', views.UpdateDeliveryStatusView.as_view(), name='delivery-status'),

    # agent self-pickup (NEW)
    path('available-orders/', views.AvailableOrdersForAgentView.as_view(), name='available-orders'),
    path('pickup/<int:order_id>/', views.AgentSelfPickupView.as_view(), name='agent-self-pickup'),

    # admin
    path('admin/all/', views.AdminDeliveryListView.as_view(), name='admin-deliveries'),
    path('admin/agents/', views.AvailableAgentsView.as_view(), name='admin-agents'),
    path('admin/assign/<int:order_id>/', views.AdminAssignDeliveryView.as_view(), name='admin-assign'),
]

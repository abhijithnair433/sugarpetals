from django.urls import path
from . import views

urlpatterns = [
    path('',                        views.ApprovedStoreListView.as_view(),  name='store-list'),        # GET approved stores (public)
    path('register/',               views.StoreRegisterView.as_view(),      name='store-register'),    # POST register (seller)
    path('my-store/',               views.MyStoreView.as_view(),            name='my-store'),          # GET / PUT (seller)
    path('admin/all/',              views.AdminStoreListView.as_view(),     name='admin-store-list'),  # GET all (admin)
    path('admin/<int:pk>/status/',  views.AdminStoreStatusView.as_view(),   name='admin-store-status'),# PATCH (admin)
]

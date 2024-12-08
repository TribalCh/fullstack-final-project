from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SalesOrderViewSet, SalesOrderCreateView, SalesOrderDetailView

# Create a router and register the SalesOrderViewSet with it
router = DefaultRouter()
router.register(r'salesorders', SalesOrderViewSet)

# Define URL patterns
urlpatterns = [
    path('', include(router.urls)),  # This will route to the SalesOrderViewSet for CRUD operations
    path('salesorders/create/', SalesOrderCreateView.as_view(), name='salesorder-create'),  # For creating a new sales order
    path('salesorders/<int:pk>/', SalesOrderDetailView.as_view(), name='salesorder-detail'),  # For viewing a single sales order's details
]

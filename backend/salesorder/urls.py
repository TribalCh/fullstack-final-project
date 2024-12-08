from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SalesOrderViewSet, SalesOrderCreateView, SalesOrderDetailView, CompleteSalesOrderView

# Create a router and register the SalesOrderViewSet with it
router = DefaultRouter()
router.register(r'salesorders', SalesOrderViewSet)

# Define URL patterns
urlpatterns = [
    path('', include(router.urls)),  
    path('salesorders/create/', SalesOrderCreateView.as_view(), name='salesorder-create'),  
    path('salesorders/<int:pk>/', SalesOrderDetailView.as_view(), name='salesorder-detail'),  
    path('salesorders/<int:order_id>/complete/', CompleteSalesOrderView.as_view(), name='complete-sales-order'),
]

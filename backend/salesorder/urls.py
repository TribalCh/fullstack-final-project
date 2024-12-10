from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SalesOrderViewSet, SalesOrderCreateView, SalesOrderDetailView, CompleteSalesOrderView, CartItemsByOrderView, CartViewSet

# Create a router and register the SalesOrderViewSet with it
router = DefaultRouter()
router.register(r'salesorders', SalesOrderViewSet)
router.register(r'carts', CartViewSet)

# Define URL patterns
urlpatterns = [
    path('', include(router.urls)), 
    path('salesorders/create/', SalesOrderCreateView.as_view(), name='salesorder-create'),  
    path('salesorders/<int:pk>/', SalesOrderDetailView.as_view(), name='salesorder-detail'),  
    path('salesorders/<int:order_id>/complete/', CompleteSalesOrderView.as_view(), name='complete-sales-order'),
    path('api/carts/order/<int:order_id>/', CartItemsByOrderView.as_view(), name='cart-items-by-order'),
]

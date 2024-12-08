from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, ProductCreateView, ProductDetailView

# Create a router and register the ProductViewSet with it
router = DefaultRouter()
router.register(r'products', ProductViewSet)

# Define URL patterns
urlpatterns = [
    path('', include(router.urls)),  # This will route to the ProductViewSet for CRUD operations
    path('products/create/', ProductCreateView.as_view(), name='product-create'),  # For creating a new product
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),  # For viewing a single product's details
]

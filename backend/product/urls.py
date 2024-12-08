from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, ProductCreateView, ProductDetailView


router = DefaultRouter()
router.register(r'products', ProductViewSet)


urlpatterns = [
    path('', include(router.urls)),  
    path('products/create/', ProductCreateView.as_view(), name='product-create'),  
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),  
]

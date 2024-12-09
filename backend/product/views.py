from rest_framework import viewsets, generics
from .models import Product, ProductCategory, ProductStockLog
from .serializers import ProductSerializer, ProductCategorySerializer, ProductStockLogSerializer
from rest_framework.permissions import DjangoModelPermissions, AllowAny
from rest_framework.response import Response
import logging

# Set up logging
logger = logging.getLogger(__name__)

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductCategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer

class ProductStockLogViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = ProductStockLog.objects.all()
    serializer_class = ProductStockLogSerializer

class ProductCreateView(generics.CreateAPIView):
    # Temporarily set permission to AllowAny for debugging
    permission_classes = [AllowAny]  
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            return response
        except Exception as e:
            logger.error(f"Error occurred while creating product: {e}")
            return Response({"error": str(e)}, status=500)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [DjangoModelPermissions]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

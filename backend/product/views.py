from rest_framework import viewsets, generics
from .models import Product, ProductCategory, ProductStockLog
from .serializers import ProductSerializer, ProductCategorySerializer, ProductStockLogSerializer
from rest_framework.permissions import DjangoModelPermissions, AllowAny

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
    permission_classes = [DjangoModelPermissions]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [DjangoModelPermissions]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

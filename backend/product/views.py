from rest_framework import viewsets, generics
from .models import Product
from .serializers import ProductSerializer
from rest_framework.permissions import DjangoModelPermissions, AllowAny


class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductCreateView(generics.CreateAPIView):
    permission_classes = [DjangoModelPermissions]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [DjangoModelPermissions]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

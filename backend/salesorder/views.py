from rest_framework import viewsets, generics
from .models import SalesOrder, SalesOrderItem
from .serializers import SalesOrderSerializer, SalesOrderItemSerializer
from rest_framework.permissions import DjangoModelPermissions

# ViewSet for handling CRUD operations for SalesOrder
class SalesOrderViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

# View for creating a new SalesOrder
class SalesOrderCreateView(generics.CreateAPIView):
    permission_classes = [DjangoModelPermissions]
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

# View for retrieving, updating, or deleting a specific SalesOrder
class SalesOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [DjangoModelPermissions]
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

# ViewSet for handling CRUD operations for SalesOrderItem
class SalesOrderItemViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = SalesOrderItem.objects.all()
    serializer_class = SalesOrderItemSerializer

# View for creating a new SalesOrderItem
class SalesOrderItemCreateView(generics.CreateAPIView):
    permission_classes = [DjangoModelPermissions]
    queryset = SalesOrderItem.objects.all()
    serializer_class = SalesOrderItemSerializer

# View for retrieving, updating, or deleting a specific SalesOrderItem
class SalesOrderItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [DjangoModelPermissions]
    queryset = SalesOrderItem.objects.all()
    serializer_class = SalesOrderItemSerializer

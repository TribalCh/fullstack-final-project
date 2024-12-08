from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import DjangoModelPermissions
from .models import SalesOrder, SalesOrderItem
from .serializers import SalesOrderSerializer, SalesOrderItemSerializer

class SalesOrderViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

class SalesOrderCreateView(generics.CreateAPIView):
    permission_classes = [DjangoModelPermissions]
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

class SalesOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [DjangoModelPermissions]
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

class SalesOrderItemViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = SalesOrderItem.objects.all()
    serializer_class = SalesOrderItemSerializer

class SalesOrderItemCreateView(generics.CreateAPIView):
    permission_classes = [DjangoModelPermissions]
    queryset = SalesOrderItem.objects.all()
    serializer_class = SalesOrderItemSerializer

class SalesOrderItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [DjangoModelPermissions]
    queryset = SalesOrderItem.objects.all()
    serializer_class = SalesOrderItemSerializer

class CompleteSalesOrderView(APIView):
    permission_classes = [DjangoModelPermissions]

    def post(self, request, order_id):
        try:
            
            order = SalesOrder.objects.get(order_id=order_id)

            
            if order.status == 'Completed':
                return Response({"message": f"Order {order_id} is already completed."}, status=400)

            
            order.mark_as_completed()

            
            return Response({"message": f"Order {order_id} marked as completed and stock updated."})

        except SalesOrder.DoesNotExist:
            
            return Response({"error": "Order not found."}, status=404)

        except Exception as e:
            
            return Response({"error": f"An error occurred: {str(e)}"}, status=500)

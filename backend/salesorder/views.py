from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import DjangoModelPermissions
from .models import SalesOrder, SalesOrderItem
from .serializers import SalesOrderSerializer, SalesOrderItemSerializer

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

# New view for marking a SalesOrder as completed and updating stock
class CompleteSalesOrderView(APIView):
    permission_classes = [DjangoModelPermissions]

    def post(self, request, order_id):
        try:
            # Retrieve the SalesOrder object by its order_id
            order = SalesOrder.objects.get(order_id=order_id)

            # Ensure the order is not already marked as completed
            if order.status == 'Completed':
                return Response({"message": f"Order {order_id} is already completed."}, status=400)

            # Mark the order as completed, which deducts stock and creates logs
            order.mark_as_completed()

            # Return a success response
            return Response({"message": f"Order {order_id} marked as completed and stock updated."})

        except SalesOrder.DoesNotExist:
            # Handle the case where the order ID does not exist
            return Response({"error": "Order not found."}, status=404)

        except Exception as e:
            # Handle any other unexpected errors
            return Response({"error": f"An error occurred: {str(e)}"}, status=500)

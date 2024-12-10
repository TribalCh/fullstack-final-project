from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import SalesOrder, Cart
from .serializers import SalesOrderSerializer, CartSerializer

class SalesOrderViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

class SalesOrderCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

class SalesOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

class SalesOrderItemCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

class SalesOrderItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

class CartItemsByOrderView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, order_id):
        try:
            # Fetch cart items associated with the given order ID
            cart_items = Cart.objects.filter(order_id=order_id)
            serializer = CartSerializer(cart_items, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=500)

class CompleteSalesOrderView(APIView):
    permission_classes = [AllowAny]

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

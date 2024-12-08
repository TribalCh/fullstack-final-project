from rest_framework import serializers
from .models import SalesOrder, SalesOrderItem

class SalesOrderItemSerializer(serializers.ModelSerializer):
    # Include product details in the item for easier identification
    product = serializers.StringRelatedField()

    class Meta:
        model = SalesOrderItem
        fields = '__all__'

class SalesOrderSerializer(serializers.ModelSerializer):
    # Nested serializer for items related to this order
    order_items = SalesOrderItemSerializer(many=True, read_only=True)
    
    # Calculate and display the final amount directly if needed
    final_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = SalesOrder
        fields = '__all__'

    def create(self, validated_data):
        """Override create method to handle nested order items properly."""
        order_items_data = validated_data.pop('order_items', [])
        order = SalesOrder.objects.create(**validated_data)
        for item_data in order_items_data:
            SalesOrderItem.objects.create(order=order, **item_data)
        order.calculate_total_amount()  # Ensure total is calculated after saving
        return order

    def update(self, instance, validated_data):
        """Override update method to handle nested order items properly."""
        order_items_data = validated_data.pop('order_items', [])
        # Update the order instance
        instance.customer_name = validated_data.get('customer_name', instance.customer_name)
        instance.payment_method = validated_data.get('payment_method', instance.payment_method)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        
        # Clear existing items and add updated ones
        instance.order_items.all().delete()
        for item_data in order_items_data:
            SalesOrderItem.objects.create(order=instance, **item_data)
        
        instance.calculate_total_amount()  # Recalculate totals
        return instance

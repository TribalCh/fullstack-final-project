from rest_framework import serializers
from .models import SalesOrder, Cart

class CartSerializer(serializers.ModelSerializer):
    product = serializers.StringRelatedField()

    class Meta:
        model = Cart
        fields = '__all__'

class SalesOrderSerializer(serializers.ModelSerializer):
    order_items = CartSerializer(many=True, read_only=True)
    
    final_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = SalesOrder
        fields = '__all__'

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items', [])
        order = SalesOrder.objects.create(**validated_data)
        for item_data in order_items_data:
            Cart.objects.create(order=order, **item_data)
        order.calculate_total_amount()  # Ensure total is calculated after saving
        return order

    def update(self, instance, validated_data):
        order_items_data = validated_data.pop('order_items', [])
        
        instance.customer_name = validated_data.get('customer_name', instance.customer_name)
        instance.payment_method = validated_data.get('payment_method', instance.payment_method)
        instance.status = validated_data.get('status', instance.status)
        
        if instance.status == 'Completed':
            instance.mark_as_completed()  # Ensure stock deduction and log creation

        instance.save()
        
        instance.order_items.all().delete()
        for item_data in order_items_data:
            Cart.objects.create(order=instance, **item_data)

        instance.calculate_total_amount()
        return instance

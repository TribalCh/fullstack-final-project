from rest_framework import serializers
from .models import SalesOrder, Cart, Product

class CartSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')  # Assuming `name` is a field on `Product`
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'product', 'product_name', 'unit_price', 'quantity', 'subtotal']

    def get_subtotal(self, obj):
        return float(obj.unit_price) * int(obj.quantity)  # Calculating subtotal dynamically

class SalesOrderSerializer(serializers.ModelSerializer):
    order_items = CartSerializer(many=True, read_only=True, source='cart_set')  # Ensure this matches the related name in your model
    final_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = SalesOrder
        fields = '__all__'

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items', [])
        order = SalesOrder.objects.create(**validated_data)

        # Create each cart item and associate it with the sales order
        for item_data in order_items_data:
            Cart.objects.create(order=order, product=item_data['product'], quantity=item_data['quantity'], price_at_purchase=item_data['price_at_purchase'])

        # Calculate and set the total amount for the order after adding items
        order.calculate_total_amount()
        return order

    def update(self, instance, validated_data):
        order_items_data = validated_data.pop('order_items', [])

        # Update the main order fields
        instance.customer_name = validated_data.get('customer_name', instance.customer_name)
        instance.payment_method = validated_data.get('payment_method', instance.payment_method)
        instance.status = validated_data.get('status', instance.status)

        # Ensure any additional operations based on the status
        if instance.status == 'Completed':
            instance.mark_as_completed()  # Deduct stock and log order completion

        # Save updated order instance
        instance.save()

        # Clear existing order items and create new ones
        instance.cart_set.all().delete()
        for item_data in order_items_data:
            Cart.objects.create(order=instance, product=item_data['product'], quantity=item_data['quantity'], price_at_purchase=item_data['price_at_purchase'])

        # Recalculate the total amount after updating order items
        instance.calculate_total_amount()
        return instance

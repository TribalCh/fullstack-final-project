from rest_framework import serializers
from .models import SalesOrder, Cart
from .models import Product  # Make sure to import your Product model if needed

class CartSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    def validate(self, data):
        # Custom validation to ensure stock availability
        product = data.get('product')
        quantity = data.get('quantity')

        if product and quantity > product.stock_quantity:
            raise serializers.ValidationError(f"Not enough stock available for {product.name}.")
        return data

    def create(self, validated_data):
        # Set the price_at_purchase to the product's current unit price when creating a new Cart item
        product = validated_data.get('product')
        validated_data['price_at_purchase'] = product.unit_price
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Set the price_at_purchase to the product's current unit price when updating an existing Cart item
        product = validated_data.get('product', instance.product)
        validated_data['price_at_purchase'] = product.unit_price
        return super().update(instance, validated_data)

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
        
        # Create each cart item and associate it with the sales order
        for item_data in order_items_data:
            Cart.objects.create(order=order, product=item_data['product'], quantity=item_data['quantity'], price_at_purchase=item_data['price_at_purchase'])
        
        order.calculate_total_amount()  # Ensure total is calculated after saving
        return order

    def update(self, instance, validated_data):
        order_items_data = validated_data.pop('order_items', [])
        
        # Update the main order fields
        instance.customer_name = validated_data.get('customer_name', instance.customer_name)
        instance.payment_method = validated_data.get('payment_method', instance.payment_method)
        instance.status = validated_data.get('status', instance.status)
        
        if instance.status == 'Completed':
            instance.mark_as_completed()  # Ensure stock deduction and log creation

        instance.save()
        
        # Clear existing order items and create new ones
        instance.order_items.all().delete()
        for item_data in order_items_data:
            Cart.objects.create(order=instance, product=item_data['product'], quantity=item_data['quantity'], price_at_purchase=item_data['price_at_purchase'])

        instance.calculate_total_amount()
        return instance

from rest_framework import serializers
from .models import Product, ProductCategory, ProductStockLog

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    # Use PrimaryKeyRelatedField for input (ID) and ReadOnlyField for output (name)
    category_name = serializers.ReadOnlyField(source='category.name')  # For displaying category name
    category = serializers.PrimaryKeyRelatedField(queryset=ProductCategory.objects.all())  # For accepting category ID

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'category_name', 'brand', 'sku',
            'unit_price', 'stock_quantity', 'is_perishable', 'expiration_date'
        ]

    def create(self, validated_data):
        # Custom create logic if needed
        return Product.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Custom update logic if needed
        instance = super().update(instance, validated_data)
        return instance

class ProductStockLogSerializer(serializers.ModelSerializer):
    product = serializers.StringRelatedField()

    class Meta:
        model = ProductStockLog
        fields = '__all__'

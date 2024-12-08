from rest_framework import serializers
from .models import Product, ProductCategory, ProductStockLog

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    # Nested serializer for the category field
    category = ProductCategorySerializer()
    
    # Optionally include a field to show related stock logs
    stock_logs = serializers.StringRelatedField(many=True)

    class Meta:
        model = Product
        fields = '__all__'

class ProductStockLogSerializer(serializers.ModelSerializer):
    # Display product name for easy identification
    product = serializers.StringRelatedField()

    class Meta:
        model = ProductStockLog
        fields = '__all__'

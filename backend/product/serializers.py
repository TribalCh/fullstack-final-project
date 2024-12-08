from rest_framework import serializers
from .models import Product, ProductCategory, ProductStockLog

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer()
    
    stock_logs = serializers.StringRelatedField(many=True)

    class Meta:
        model = Product
        fields = '__all__'

class ProductStockLogSerializer(serializers.ModelSerializer):
    
    product = serializers.StringRelatedField()

    class Meta:
        model = ProductStockLog
        fields = '__all__'

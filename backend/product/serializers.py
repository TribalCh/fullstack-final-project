from rest_framework import serializers
from .models import Product, ProductCategory, ProductStockLog

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    # Change the category field to accept an ID instead of an object
    category = serializers.PrimaryKeyRelatedField(queryset=ProductCategory.objects.all())
    #stock_logs = serializers.StringRelatedField(many=True)

    class Meta:
        model = Product
        fields = '__all__'

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

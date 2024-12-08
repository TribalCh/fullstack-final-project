from django.contrib import admin
from .models import ProductCategory, Product, ProductStockLog

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'sku', 'unit_price', 'stock_quantity', 'is_perishable', 'expiration_date')
    list_filter = ('category', 'is_perishable')
    search_fields = ('name', 'sku', 'brand')
    ordering = ('name',)

@admin.register(ProductStockLog)
class ProductStockLogAdmin(admin.ModelAdmin):
    list_display = ('product', 'change_quantity', 'log_date', 'description')
    list_filter = ('log_date',)
    search_fields = ('product__name',)
    ordering = ('-log_date',)

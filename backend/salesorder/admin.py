from django.contrib import admin
from .models import SalesOrder, SalesOrderItem

@admin.register(SalesOrder)
class SalesOrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'customer_name', 'order_date', 'total_amount', 'final_amount', 'payment_method')
    search_fields = ('order_id', 'customer_name')

@admin.register(SalesOrderItem)
class SalesOrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price_at_purchase', 'total_price')
    search_fields = ('order__order_id', 'product__name')

from django.db import models
from django.contrib.auth.models import User  

class ProductCategory(models.Model):
    id = models.AutoField(primary_key=True)  # Explicit AutoField ID
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name='products')
    brand = models.CharField(max_length=100, blank=True, null=True)
    sku = models.CharField(max_length=50, unique=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField()
    is_perishable = models.BooleanField(default=False)
    expiration_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.sku})"

    class Meta:
        ordering = ['name']

    def deduct_stock(self, quantity):
        if self.stock_quantity >= quantity:
            self.stock_quantity -= quantity
            self.save()
            return True
        else:
            raise ValueError("Insufficient stock available.")

    def add_stock(self, quantity):
        self.stock_quantity += quantity
        self.save()

class ProductStockLog(models.Model):
    id = models.AutoField(primary_key=True)  # Explicit AutoField ID
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_logs')
    change_quantity = models.IntegerField()
    log_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)  

    def __str__(self):
        return f"{self.change_quantity} units for {self.product.name} on {self.log_date.strftime('%Y-%m-%d')}"

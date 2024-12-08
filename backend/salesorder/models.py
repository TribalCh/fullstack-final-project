# salesorder/models.py
from django.db import models
from django.utils import timezone
from product.models import Product  # Import the Product model from the existing product module

class SalesOrder(models.Model):
    order_id = models.AutoField(primary_key=True)
    customer_name = models.CharField(max_length=100)
    order_date = models.DateTimeField(default=timezone.now)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    status = models.CharField(
        max_length=50,
        choices=[
            ('Pending', 'Pending'),
            ('Processing', 'Processing'),
            ('Completed', 'Completed'),
            ('Cancelled', 'Cancelled')
        ],
        default='Pending'
    )
    payment_method = models.CharField(
        max_length=50,
        choices=[
            ('Cash', 'Cash'),
            ('Credit Card', 'Credit Card'),
            ('Debit Card', 'Debit Card'),
            ('Digital Wallet', 'Digital Wallet')
        ],
        default='Cash'
    )
    final_amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, editable=False)

    def __str__(self):
        return f"Order {self.order_id} - {self.customer_name}"

    def calculate_total_amount(self):
        """Calculate the total amount for the order based on its items."""
        total = sum(item.total_price for item in self.order_items.all())
        self.total_amount = total
        self.calculate_final_amount()
        self.save()

class SalesOrderItem(models.Model):
    order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    @property
    def unit_price(self):
        """Return the unit price of the product."""
        return self.product.unit_price

    def save(self, *args, **kwargs):
        """Override save method to calculate total price before saving."""
        self.price_at_purchase = self.unit_price  # Ensure price_at_purchase is set correctly at the time of saving
        self.total_price = self.quantity * self.price_at_purchase
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} for Order {self.order.order_id}"

from django.db import models
from django.utils import timezone
from product.models import Product, ProductStockLog  # Import the Product model and ProductStockLog

class SalesOrder(models.Model):
    order_id = models.AutoField(primary_key=True)
    customer_name = models.CharField(max_length=100)
    order_date = models.DateTimeField(default=timezone.now)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    payment_method = models.CharField(
        max_length=50,
        choices=[('Cash', 'Cash'), ('Credit Card', 'Credit Card'), ('Debit Card', 'Debit Card'), ('Digital Wallet', 'Digital Wallet')],
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

    def calculate_final_amount(self):
        """Calculate the final amount after applying tax."""
        if hasattr(self, 'tax_rate') and self.tax_rate > 0:
            self.final_amount = self.total_amount + (self.tax_rate / 100 * self.total_amount)
        else:
            self.final_amount = self.total_amount

        self.save()

class SalesOrderItem(models.Model):
    order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        editable=False
    )
    total_price = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    @property
    def unit_price(self):
        """Return the unit price of the product."""
        return self.product.unit_price

    def save(self, *args, **kwargs):
        """Override save method to adjust stock and log changes when creating or updating a SalesOrderItem."""
        if self.pk:  # This block runs when updating an existing SalesOrderItem
            original = SalesOrderItem.objects.get(pk=self.pk)
            if self.quantity != original.quantity:
                # Calculate the difference in quantity
                quantity_difference = self.quantity - original.quantity

                # Adjust stock accordingly (add if quantity is reduced, subtract if increased)
                self.product.stock_quantity -= quantity_difference
                if self.product.stock_quantity < 0:
                    raise ValueError(f"Not enough stock available for {self.product.name}. Current stock: {self.product.stock_quantity + quantity_difference}")
                
                self.product.save()
                
                # Log the change in stock
                ProductStockLog.objects.create(
                    product=self.product,
                    change_quantity=-quantity_difference,
                    description=f"Stock adjustment for order {self.order.order_id} (Item: {self.product.name})"
                )
        else:  # This block runs only when creating a new SalesOrderItem
            if self.product.stock_quantity < self.quantity:
                raise ValueError(f"Not enough stock available for {self.product.name}. Current stock: {self.product.stock_quantity}")

            # Deduct stock and log the change when creating a new item
            self.product.stock_quantity -= self.quantity
            self.product.save()
            ProductStockLog.objects.create(
                product=self.product,
                change_quantity=-self.quantity,
                description=f"Stock deduction for order {self.order.order_id} (Item: {self.product.name})"
            )

        # Set price at purchase and calculate total price
        self.price_at_purchase = self.unit_price  # Set price_at_purchase at the time of saving
        self.total_price = self.quantity * self.price_at_purchase

        super().save(*args, **kwargs)

        # Update the total amount in the related SalesOrder
        if self.order:
            self.order.calculate_total_amount()

    def delete(self, *args, **kwargs):
        """Override delete method to revert stock changes when an item is deleted."""
        # Increment the stock quantity by the quantity of the SalesOrderItem being deleted
        self.product.stock_quantity += self.quantity
        self.product.save()

        # Create a ProductStockLog entry for stock restoration
        ProductStockLog.objects.create(
            product=self.product,
            change_quantity=self.quantity,
            description=f"Stock restoration for deleted order {self.order.order_id} (Item: {self.product.name})"
        )

        super().delete(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} for Order {self.order.order_id}"

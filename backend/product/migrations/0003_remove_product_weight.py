# Generated by Django 4.2.17 on 2024-12-08 07:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0002_alter_product_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='weight',
        ),
    ]
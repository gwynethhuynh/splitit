from django.db import models

# Create your models here.
class Receipt(models.Model):
    tax = models.DecimalField(max_digits=6, decimal_places=2)
    total = models.DecimalField(max_digits=6, decimal_places=2)
    def _str_(self):
        return self.id

class Item(models.Model):
    name = models.CharField(max_length=120)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    receipt = models.ForeignKey(Receipt, related_name='items', on_delete=models.CASCADE, blank=True)
    def _str_(self):
        return self.name
    
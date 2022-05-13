from django.contrib import admin
from .models import  Receipt, Item

class ReceiptAdmin(admin.ModelAdmin):
    list_display = ('id', 'tax', 'total')

class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'receipt')

# Register your models here.
admin.site.register(Receipt, ReceiptAdmin)
admin.site.register(Item, ItemAdmin)


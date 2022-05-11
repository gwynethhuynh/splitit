from rest_framework import serializers
from .models import Receipt, Item


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('id', 'name', 'price', 'receipt')

class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = ('id', 'tax', 'total', 'items')


    # def create(self, validated_data):
    #     print("Hello")
    #     items_data = validated_data.pop('items')
    #     receipt = Receipt.objects.create(**validated_data)
    #     for item_data in items_data:
    #         #TODO: Bulk insert?
    #         print(receipt)
    #         Item.objects.create(receipt=receipt, **item_data)
    #     return receipt


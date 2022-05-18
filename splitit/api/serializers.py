from rest_framework import serializers
from .models import Receipt, Item



class ItemSerializer(serializers.ModelSerializer):
    #  https://stackoverflow.com/questions/37240621/django-rest-framework-updating-nested-objectav
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Item
        fields = ('id', 'name', 'price', 'receipt')

class ReceiptSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True)
    
    class Meta:
        model = Receipt
        fields = ('id', 'tax', 'total', 'items')

    def create(self, validated_data):
        print("Hello ================>")
        items_data = validated_data.pop('items')
        receipt = Receipt.objects.create(**validated_data)
        for item_data in items_data:
            #TODO: Bulk insert?
            print(receipt)
            Item.objects.create(receipt=receipt, **item_data)
        return receipt

    def update(self, receipt, validated_data):
        print("---> update")
        # print(validated_data)
        items_data = validated_data.pop('items')
        print(items_data)
        receipt.tax = validated_data.get("tax", receipt.tax)
        receipt.total = validated_data.get("total", receipt.total)
        receipt.save()
        print("---> update complete")
        
        for item_data in items_data:
            print(item_data)
            item = Item.objects.get(pk=item_data['id'])
            item.name = item_data.get('name', item.name)
            item.price = item_data.get('price', item.price)
            item.save()
        return receipt
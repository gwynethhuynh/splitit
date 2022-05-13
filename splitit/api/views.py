from django.shortcuts import render
from rest_framework import generics, status
from .models import Receipt, Item
from .serializers import ItemSerializer, ReceiptSerializer, CreateReceiptSerializer
from .receipt_parser import ReceiptParser
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

#Create API view
class ReceiptView(generics.CreateAPIView):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer

class GetItems(APIView):
    serializer_class = ItemSerializer
    lookup_url_kwarg = 'receipt'

    def get(self, request, format=None):
        receiptId = request.GET.get(self.lookup_url_kwarg)
        print(request.GET)
        if receiptId:
            items = Item.objects.filter(receipt=receiptId)
            serialized_items = self.serializer_class(items, many=True)
            # if serialized_items.is_valid():
            return Response(serialized_items.data, status=status.HTTP_200_OK)
            # else:
            #     print(serialized_items.errors)
            #     return Response({'Message': 'Invalid Items'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'Message' : 'Receipt ID is required'}, status=status.HTTP_400_BAD_REQUEST)
           



class CreateReceiptView(APIView):
    serializer_class = CreateReceiptSerializer

     # @Override
    def post(self, request, format=None):
        filepath = request.FILES.get('myFile', False)
        if filepath:
            print("Request data", request.FILES['myFile'])
            parsed = ReceiptParser.parseImage(request.FILES['myFile'])
        else:
            print("-------->")
            print(request.data)
            parsed = request.data
        print(parsed)
        serializer = self.serializer_class(data=parsed)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


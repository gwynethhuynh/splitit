from django.shortcuts import render
from rest_framework import generics, status
from .models import Receipt
from .serializers import ReceiptSerializer, CreateReceiptSerializer
from .receipt_parser import ReceiptParser
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

#Create API view
class ReceiptView(generics.CreateAPIView):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer


class CreateReceiptView(APIView):
    serializer_class = CreateReceiptSerializer

     # @Override
    def post(self, request, format=None):
        # print("Request data", request.FILES['myFile'])
        # parsed = ReceiptParser.parseImage(request.FILES['myFile'])
        parsed = {'tax': 3.00, 'total': 6.00, 'items': [{"chicken": 1.00}]}
        print(parsed)
        #receiptFields = {'tax': parsed['tax'], 'total': parsed['total']}
        serializer = self.serializer_class(data=parsed)
        print(serializer)
        if serializer.is_valid():
            tax = serializer.data.get('tax')
            total = serializer.data.get('total')
            # items = serializer.data.get('items')
            receipt = Receipt(tax=tax, total=total)
            receipt.save()
        return Response(ReceiptSerializer(receipt).data, status=status.HTTP_201_CREATED)
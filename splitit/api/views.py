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
        filepath = request.FILES.get('myFile', False)
        if filepath:
            print("Request data", request.FILES['myFile'])
            parsed = ReceiptParser.parseImage(request.FILES['myFile'])
        else:
            print("-------->")
            print(request.data)
            parsed = request.data
            # parsed = {'tax': 10.00, 'total': 12.00, 'items': [{"chicken": 1.00}]}
        print(parsed)
        # receiptFields = {'tax': parsed['tax'], 'total': parsed['total']}
        serializer = self.serializer_class(data=parsed)
        print(serializer)
        s_is_valid = serializer.is_valid()
        print("s_is_valid", s_is_valid, serializer.errors)
        if s_is_valid:
            # tax = serializer.data.get('tax')
            # total = serializer.data.get('total')
            # items = serializer.data.get('items')
            serializer.save()
            # receipt = Receipt(tax=tax, total=total)
            # receipt.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(ReceiptSerializer(receipt).data, status=status.HTTP_201_CREATED)


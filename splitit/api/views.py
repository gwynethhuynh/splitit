from django.shortcuts import render
from rest_framework import generics, status
from .models import Receipt
from .serializers import ReceiptSerializer
from .receipt_parser import ReceiptParser
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

#Create API view
class ReceiptView(generics.CreateAPIView):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer

     # @Override
    # def create(self, request):
    #     print("Request data", request.FILES['myFile'])
    #     parsed = ReceiptParser.parseImage(request.FILES['myFile'])
    #     print(parsed)
    #     #receiptFields = {'tax': parsed['tax'], 'total': parsed['total']}
    #     receiptSerializer = ReceiptSerializer(data=parsed)
    #     print(receiptSerializer)
    #     receiptSerializer.is_valid(raise_exception=True)
    #     receiptSerializer.save()
    #     return Response(receiptSerializer.data)

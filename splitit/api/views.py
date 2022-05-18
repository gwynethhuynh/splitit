from django.shortcuts import render
from rest_framework import generics, status
from .models import Receipt
from .serializers import ReceiptSerializer
from .receipt_parser import ReceiptParser
from rest_framework.views import APIView
from rest_framework.response import Response
import json

# Create your views here.

#Create API view
class ReceiptView(generics.CreateAPIView):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer


class GetReceiptView(APIView):
    serializer_class = ReceiptSerializer
    lookup_url_kwarg = 'receipt'

    def get(self, request, format=None):
        receiptId = request.GET.get(self.lookup_url_kwarg)
        if receiptId:
            receipt = Receipt.objects.get(pk=receiptId) # TODO: try catch if not found
            serializer = self.serializer_class(receipt)
            return Response(serializer.data, status=status.HTTP_200_OK)
            # else:
            #     print(serialized_items.errors)
            #     return Response({'Message': 'Invalid Items'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'Message' : 'Receipt ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    # def put(self, request, )


class PutReceiptView(APIView):
    serializer_class = ReceiptSerializer
    lookup_url_kwarg = 'receipt'
    

    def put(self, request):
        receiptId = request.GET.get(self.lookup_url_kwarg)
        try:
            receipt = Receipt.objects.get(pk=receiptId)
        except Receipt.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        receiptData = json.loads(request.body)
        print(receiptData)
        # del receiptData['items']
        serializer = self.serializer_class(receipt, data=receiptData)
        print("----> created serializer")
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)
        return Response({'Message' : 'Invalid Receipt', 'Errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)            



class CreateReceiptView(APIView):
    serializer_class = ReceiptSerializer

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


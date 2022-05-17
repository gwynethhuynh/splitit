from django.urls import path
from .views import ReceiptView, CreateReceiptView, GetReceiptView, PutReceiptView

urlpatterns = [
    path('receipts/', ReceiptView.as_view()),
    path('create/', CreateReceiptView.as_view()),
    path('get-receipt/', GetReceiptView.as_view()),
    path('put-receipt/', PutReceiptView.as_view()),
]
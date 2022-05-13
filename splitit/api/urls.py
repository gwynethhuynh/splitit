from django.urls import path
from .views import ReceiptView, CreateReceiptView, GetReceiptView

urlpatterns = [
    path('receipts/', ReceiptView.as_view()),
    path('create/', CreateReceiptView.as_view()),
    path('get-receipt/', GetReceiptView.as_view()),
]
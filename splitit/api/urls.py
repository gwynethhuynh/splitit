from django.urls import path
from .views import ReceiptView, CreateReceiptView

urlpatterns = [
    path('receipts/', ReceiptView.as_view()),
    path('create/', CreateReceiptView.as_view())
]
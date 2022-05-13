from django.urls import path
from .views import ReceiptView, CreateReceiptView, GetItems

urlpatterns = [
    path('receipts/', ReceiptView.as_view()),
    path('create/', CreateReceiptView.as_view()),
    path('get-items/', GetItems.as_view()),
]
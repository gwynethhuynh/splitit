from django.urls import path
from .views import ReceiptView

urlpatterns = [
    path('receipts/', ReceiptView.as_view()),
]
from django.urls import path
from .views import ReceiptView

urlpatterns = [
    path('goals/', ReceiptView.as_view()),
    path('wows/', ReceiptView.as_view()),
    path('abc/', ReceiptView.as_view()),
    path('def/', ReceiptView.as_view()),
    path(r'receipts', ReceiptView.as_view())
]
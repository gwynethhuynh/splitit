from django.urls import path, include
from .views import index

urlpatterns = [
    path('', index),
    path('hello/', index),
    path('add/', index),
    path('receipts/<str:receiptId>', index)
    
]
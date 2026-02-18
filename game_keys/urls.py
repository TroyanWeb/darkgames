from django.urls import path
from . import views

urlpatterns = [
    path('', views.games_catalog, name='catalog'),
    path('<slug:slug>/', views.GamesDetailView.as_view(), name='games-detail'),
    path('search/', views.games_catalog, name='search'),
]

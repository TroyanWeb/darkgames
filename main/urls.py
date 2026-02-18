from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('about-us', views.about, name='about'),
    path('agreement', views.agreement, name='agreement'),
    path('guarantees', views.guarantees, name='guarantees'),
    path('privacy-policy', views.privacy_policy, name='privacy-policy'),
    path('reviews', views.reviews, name='reviews'),
    path('support', views.support, name='support'),
    path('principles', views.principles, name='principles'),
    path("search/", views.search_games, name="search_games"),
    path('cart/', views.cart_view, name='cart'),  # Новый URL для корзины
    path('checkout/', views.checkout, name='checkout'),
    path('add_to_cart/<int:game_id>/', views.add_to_cart, name='add_to_cart'),
    path('clear_cart/', views.clear_cart, name='clear_cart'),
    path('complete_order/', views.complete_order, name='complete_order'),
    path('order-confirmation/', views.order_confirmation, name='order_confirmation'),
    path('get_cart_state/', views.get_cart_state, name='get_cart_state'),
    path('remove_from_cart/<int:game_id>/', views.remove_from_cart, name='remove_from_cart'),
]
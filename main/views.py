from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render
from django.db.models import Q
from game_keys.models import GameItem, Order, OrderItem
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.shortcuts import redirect
from main.forms import OrderForm
from django.core.mail import send_mail
from django.conf import settings
from django.templatetags.static import static


def index(request):
    games = GameItem.objects.order_by('-views')[:5]
    top_games = GameItem.objects.filter(release_date__isnull=False).order_by('-release_date')[:5]
    editors_choice_games = GameItem.objects.filter(is_editors_choice=True)[:5]
    context = {
        'title': 'DarkGames — магазин видеоигр',
        'games': games,
        'top_games': top_games,
        'editors_choice_games': editors_choice_games
    }
    return render(request, 'main/index.html', context)


def about(request):
    context = {
        'title': 'О нас | DarkGames — плати меньше, играй больше',
    }
    return render(request, 'main/about.html', context)


def agreement(request):
    context = {
        'title': 'Соглашение | DarkGames',
    }
    return render(request, 'main/agreement.html', context)


def guarantees(request):
    context = {
        'title': 'Гарантии | DarkGames',
    }
    return render(request, 'main/guarantees.html', context)


def privacy_policy(request):
    context = {
        'title': 'Политика конфиденциальности | DarkGames',
    }
    return render(request, 'main/privacy-policy.html', context)


def reviews(request):
    context = {
        'title': 'Отзывы | DarkGames',
    }
    return render(request, 'main/reviews.html', context)


def support(request):
    context = {
        'title': 'Поддержка | DarkGames',
    }
    return render(request, 'main/support.html', context)


def principles(request):
    context = {
        'title': 'Наши принципы | DarkGames',
    }
    return render(request, 'main/principles.html', context)


def order_confirmation(request):
    context = {
        'title': 'Заказ подтвержден | DarkGames',
    }
    return render(request, 'main/order_confirmation.html', context)


def search_games(request):
    query = request.GET.get("q", "")
    if query:
        games = GameItem.objects.filter(Q(title__icontains=query))
        results = [
            {
                "title": game.title,
                "slug": game.slug,
                "price": game.price,
                "image_url": game.catalog_image.url if game.catalog_image else None  # Добавляем URL изображения
            }
            for game in games
        ]
    else:
        results = []
    return JsonResponse(results, safe=False)


def add_to_cart(request, game_id):
    game = get_object_or_404(GameItem, pk=game_id)
    cart = request.session.get('cart', {})

    # Добавляем товар в корзину, если его ещё нет
    if str(game.id) not in cart:
        cart[str(game.id)] = {
            'title': game.title,
            'price': game.price,
            'product_image': game.catalog_image.url if game.catalog_image else static('main/img/default-game.png')
        }
    request.session['cart'] = cart
    request.session.modified = True

    # Считаем общую стоимость и количество товаров
    total_items = len(cart)
    total_price = sum(item['price'] for item in cart.values())

    return JsonResponse({
        'item_count': total_items,
        'total_price': total_price,
        'cart': cart,
        'game_title': game.title,
        'game_price': game.price,
        'product_image': cart[str(game.id)]['product_image']
    })


def clear_cart(request):
    # Очищаем корзину в сессии
    if 'cart' in request.session:
        del request.session['cart']
    return JsonResponse({"status": "success", "message": "Корзина очищена"})


def checkout(request):
    cart = request.session.get('cart', {})
    total_price = sum(item['price'] for item in cart.values())

    if request.method == "POST":
        form = OrderForm(request.POST)
        if form.is_valid():
            # Создаём заказ
            order = Order.objects.create(
                customer_name=form.cleaned_data['customer_name'],
                customer_email=form.cleaned_data['customer_email'],
                total_price=total_price
            )

            # Создаём позиции заказа
            for item in cart.values():
                OrderItem.objects.create(
                    order=order,
                    title=item['title'],
                    price=item['price']
                )

            # Отправляем уведомление (см. шаг 3)
            send_order_email(order)

            # Очищаем корзину
            del request.session['cart']
            request.session.modified = True

            # Редирект на страницу подтверждения
            return redirect('order_confirmation')

    else:
        form = OrderForm()

    return render(request, 'main/checkout.html', {
        'title': "Оформление заказа | DarkGames",
        'cart': cart,
        'total_price': total_price,
        'form': form
    })


def complete_order(request):
    if request.method == "POST":
        # Логика завершения заказа, например:
        # Сохранение заказа в базе данных, отправка уведомлений и т.д.
        # После выполнения действий, очищаем корзину:
        if 'cart' in request.session:
            del request.session['cart']

        # Перенаправляем на страницу с подтверждением оформления
        return render(request, 'main/order_confirmation.html')

    # Если метод не POST, возвращаем ошибку или редирект
    return JsonResponse({"error": "Неверный запрос"}, status=400)


def send_order_email(order):
    subject = f"Ваш заказ #{order.id} принят!"
    message = (
        f"Здравствуйте, {order.customer_name}!\n\n"
        f"Ваш заказ принят. Детали заказа:\n\n"
    )
    for item in order.items.all():
        message += f"- {item.title}: {item.price}₽\n"
    message += f"\nОбщая стоимость: {order.total_price}₽\n"
    message += "\nСпасибо за покупку!"

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [order.customer_email],
        fail_silently=False,
    )


def cart_view(request):
    cart = request.session.get('cart', {})
    total_price = sum(item['price'] for item in cart.values())
    return render(request, 'main/cart.html', {
        'title': "Корзина | DarkGames",
        'cart': cart,
        'total_price': total_price
    })


def get_cart_state(request):
    cart = request.session.get('cart', {})
    item_count = len(cart)  # Количество товаров
    return JsonResponse({'item_count': item_count})


def remove_from_cart(request, game_id):
    cart = request.session.get('cart', {})

    if str(game_id) in cart:
        del cart[str(game_id)]  # Удаляем товар из корзины
        request.session['cart'] = cart  # Обновляем сессию

    item_count = len(cart)  # Обновляем количество товаров
    total_price = sum(item['price'] for item in cart.values())  # Пересчитываем общую стоимость

    return JsonResponse({'item_count': item_count, 'total_price': total_price})
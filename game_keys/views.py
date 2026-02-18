from django.shortcuts import render
import requests
from django.views.generic import DetailView
from .models import GameItem
from .models import ACTIVATION_CHOICES
from .models import GENRE_CHOICES
from .models import SliderImage
import datetime
from babel.dates import format_date
from django.utils.text import slugify

from django.db.models import Q


def games_catalog(request):
    sort_param = request.GET.get('sort', 'views')  # По умолчанию сортировка по популярности
    selected_activations = request.GET.getlist('activation')
    selected_genres = request.GET.getlist('genre')  # Получаем выбранные жанры

    # Обработка параметров сортировки
    if sort_param == 'price':
        if request.session.get('price_order') == 'descending':
            catalog = GameItem.objects.all().order_by('-price')
            request.session['price_order'] = 'ascending'
        else:
            catalog = GameItem.objects.all().order_by('price')
            request.session['price_order'] = 'descending'
    elif sort_param == 'release_date':
        if request.session.get('release_date_order') == 'descending':
            catalog = GameItem.objects.all().order_by('release_date')
            request.session['release_date_order'] = 'ascending'
        else:
            catalog = GameItem.objects.all().order_by('-release_date')
            request.session['release_date_order'] = 'descending'
    else:
        catalog = GameItem.objects.all().order_by('-views')

    # Фильтрация по выбранным активациям
    if selected_activations:
        catalog = catalog.filter(activation__in=selected_activations)

    # Фильтрация по выбранным жанрам
    if selected_genres:
        catalog = catalog.filter(genre__in=selected_genres)

    return render(request, 'game_keys/catalog.html', {
        'catalog': catalog,
        'sort_param': sort_param,
        'title': 'Каталог товаров | DarkGames',
        'ACTIVATION_CHOICES': ACTIVATION_CHOICES,
        'GENRE_CHOICES': GENRE_CHOICES,  # Передайте CHOICES для жанров в шаблон
        'selected_activations': selected_activations,
        'selected_genres': selected_genres,  # Передайте выбранные жанры в шаблон
    })


class GamesDetailView(DetailView):
    model = GameItem
    template_name = 'game_keys/detail_view.html'
    context_object_name = 'game'
    slug_field = 'slug'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Получение текущей игры
        game = self.object
        app_id = game.app_id  # Используем app_id из модели

        # Получение изображений слайдера для текущей игры
        slider_images = SliderImage.objects.filter(game=game)
        context['slider_images'] = slider_images

        # Получение информации о жанре игры из API Steam
        api_key = "9E03DA9A2E5D2EF857FBF5873913AF5F"  # Замените на ваш реальный API ключ
        url = f"https://store.steampowered.com/api/appdetails?appids={app_id}&cc=RU"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            if data[str(app_id)]["success"]:
                game_data = data[str(app_id)]["data"]

                # Получение даты выхода игры
                if "release_date" in game_data:
                    release_date_str = game_data["release_date"]["date"]
                    try:
                        # Преобразуем строку в объект datetime
                        release_date_obj = datetime.datetime.strptime(release_date_str, "%d %b, %Y")
                        # Форматируем дату в стиле 11 марта 2004
                        release_date_formatted = format_date(release_date_obj, format='d MMMM y', locale='ru')
                    except ValueError:
                        release_date_formatted = release_date_str  # Если формат даты другой, оставляем оригинал
                    context['game_release_date'] = release_date_formatted
                else:
                    context['game_release_date'] = "Дата выхода не указана"

                # Получение разработчика игры
                if "developers" in game_data:
                    developers = ", ".join(game_data["developers"])
                    context['game_developers'] = developers
                else:
                    context['game_developers'] = "Разработчик не указан"

                # Получение издателя игры
                if "publishers" in game_data:
                    publishers = ", ".join(game_data["publishers"])
                    context['game_publishers'] = publishers
                else:
                    context['game_publishers'] = "Издатель не указан"
            else:
                context['game_release_date'] = "Ошибка при получении данных об игре"
                context['game_developers'] = "Ошибка при получении данных об игре"
                context['game_publishers'] = "Ошибка при получении данных об игре"
        else:
            context['game_release_date'] = "Ошибка при выполнении запроса"
            context['game_developers'] = "Ошибка при выполнении запроса"
            context['game_publishers'] = "Ошибка при выполнении запроса"

        return context




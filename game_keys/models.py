from django.db import models
from django.dispatch import receiver
from django.db.models.signals import pre_delete
from django.utils.text import slugify
from elasticsearch_dsl import Document, Text
from elasticsearch_dsl.connections import connections
from django.conf import settings
from django.db.models.signals import post_save
from django.db.models.signals import post_delete
from django.core.exceptions import ValidationError
import os
import re


def game_screenshot_upload_path(instance, filename):
    # Очищаем название игры от недопустимых символов для имени папки
    game_title_cleaned = re.sub(r'[^\w\s]', ' ', instance.title)
    # Заменяем множественные пробелы на одиночные
    game_title_cleaned = re.sub(r'\s+', ' ', game_title_cleaned).strip()
    # Формируем путь: screenshots/<очищенное название игры>/<имя файла><расширение>
    filename_base, filename_ext = os.path.splitext(filename)
    return f"screenshots/{game_title_cleaned}/{filename_base}{filename_ext}"


ACTIVATION_CHOICES = [
    ('Steam', 'Steam'),
    ('EA', 'EA'),
    ('Ubisoft', 'Ubisoft'),
    ('Epic Games', 'Epic Games'),
    ('GOG', 'GOG'),
    ('Rockstar', 'Rockstar'),
    ('Microsoft Store', 'Microsoft Store'),
    ('VK Play', 'VK Play'),
]

GENRE_CHOICES = [
    ('action', 'Экшен'),
    ('shooter', 'Шутер'),
    ('strategy', 'Стратегия'),
    ('indie', 'Инди'),
    ('adventure', 'Приключение'),
    ('simulator', 'Симулятор'),
    ('role-playing', 'Ролевая игра'),
    ('fighting', 'Файтинг'),
    ('sandbox', 'Песочница'),
    ('rpg', 'RPG'),
    ('survival', 'Выживание'),
    ('horror', 'Хоррор'),
    ('casual', 'Казуальная'),
]

REGION_CHOICES = [
    ('Весь мир','Весь мир'),
    ('Россия/СНГ','Россия/СНГ'),
    ('Россия','Россия'),
]


class GameItem(models.Model):
    slug = models.SlugField(unique=True, max_length=255, editable=False)
    title = models.CharField('Название', max_length=40)
    app_id = models.IntegerField('ID игры', default=0)
    is_editors_choice = models.BooleanField('Выбор редакции', default=False)
    price = models.IntegerField('Стоимость')
    activation = models.CharField('Активация', max_length=20, choices=ACTIVATION_CHOICES)
    region = models.CharField('Регион', max_length=20, choices=REGION_CHOICES)
    genre = models.CharField('Основной жанр', max_length=40, choices=GENRE_CHOICES, blank=True)
    genre_1 = models.CharField('Жанр 1', max_length=40, choices=GENRE_CHOICES, blank=True)
    genre_2 = models.CharField('Жанр 2', max_length=40, choices=GENRE_CHOICES, blank=True)
    genre_3 = models.CharField('Жанр 3', max_length=40, choices=GENRE_CHOICES, blank=True)
    genre_4 = models.CharField('Жанр 4', max_length=40, choices=GENRE_CHOICES, blank=True)
    publisher = models.CharField('Издатель', max_length=25)
    developer = models.CharField('Разработчик', max_length=25)
    release_date = models.DateField('Дата выхода', null=True, blank=True)
    ea_link = models.URLField('Ссылка на EA', unique=False, blank=True, null=True)
    rockstar_link = models.URLField('Ссылка на Rockstar', unique=False, blank=True, null=True)
    steam_link = models.URLField('Ссылка на Steam', unique=False, blank=True, null=True)
    gog_link = models.URLField('Ссылка на GOG', unique=False, blank=True, null=True)
    epic_games_link = models.URLField('Ссылка на EpicGames', unique=False, blank=True, null=True)
    ubisoft_link = models.URLField('Ссылка на Ubisoft', unique=False, blank=True, null=True)
    vk_play_link = models.URLField('Ссылка на VK Play', unique=False, blank=True, null=True)
    product_image = models.ImageField('Изображение продукта', upload_to='product/', null=True, blank=True)
    catalog_image = models.ImageField('Изображение для каталога', upload_to='catalog/', null=True, blank=True)
    image_screen_1 = models.ImageField('Изображение для Скриншота 1', upload_to=game_screenshot_upload_path, null=True, blank=True)
    image_screen_2 = models.ImageField('Изображение для Скриншота 2', upload_to=game_screenshot_upload_path, null=True, blank=True)
    image_screen_3 = models.ImageField('Изображение для Скриншота 3', upload_to=game_screenshot_upload_path, null=True, blank=True)
    image_screen_4 = models.ImageField('Изображение для Скриншота 4', upload_to=game_screenshot_upload_path, null=True, blank=True)
    image_screen_5 = models.ImageField('Изображение для Скриншота 5', upload_to=game_screenshot_upload_path, null=True, blank=True)
    image_screen_6 = models.ImageField('Изображение для Скриншота 6', upload_to=game_screenshot_upload_path, null=True, blank=True)
    image_screen_7 = models.ImageField('Изображение для Скриншота 7', upload_to=game_screenshot_upload_path, null=True, blank=True)
    image_screen_8 = models.ImageField('Изображение для Скриншота 8', upload_to=game_screenshot_upload_path, null=True, blank=True)
    image_screen_9 = models.ImageField('Изображение для Скриншота 9', upload_to=game_screenshot_upload_path, null=True, blank=True)
    description = models.TextField('Описание')
    views = models.IntegerField('Просмотры', default=0)
    num_keys = models.PositiveIntegerField('Количество ключей', default=0)

    def save(self, *args, **kwargs):
        # Проверка на ограничение в 5 игр для "Выбор редакции"
        if self.is_editors_choice and GameItem.objects.filter(is_editors_choice=True).count() >= 5:
            raise ValidationError("Нельзя выбрать более 5 игр для раздела 'Выбор редакции'.")

        # Генерация slug, если он не был задан
        if not self.slug:
            self.slug = slugify(self.title)

        super(GameItem, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.num_keys} ключей)"

    class Meta:
        verbose_name = 'Игру'
        verbose_name_plural = 'Игры'


class GameKey(models.Model):
    STATUS_CHOICES = [
        ('Не активен', 'Не активен'),
        ('Активен', 'Активен'),
    ]

    game = models.ForeignKey(GameItem, on_delete=models.CASCADE, related_name='keys')
    key = models.CharField('Ключ', max_length=50)
    status = models.CharField('Статус', max_length=10, choices=STATUS_CHOICES, default='Не активен')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # После сохранения ключа обновляем количество ключей для связанной игры
        self.game.num_keys = self.game.keys.count()
        self.game.save()

    def __str__(self):
        return f"Ключ для {self.game.title} ({self.status})"

    class Meta:
        verbose_name = 'Ключ'
        verbose_name_plural = 'Ключи'


# Создаем сигнал, который будет обрабатывать удаление ключа
@receiver(pre_delete, sender=GameKey)
def update_num_keys_on_key_delete(sender, instance, **kwargs):
    # При удалении ключа обновляем количество ключей для связанной игры
    instance.game.num_keys = instance.game.keys.count() - 1
    instance.game.save()


class SliderImage(models.Model):
    game = models.ForeignKey(GameItem, on_delete=models.CASCADE, related_name='slider_images')
    slider_image = models.ImageField('Большое изображение для слайдера', upload_to='slider/', null=True, blank=True)

    def __str__(self):
        return f"{self.game.title} - Slider Image"

    class Meta:
        verbose_name = 'Изображение слайдера'
        verbose_name_plural = 'Изображения слайдера'


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает оплаты'),
        ('paid', 'Оплачен'),
        ('canceled', 'Отменён'),
    ]

    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name} ({self.status})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.title} - {self.price}₽"



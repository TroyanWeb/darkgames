from django.contrib import admin
from game_keys.models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0  # Не показывать пустые строки для добавления
    fields = ('title', 'price')
    verbose_name = "Позиция заказа"
    verbose_name_plural = "Позиции заказа"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('customer_name', 'customer_email')
    ordering = ('-created_at',)
    inlines = [OrderItemInline]  # Вложенные позиции заказа

    def total_price(self, obj):
        # Рассчитываем общую сумму заказа
        return f"{sum(item.price for item in obj.order_items.all()):,.2f} ₽"
    total_price.short_description = 'Сумма заказа'  # Перевод на русский

    # Переводим заголовки полей
    verbose_name = "Заказ"
    verbose_name_plural = "Заказы"


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'title', 'price')
    search_fields = ('title',)
    verbose_name = "Позиция заказа"
    verbose_name_plural = "Позиции заказа"


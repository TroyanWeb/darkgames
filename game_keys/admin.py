from django.contrib import admin
from .models import GameItem, GameKey, SliderImage
from ckeditor.widgets import CKEditorWidget
from django.db import models


class GameKeyInline(admin.TabularInline):
    model = GameKey
    extra = 1


class GameItemAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget}
    }
    inlines = [GameKeyInline]


class SliderImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'game', 'image')


admin.site.register(GameItem, GameItemAdmin)
admin.site.register(GameKey)  # Зарегистрируйте модель GameKey отдельно
admin.site.register(SliderImage)

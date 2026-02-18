$(document).ready(function() {
    // Инициализация fancybox
    $('[data-fancybox="gallery"]').fancybox({
        // Опции fancybox
        loop: true, // Зацикливание галереи
        buttons: ["slideShow", "fullScreen", "close"], // Показать кнопки слайд-шоу, полный экран и закрыть
    });
});

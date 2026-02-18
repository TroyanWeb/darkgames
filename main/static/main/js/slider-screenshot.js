//Скриншоты
const slider = document.querySelector('.swiper-container');

let mySwiper = new Swiper(slider, {
    slidesPerView: 1, // Начальное значение для больших экранов
    spaceBetween: 10,
    loop: true,
    slidesPerGroup: 1, // Начальное значение для больших экранов
    lazy: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        // когда ширина экрана меньше 860px
        860: {
            slidesPerView: 3, // Для меньших экранов меняем на 3
            slidesPerGroup: 3, // Для меньших экранов меняем на 3
        },
        480: {
            slidesPerView: 2, // Для очень маленьких экранов меняем на 1
            slidesPerGroup: 2, // Для очень маленьких экранов меняем на 1
        },
    }
});



//КОРЗИНА

// Функция обновления иконки и счётчика корзины
function updateCartIconAndCount(itemCount) {
    const cartIcon = document.getElementById('cart-icon'); // Иконка корзины
    const cartHeadNum = document.querySelector('.cart_head_num'); // Счётчик количества товаров

    // Выбираем иконку для корзины
    cartIcon.src = `/static/main/img/structure/cart-${itemCount > 4 ? 0 : itemCount}.svg`;

    // Логика отображения счётчика
    if (itemCount > 4) {
        cartHeadNum.style.display = 'block'; // Показываем счётчик
        cartHeadNum.innerText = itemCount;  // Устанавливаем количество товаров
    } else {
        cartHeadNum.style.display = 'none'; // Скрываем счётчик
    }
}

// Функция для получения состояния корзины с сервера
function updateCartState() {
    fetch('/get_cart_state/') // Создайте этот эндпоинт на сервере
        .then(response => response.json())
        .then(data => {
            const itemCount = data.item_count || 0; // Количество товаров
            updateCartIconAndCount(itemCount);      // Обновляем корзину
        })
        .catch(error => console.error('Ошибка при обновлении корзины:', error));
}

// Обновляем состояние корзины при загрузке страницы
window.addEventListener('load', () => {
    updateCartState();
    document.getElementById('cart-icon').style.visibility = 'visible'; // Показываем иконку после инициализации
});

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        updateCartState(); // Обновляем корзину при возвращении из кэша
    }
});


// Обновляем состояние корзины при добавлении товаров
document.querySelectorAll('.game-description-cart-button').forEach(button => {
    const gameId = button.getAttribute('data-game-id');
    const buttonElement = button.querySelector('button, a'); // Ищем кнопку или ссылку внутри

    button.addEventListener('click', () => {
        if (buttonElement.classList.contains('cart-button-in-cart')) {
            // Если товар уже "В корзине", перенаправляем пользователя
            window.location.href = '/cart/'; // Здесь URL прописан явно
            return;
        }

        // Добавляем товар в корзину
        fetch(`/add_to_cart/${gameId}/`)
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    // Меняем кнопку "Купить" на ссылку "В корзине"
                    button.innerHTML = `<div class="cart-button-in-cart-container">
                                            <a href="/cart/" class="cart-button-in-cart">В корзине</a>
                                        </div>`;

                    // Обновляем иконку и счётчик
                    updateCartIconAndCount(data.item_count);
                }
            })
            .catch(error => console.error('Ошибка при добавлении в корзину:', error));
    });
});


document.querySelectorAll('.cart-item-remove').forEach(button => {
    button.addEventListener('click', (event) => {
        const gameId = button.getAttribute('data-game-id'); // Получаем ID товара

        // Отправляем запрос на сервер для удаления товара
        fetch(`/remove_from_cart/${gameId}/`)
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    // Удаляем HTML-элемент товара
                    const cartItem = button.closest('.cart-item');
                    cartItem.remove();

                    // Обновляем иконку и счётчик корзины
                    updateCartIconAndCount(data.item_count);

                    // Обновляем общую стоимость, если отображается
                    const totalPriceElement = document.querySelector('.total-price');
                    if (totalPriceElement) {
                        totalPriceElement.textContent = `Общая стоимость: ${data.total_price}₽`;
                    }

                    // Проверяем, пуста ли корзина
                    if (data.item_count === 0) {
                        document.querySelector('.cart-page').innerHTML = `
                            <div class="cart-page-container">
                                <h1>Корзина</h1>
                                <p id="empty-cart-message">Ваша корзина пуста</p>
                            </div>
                        `;
                        updateCartIconAndCount(0); // Обновляем иконку и счётчик корзины
                    }
                }
            })
            .catch(error => console.error('Ошибка при удалении товара из корзины:', error));
    });
});




// Знаки вопросика появляются при наведении

function setAdvantagesHandlers(advantagesTriggers, referenceContainers) {
    for (let i = 0; i < advantagesTriggers.length; i++) {
        advantagesTriggers[i].addEventListener('mouseover', () => {
            referenceContainers[i].style.display = 'block';
        });

        advantagesTriggers[i].addEventListener('mouseout', () => {
            referenceContainers[i].style.display = 'none';
        });
    }

    // Скрыть кнопки при загрузке страницы
    for (let i = 0; i < referenceContainers.length; i++) {
        referenceContainers[i].style.display = 'none';
    }
}



// ВЕРХНЯЯ часть закрепки (для маленьких окон)

const barSticky = document.querySelector('.bar');

function setBarSticky() {
    if (window.innerWidth >= 992) {
        barSticky.style.position = 'fixed';
    } else {
        barSticky.style.position = 'relative';

    }
}

// СПРАВКА Т.Е ВОПРОСИКИ

// Кнопка справки index 1
const advantagesTriggers1 = document.getElementsByClassName('advantages-item-text-icon-index-1');
const referenceContainers1 = document.getElementsByClassName('reference-index-1');
setAdvantagesHandlers(advantagesTriggers1, referenceContainers1);

// Кнопка справки footer 4
const advantagesTriggers2 = document.getElementsByClassName('advantages-item-text-icon-footer-4');
const referenceContainers2 = document.getElementsByClassName('reference-footer-4');
setAdvantagesHandlers(advantagesTriggers2, referenceContainers2);

// Кнопка справки index 2
const advantagesTriggers3 = document.getElementsByClassName('advantages-item-text-icon-index-2');
const referenceContainers3 = document.getElementsByClassName('reference-index-2');
setAdvantagesHandlers(advantagesTriggers3, referenceContainers3);


// ФИКС ПРОКРУТКИ

const stickyElement = document.querySelector('.bar');
const otherElement = document.querySelector('.wrapper1') || document.querySelector('main');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 79) {
        otherElement.style.marginTop = '52px';
        stickyElement.style.position = 'fixed';
        stickyElement.style.top = '0';
    } else {
        setTimeout(() => {
            otherElement.style.marginTop = '0';
            stickyElement.style.position = '';
            stickyElement.style.top = 'auto';
        });
    }
});


// ПРОФИЛЬ

// Получаем ссылки на элементы HTML
const personalCabinetButton = document.getElementById('personal-cabinet-button');
const personalCabinetPanel = document.getElementById('personal-cabinet-panel');
const overlay = document.getElementById('overlay');

// Открываем панель личного кабинета при клике на кнопку
personalCabinetButton.addEventListener('click', () => {
    personalCabinetPanel.style.display = 'block';
    overlay.style.display = 'block';
});

// Закрываем панель личного кабинета при клике на затемненный фон
overlay.addEventListener('click', () => {
    personalCabinetPanel.style.display = 'none';
    overlay.style.display = 'none';
});


// СМЕНА ЦВЕТА текса с серого на белый на странице товара

window.addEventListener('DOMContentLoaded', function () {
    let colorChangingText = document.querySelector('.game-title');
    if (colorChangingText) {
        colorChangingText.style.color = "#ffffff"; // Изменение цвета текста на белый
    }
    let contentGameInfoImage = document.querySelector('.game-image');
    if (contentGameInfoImage) {
        contentGameInfoImage.style.filter = 'none'; // Удаление эффекта серого
    }
});

let buttons = document.getElementsByClassName(".purchase-info-container1-button");

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        this.classList.add("clicked");
    });
}

//МЕНЮ

// Получаем ссылки на элементы
const menuIcon = document.getElementById("menu-icon");
const menu = document.getElementById("menu");

// Функция для переключения видимости меню
function toggleMenu(menuElement) {
    menuElement.classList.toggle("show");
}

// Проверка наличия и обработка меню для каждой страницы
function initMenu() {
    const menuContent = document.querySelector(".menu-content") ||
                        document.querySelector(".menu-content-index") ||
                        document.querySelector(".menu-content-game") ||
                        document.querySelector(".menu-content-index-mobile");

    if (!menuContent) return; // Выходим, если блок меню отсутствует

    // Обработчик клика на иконку меню
    menuIcon.addEventListener("click", function () {
        if (window.innerWidth > 775) {
            toggleMenu(menuContent);
        } else {
            toggleMenu(document.querySelector(".menu-content-index-mobile") || menuContent);
        }
    });

    // Закрытие меню при клике вне его
    document.addEventListener("click", function (event) {
        if (!menu.contains(event.target) && event.target !== menuIcon) {
            menuContent.classList.remove("show");
            menu.classList.remove("opened");
        }
    });

    // Предотвращение закрытия меню при клике внутри него
    menuContent.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // Скрытие меню на основе ширины экрана
    window.addEventListener("resize", function () {
        if (window.innerWidth <= 775) {
            menuContent.classList.remove("show");
        }
    });
}

// Инициализация меню при загрузке страницы
document.addEventListener("DOMContentLoaded", initMenu);


// ЗАГОЛОВКИ В МЕНЮ БАРА

document.addEventListener('DOMContentLoaded', function() {
    // Функция для прокрутки страницы выше на 50px относительно элемента
    function scrollToElement(element) {
        const yOffset = -230; // 50px выше
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
    }

    // Добавляем обработчик события click для элемента "New"
    document.getElementById('menu-content-item-new').addEventListener('click', function() {
        let href = this.getAttribute('data-url');
        if (href) {
            window.location.href = href;
            scrollToElement(this); // Прокручиваем к элементу "New"
        }
    });

    // Добавляем обработчик события click для элемента "Popular"
    document.getElementById('menu-content-item-popular').addEventListener('click', function() {
        let href = this.getAttribute('data-url');
        if (href) {
            window.location.href = href;
            scrollToElement(this); // Прокручиваем к элементу "Popular"
        }
    });

    // Добавляем обработчик события click для элемента "Editor's Choice"
    document.getElementById('menu-content-item-editors-choice').addEventListener('click', function() {
        let href = this.getAttribute('data-url');
        if (href) {
            window.location.href = href;
            scrollToElement(this); // Прокручиваем к элементу "Editor's Choice"
        }
    });
});


//ФИЛЬТРЫ

// Получаем ссылки на элементы
const filtersContainers = document.querySelectorAll('.filters-item-container');

// Добавляем обработчик события клика на каждый контейнер
filtersContainers.forEach(container => {
    container.addEventListener("click", function (event) {
        // Проверяем, находится ли кликнутый элемент внутри контейнера
        if (container.contains(event.target)) {
            // Находим соответствующий элемент .filters-item-body по data-target
            const targetId = this.getAttribute('data-target');
            const filtersBody = document.getElementById(targetId);

            // Переключаем видимость соответствующего тела фильтра
            if (filtersBody.style.display === "block") {
                filtersBody.style.display = "none";
            } else {
                filtersBody.style.display = "block";
            }

            // При клике на контейнер фильтров, поворачиваем стрелку на 180 градусов, если она уже в исходном положении, то возвращаем её на исходное положение
            const filtersItemArrow = this.querySelector('.filters-item-arrow');
            const isArrowRotated = filtersItemArrow.classList.contains('rotated');

            if (isArrowRotated) {
                filtersItemArrow.classList.remove('rotated');
            } else {
                filtersItemArrow.classList.add('rotated');
            }
        }
    });
});


// Предотвращаем закрытие меню при клике на элемент filters-item-body
const filtersItemPrice = document.querySelectorAll('.filters-item-container');
filtersItemPrice.forEach(body => {
    body.addEventListener("click", function (event) {
        event.stopPropagation();
    });
});

// Предотвращаем закрытие меню при клике на элемент filters-item-body
const filtersItemBodies = document.querySelectorAll('.filters-item-body');
filtersItemBodies.forEach(body => {
    body.addEventListener("click", function (event) {
        event.stopPropagation();
    });
});

const filtersItemBorder = document.querySelectorAll('.filters-item-border');
filtersItemBorder.forEach(body => {
    body.addEventListener("click", function (event) {
        event.stopPropagation();
    });
});

// Скрипт на фильтр range
$(function () {
    $(".price-range-slider").slider({
        range: true,
        min: 0,
        max: 7000,
        values: [0, 7000],
        slide: function (event, ui) {
            $("#priceValueMin").text(ui.values[0]);
            $("#priceValueMax").text(ui.values[1]);
        }
    });

    // Изначальное значение
    $("#priceValueMin").text($(".price-range-slider").slider("values", 0));
    $("#priceValueMax").text($(".price-range-slider").slider("values", 1));
});

// Получаем все чекбоксы с классом "save-state-checkbox"
let checkboxes = document.querySelectorAll('.save-state-checkbox');

// Итерируем по каждому чекбоксу
checkboxes.forEach(function(checkbox) {
    // Проверяем, есть ли сохраненное состояние в sessionStorage
    let savedState = sessionStorage.getItem(checkbox.id);

    // Если есть, устанавливаем состояние чекбокса
    if (savedState !== null) {
        checkbox.checked = JSON.parse(savedState);
    }

    // Обработчик события изменения состояния чекбокса
    checkbox.addEventListener('change', function() {
        // Сохраняем состояние чекбокса в sessionStorage
        sessionStorage.setItem(checkbox.id, JSON.stringify(checkbox.checked));
    });
});

// При обновлении страницы сессия сохраняется
window.addEventListener('beforeunload', function() {
    sessionStorage.setItem('pageRefreshed', true);
});

// Если страница была обновлена, очистите sessionStorage
if (sessionStorage.getItem('pageRefreshed')) {
    sessionStorage.clear();
}

// СПРАВКА КАК АКТИВИРОВАТЬ ИГРУ
document.addEventListener('DOMContentLoaded', function() {
    const descriptionTitle = document.getElementById('description-title-active');
    const activationTitle = document.getElementById('activation-title');
    const gameDescriptionText = document.querySelector('.game_area_description_text');
    const aboutActivationText = document.querySelector('.about-activation-text');

    descriptionTitle.addEventListener('click', function() {
        gameDescriptionText.style.display = 'block';
        aboutActivationText.style.display = 'none';
        descriptionTitle.id = 'description-title-active';
        activationTitle.id = '';
    });

    activationTitle.addEventListener('click', function() {
        gameDescriptionText.style.display = 'none';
        aboutActivationText.style.display = 'block';
        descriptionTitle.id = '';
        activationTitle.id = 'description-title-active';
    });
});



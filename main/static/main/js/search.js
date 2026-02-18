document.addEventListener("DOMContentLoaded", function () {
    // Получаем элементы ввода и выпадающего списка
    const searchInput = document.querySelector(".search-control");
    const searchDropdown = document.querySelector(".search-dropdown");

    // Скрываем dropdown по умолчанию, так как нет поисковых результатов
    searchDropdown.style.display = "none";

    // Функция для преобразования русской раскладки в английскую
    function convertToEnglishLayout(input) {
        // Карта русских символов в английские
        const layoutMap = {
            'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k', 'д': 'l',
            'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm', 'й': 'q', 'ц': 'w',
            'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p', 'х': '[',
            'ъ': ']', 'ж': ';', 'э': '\'', 'б': ',', 'ю': '.',
        };
        // Возвращаем строку с заменёнными символами
        return input.split('').map(char => layoutMap[char] || char).join('');
    }

    // Обработчик ввода в поле поиска
    searchInput.addEventListener("input", function () {
        let query = searchInput.value.trim().toLowerCase();  // Убираем пробелы и приводим к нижнему регистру

        // Если есть русские символы, переводим их в английскую раскладку
        if (/[а-я]/i.test(query)) {
            query = convertToEnglishLayout(query);
        }

        // Проверка: начинать поиск только после ввода 3+ символов
        if (query.length > 2) {
            // Отправляем запрос на сервер с введённым запросом
            fetch(`/search/?q=${query}`)
                .then((response) => response.json())  // Преобразуем ответ в JSON
                .then((data) => {
                    searchDropdown.innerHTML = "";  // Очищаем выпадающий список перед добавлением новых результатов

                    // Фильтруем данные для получения совпадений
                    const primaryMatches = data.filter(item =>
                        item.title.toLowerCase().includes(query)
                    );

                    // Сортируем так, чтобы точные соответствия по началу строки шли первыми
                    primaryMatches.sort((a, b) => {
                        const startsWithQueryA = a.title.toLowerCase().startsWith(query);
                        const startsWithQueryB = b.title.toLowerCase().startsWith(query);

                        if (startsWithQueryA && !startsWithQueryB) return -1;
                        if (!startsWithQueryA && startsWithQueryB) return 1;
                        return 0;  // Порядок не меняется, если оба совпадают по началу строки
                    });


                    // Ограничиваем количество выводимых результатов до 5
                    const filteredData = primaryMatches.slice(0, 5);

                    // Проверяем, есть ли результаты
                    if (filteredData.length > 0) {
                        // Создаём элементы для каждого результата и добавляем их в выпадающий список
                        filteredData.forEach((item) => {
                            const linkContainer = document.createElement("a");  // Создаём ссылку для каждого элемента
                            linkContainer.href = `/catalog/${item.slug}/`;  // Задаём путь на каталог
                            linkContainer.classList.add("search-item");

                            // Добавляем изображение игры
                            const imageContainer = document.createElement("div");
                            imageContainer.classList.add("search-game-img");

                            const image = document.createElement("img");
                            image.src = item.image_url || "/path/to/default-image.jpg";  // Если нет изображения, задаём изображение по умолчанию
                            image.alt = item.title;
                            imageContainer.appendChild(image);

                            // Добавляем название игры
                            const titleSpan = document.createElement("span");
                            titleSpan.classList.add("search-title");
                            titleSpan.textContent = item.title;

                            // Добавляем цену
                            const priceSpan = document.createElement("span");
                            priceSpan.classList.add("search-sell");
                            priceSpan.textContent = `${item.price}₽`;

                            // Собираем элементы в контейнер-ссылку
                            linkContainer.appendChild(imageContainer);
                            linkContainer.appendChild(titleSpan);
                            linkContainer.appendChild(priceSpan);
                            searchDropdown.appendChild(linkContainer);
                        });
                        searchDropdown.style.display = "block";  // Показываем выпадающий список, если есть результаты
                    } else {
                        searchDropdown.style.display = "none";  // Скрываем выпадающий список, если результатов нет
                    }
                });
        } else {
            searchDropdown.style.display = "none";  // Скрываем выпадающий список, если введено менее 3 символов
        }
    });

    // Обработчик клика вне области поиска, чтобы скрыть выпадающий список
    document.addEventListener("click", function (event) {
        // Проверяем, что клик не произошёл в поле ввода или в выпадающем списке
        if (!searchInput.contains(event.target) && !searchDropdown.contains(event.target)) {
            searchDropdown.style.display = "none";  // Скрываем выпадающий список
        }
    });
});

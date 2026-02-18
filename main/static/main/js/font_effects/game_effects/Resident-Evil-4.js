export function applyResidentEvil4() {
    setTimeout(() => {
        const gameTitle = document.querySelector('.game-title .word-animation');

        if (gameTitle && gameTitle.textContent.trim().toLowerCase() === 'resident evil 4') {
            const titleElements = document.querySelectorAll('.word-animation');

            titleElements.forEach(element => {
                let titleText = element.textContent.trim();
                let newText = '';
                let rFound = false;
                let eFound = false;

                for (let i = 0; i < titleText.length; i++) {
                    if (titleText[i].toLowerCase() === 'r' && !rFound && (i === 0 || titleText[i - 1] === ' ')) {
                        newText += `<span class="highlight">${titleText[i]}</span>`;
                        rFound = true;
                    } else if (titleText[i].toLowerCase() === 'e' && !eFound && (i === 0 || titleText[i - 1] === ' ')) {
                        newText += `<span class="highlight">${titleText[i]}</span>`;
                        eFound = true;
                    } else {
                        newText += titleText[i];
                    }
                }

                element.innerHTML = newText;

                // Задаем начальный цвет через класс, а затем добавляем переход
                const spans = element.querySelectorAll('.highlight');
                spans.forEach(span => {
                    span.style.transition = 'color 1s ease'; // Задаем переход для плавного изменения цвета
                    span.style.color = '#000'; // Начальный цвет (например, черный)
                });

                // Делаем отложенное изменение цвета
                setTimeout(() => {
                    spans.forEach(span => {
                        span.style.color = '#e11935';
                    });
                }, 50); // Небольшая задержка для запуска анимации
            });
        }
    }, 1400); // Задержка в 1.4 секунды после начала загрузки страницы
}

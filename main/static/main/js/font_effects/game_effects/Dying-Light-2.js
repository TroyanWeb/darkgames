export function applyDyingLight2() {
    setTimeout(() => {
        const gameTitle = document.querySelector('.game-title .word-animation');

        if (gameTitle && gameTitle.textContent.trim().toLowerCase() === 'dying light 2') {
            const words = gameTitle.textContent.split(' ');

            words.forEach(word => {
                if (/\b2\b/.test(word)) {
                    const span = document.createElement('span');
                    span.textContent = word;
                    span.classList.add('two');
                    gameTitle.innerHTML = gameTitle.innerHTML.replace(word, span.outerHTML);
                }
            });
        }
    });
}

export function applyWatchDogsLegion() {
    const glitchTexts = document.querySelectorAll(".word-animation");

    const runGlitchEffect = (glitchText) => {
        glitchText.textContent = "Watch Dogs Legion";
        glitchText.classList.add("glitch-onload");

        const randomGlitch = () => {
            const textLength = glitchText.textContent.length;
            const randomIndex = Math.floor(Math.random() * textLength);
            glitchText.textContent = glitchText.textContent.substring(0, randomIndex) + String.fromCharCode(0x2800 + Math.random() * 96) + glitchText.textContent.substring(randomIndex + 1);
        };

        let intervalId;
        const startGlitch = () => {
            intervalId = setInterval(randomGlitch, 15);
        };

        const stopGlitch = () => {
            clearInterval(intervalId);
            glitchText.textContent = "Watch Dogs Legion";
            setTimeout(() => {
                runGlitchEffect(glitchText);
            }, 3000);
        };

        glitchText.classList.remove("glitch-onload");
        startGlitch();
        setTimeout(() => {
            stopGlitch();
        }, 2000);
    };

    setTimeout(() => {
        glitchTexts.forEach(glitchText => {
            if (glitchText.textContent.includes('Watch Dogs Legion')) {
                runGlitchEffect(glitchText);
            }
        });
    }, 2000);
}

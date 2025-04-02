// Обработка переходов между страницами
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем элемент перехода
    const transitionElement = document.createElement('div');
    transitionElement.className = 'page-transition';
    document.body.appendChild(transitionElement);

    // Обрабатываем клики по ссылкам
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.href.startsWith(window.location.origin)) {
            e.preventDefault();
            
            // Анимация перехода
            document.body.classList.add('transitioning');
            transitionElement.classList.add('active');

            // Задержка перед переходом
            setTimeout(() => {
                window.location.href = link.href;
            }, 500);
        }
    });

    // Анимация при загрузке страницы
    window.addEventListener('load', () => {
        document.body.classList.remove('transitioning');
        transitionElement.classList.remove('active');
    });
});

// Обработка анимаций кнопок
document.querySelectorAll('.cta-button').forEach(button => {
    // Добавляем обертку для текста, если её еще нет
    if (!button.querySelector('span')) {
        const buttonText = button.textContent.trim();
        button.innerHTML = `<span>${buttonText}</span>`;
    }

    // Обработка состояния загрузки для кнопок формы
    if (button.type === 'submit') {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('loading')) return;

            this.classList.add('loading');
            const originalText = this.querySelector('span').textContent;
            this.querySelector('span').textContent = 'Loading...';
            
            // Имитация отправки формы
            setTimeout(() => {
                this.classList.remove('loading');
                this.querySelector('span').textContent = originalText;
            }, 2000);
        });
    }
});

// Добавляем стили для эффекта пульсации
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 
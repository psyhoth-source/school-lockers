function showNotification(type, message) {
    // Создаем контейнер для уведомлений, если его еще нет
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Добавляем иконку и текст
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <div class="progress"></div>
    `;
    
    // Добавляем в контейнер
    notificationContainer.appendChild(notification);
    
    // Добавляем небольшую задержку для анимации
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Удаляем через 3 секунды
    const timeout = setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
            if (notificationContainer.children.length === 0) {
                notificationContainer.remove();
            }
        }, 400);
    }, 3000);

    // Добавляем возможность закрыть уведомление по клику
    notification.addEventListener('click', () => {
        clearTimeout(timeout);
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
            if (notificationContainer.children.length === 0) {
                notificationContainer.remove();
            }
        }, 400);
    });
} 
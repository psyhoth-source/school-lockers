// Global variables
let reservedLockers = new Set();
let lockersGrid;
let userHasReservation = false;

document.addEventListener('DOMContentLoaded', () => {
    lockersGrid = document.querySelector('.lockers-grid');
    const totalLockers = 12;
    
    // Locker types data
    const lockerTypes = [
        {
            name: "Standard Locker",
            description: "Perfect for books and basic storage needs",
            price: "€5/month",
            features: ["24/7 Access", "Digital Lock", "Basic Storage"],
            size: "40x40x50 cm",
            status: "available"
        },
        {
            name: "USB Charging Locker",
            description: "Built-in USB charging for your devices",
            price: "€8/month",
            features: ["USB Charging", "24/7 Access", "Digital Lock", "Power Outlet"],
            size: "40x40x50 cm",
            status: "available"
        },
        {
            name: "Large Storage Locker",
            description: "Extra space for all your belongings",
            price: "€12/month",
            features: ["Extra Space", "24/7 Access", "Digital Lock", "Ventilation"],
            size: "60x60x80 cm",
            status: "available"
        }
    ];

    // Generate lockers
    for (let i = 1; i <= totalLockers; i++) {
        const isOccupied = Math.random() < 0.3;
        const lockerType = lockerTypes[Math.floor(Math.random() * lockerTypes.length)];
        
        const locker = document.createElement('div');
        locker.className = `locker ${isOccupied ? 'occupied' : 'available'} animate-fadeInUp`;
        locker.style.animationDelay = `${i * 0.1}s`;
        locker.dataset.number = i;
        locker.dataset.type = lockerType.name;
        locker.dataset.price = lockerType.price;
        
        locker.innerHTML = `
            <div class="locker-header">
                <span class="locker-number">#${i}</span>
                <span class="locker-status ${isOccupied ? 'occupied' : 'available'}">
                    <i class="fas ${isOccupied ? 'fa-lock' : 'fa-lock-open'}"></i>
                    ${isOccupied ? 'Occupied' : 'Available'}
                </span>
            </div>
            <h3>${lockerType.name}</h3>
            <p class="locker-description">${lockerType.description}</p>
            <div class="locker-details">
                <div class="locker-size">
                    <i class="fas fa-ruler-combined"></i>
                    <span>${lockerType.size}</span>
                </div>
                <div class="locker-price">${lockerType.price}</div>
            </div>
            <ul class="locker-features">
                ${lockerType.features.map(feature => `
                    <li><i class="fas fa-check"></i>${feature}</li>
                `).join('')}
            </ul>
            <button class="cta-button ${isOccupied ? 'disabled' : ''}" ${isOccupied ? 'disabled' : ''}>
                ${isOccupied ? 'Occupied' : 'Reserve Now'}
            </button>
        `;
        
        lockersGrid.appendChild(locker);
    }

    // Add click handlers
    initializeEventListeners();
});

function initializeEventListeners() {
    // Locker click handler
    lockersGrid.addEventListener('click', (e) => {
        const locker = e.target.closest('.locker');
        if (!locker || e.target.classList.contains('cta-button')) return;
        
        if (locker.classList.contains('occupied')) {
            showNotification('error', 'This locker is currently occupied');
            return;
        }

        // Remove selection from all lockers
        document.querySelectorAll('.locker').forEach(l => l.classList.remove('selected'));
        
        // Select clicked locker
        locker.classList.add('selected');
        const lockerNumber = locker.querySelector('.locker-number').textContent;
        showNotification('success', `Selected locker ${lockerNumber}`);
    });

    // Reserve button click handler
    lockersGrid.addEventListener('click', (e) => {
        if (!e.target.classList.contains('cta-button')) return;
        if (e.target.classList.contains('disabled')) return;
        
        const locker = e.target.closest('.locker');
        const lockerNumber = locker.dataset.number;
        const lockerType = locker.dataset.type;
        
        if (e.target.classList.contains('reserved')) {
            // Show cancellation confirmation modal
            showCancellationModal(lockerNumber, locker);
        } else {
            // Show reservation modal
            showReservationModal(lockerNumber, lockerType, locker);
        }
    });
}

function updateLockerStatus(locker, isReserved) {
    const statusSpan = locker.querySelector('.locker-status');
    const reserveButton = locker.querySelector('.cta-button');

    if (isReserved) {
        statusSpan.className = 'locker-status reserved';
        statusSpan.innerHTML = '<i class="fas fa-user-check"></i>Reserved';
        reserveButton.textContent = 'Cancel Reservation';
        reserveButton.classList.add('reserved');
        locker.classList.add('reserved');
    } else {
        statusSpan.className = 'locker-status available';
        statusSpan.innerHTML = '<i class="fas fa-lock-open"></i>Available';
        reserveButton.textContent = 'Reserve Now';
        reserveButton.classList.remove('reserved');
        locker.classList.remove('reserved');
    }
}

// Notification function
function showNotification(type, message) {
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Добавляем небольшую задержку для анимации
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
            
            // Если это последнее уведомление, удаляем контейнер
            if (notificationContainer.children.length === 0) {
                notificationContainer.remove();
            }
        }, 300);
    }, 3000);
}

// Reservation modal function
function showReservationModal(lockerNumber, lockerName, lockerElement) {
    if (userHasReservation) {
        showNotification('error', 'You can only reserve one locker at a time');
        return;
    }

    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close">&times;</button>
            <h2>Reserve ${lockerName} #${lockerNumber}</h2>
            <form id="reservationForm">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="duration">Rental Duration</label>
                    <select id="duration" required>
                        <option value="week">1 Week</option>
                        <option value="semester">Semester (4 months, 15% discount)</option>
                        <option value="academic">Academic Year (9 months, 25% discount)</option>
                    </select>
                </div>
                <button type="submit" class="cta-button">Confirm Reservation</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('active'), 10);

    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('.close').addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    const form = modal.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const duration = form.querySelector('#duration').value;
        const email = form.querySelector('#email').value;
        const name = form.querySelector('#name').value;
        
        // Обновляем статус шкафчика
        const targetLocker = document.querySelector(`.locker[data-number="${lockerNumber}"]`);
        if (targetLocker) {
            reservedLockers.add(lockerNumber);
            updateLockerStatus(targetLocker, true);
            userHasReservation = true;
            showNotification('success', `Locker #${lockerNumber} reserved for ${duration === 'week' ? '1 week' : duration === 'semester' ? 'semester' : 'academic year'}!`);
        }
        closeModal();
    });
}

// Confirmation modal for cancellation
function showCancellationModal(lockerNumber, locker) {
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close">&times;</button>
            <h2>Cancel Reservation</h2>
            <p>Are you sure you want to cancel your reservation for Locker #${lockerNumber}?</p>
            <div class="modal-buttons">
                <button class="cta-button cancel-button">No, Keep Reservation</button>
                <button class="cta-button confirm-cancel">Yes, Cancel Reservation</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('active'), 10);

    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('.close').addEventListener('click', closeModal);
    modal.querySelector('.cancel-button').addEventListener('click', closeModal);

    modal.querySelector('.confirm-cancel').addEventListener('click', () => {
        reservedLockers.delete(lockerNumber);
        updateLockerStatus(locker, false);
        userHasReservation = false;
        showNotification('success', 'Reservation cancelled');
        closeModal();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
} 
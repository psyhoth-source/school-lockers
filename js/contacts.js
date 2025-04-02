document.addEventListener('DOMContentLoaded', async () => {
    // Load content for header and footer
    try {
        const response = await fetch('../data/home.json');
        const content = await response.json();
        
        // Fill the navigation
        const navLinksContainer = document.querySelector('.nav-links');
        navLinksContainer.innerHTML = content.navigation.links.map(link => `
            <li><a href="${link.url}" ${link.title === 'CONTACTS' ? 'class="active"' : ''}>${link.title}</a></li>
        `).join('');
        
        // Fill the footer
        document.querySelector('footer p').textContent = content.footer.copyright;
    } catch (error) {
        console.error('Error loading content:', error);
    }

    // Handle copy action
    const copyButtons = document.querySelectorAll('.copy-button');
    const notification = document.querySelector('.copy-notification');

    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const textToCopy = button.getAttribute('data-copy');
            try {
                await navigator.clipboard.writeText(textToCopy);
                showNotification('Copied to clipboard!', 'success');
            } catch (err) {
                showNotification('Failed to copy text', 'error');
            }
        });
    });

    // Initialize map
    initMap();

    // Обработка формы обратной связи
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = feedbackForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Показываем состояние загрузки
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                // Здесь будет логика отправки формы
                await new Promise(resolve => setTimeout(resolve, 1500)); // Имитация отправки
                
                showNotification('Message sent successfully!', 'success');
                feedbackForm.reset();
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                // Возвращаем кнопку в исходное состояние
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.contact-block, .feedback-form').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});

// Initialize Google Maps
function initMap() {
    const location = { lat: 56.949397, lng: 24.105186 }; // Bruņinieku iela 10, Riga
    const mapOptions = {
        zoom: 15,
        center: location,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [{"color": "#242f3e"}]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [{"lightness": -80}]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#746855"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#2b3544"}]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#9ca5b3"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{"color": "#746855"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#f3d19c"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#17263c"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#515c6d"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#17263c"}]
            }
        ]
    };

    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map element not found');
        return;
    }

    try {
        const map = new google.maps.Map(mapElement, mapOptions);

        const marker = new google.maps.Marker({
            position: location,
            map: map,
            title: 'Student Lockers',
            animation: google.maps.Animation.DROP
        });

        const infoWindow = new google.maps.InfoWindow({
            content: '<div style="padding: 10px;"><strong>Student Lockers</strong><br>Bruņinieku iela 10, Riga</div>'
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

// Функция для показа уведомлений
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `copy-notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    // Add no-transition class to body and html
    document.body.classList.add('no-transition');
    document.documentElement.classList.add('no-transition');
    
    // Add preload class during page load
    document.body.classList.add('preload');
    
    // Remove preload class after a slight delay
    setTimeout(() => {
        document.body.classList.remove('preload');
        document.body.classList.remove('no-transition');
        document.documentElement.classList.remove('no-transition');
    }, 100);

    // Mobile menu toggle handler
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });

        // Close mobile menu when a menu item is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.checked = true;
        }

        // Theme toggle handler with wave effect
        const overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        document.body.appendChild(overlay);

        themeToggle.addEventListener('change', () => {
            const theme = themeToggle.checked ? 'dark' : 'light';
            
            // Get the position of the toggle button
            const toggleRect = themeToggle.getBoundingClientRect();
            const x = toggleRect.left + toggleRect.width / 2;
            const y = toggleRect.top + toggleRect.height / 2;

            // Set initial wave position
            overlay.style.left = `${x}px`;
            overlay.style.top = `${y}px`;

            // Start animation
            overlay.classList.add('active');

            // Change theme after a slight delay
            setTimeout(() => {
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
            }, 50);

            // Reset animation
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 1000);
        });
    }

    // Image slider
    const slider = {
        currentSlide: 0,
        slides: document.querySelectorAll('.slide'),
        dots: document.querySelector('.slider-dots'),
        maxVisibleDots: 5, // Max number of visible dots

        init() {
            // Create dots
            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dots.appendChild(dot);
            });

            this.updateDotsVisibility();

            // Arrow handlers
            document.querySelector('.prev').addEventListener('click', () => this.prevSlide());
            document.querySelector('.next').addEventListener('click', () => this.nextSlide());

            setInterval(() => this.nextSlide(), 10000);
        },

        updateDotsVisibility() {
            const dots = document.querySelectorAll('.dot');
            const totalSlides = this.slides.length;
            
            dots.forEach((dot, index) => {
                dot.classList.remove('edge', 'hidden');
                
                if (totalSlides > this.maxVisibleDots) {
                    // Always show the first and last dot
                    if (index === 0 || index === totalSlides - 1) {
                        dot.classList.add('edge');
                    } else {
                        // Show only dots around the current slide
                        const halfVisible = Math.floor((this.maxVisibleDots - 3) / 2);
                        const showDot = 
                            index >= this.currentSlide - halfVisible && 
                            index <= this.currentSlide + halfVisible;
                        
                        if (!showDot) {
                            dot.classList.add('hidden');
                        }
                    }
                }
            });
        },

        updateSlides() {
            this.slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === this.currentSlide);
            });
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });
            this.updateDotsVisibility();
        },

        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.slides.length;
            this.updateSlides();
        },
        prevSlide() {
            this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.updateSlides();
        },
        goToSlide(index) {
            this.currentSlide = index;
            this.updateSlides();
        }
    };

    slider.init();

    // Feature card handler
    const featureCards = document.querySelectorAll('.feature-card');
    const featureContents = document.querySelectorAll('.feature-content');

    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            
            // Remove active class from all cards and content
            featureCards.forEach(c => c.classList.remove('active'));
            featureContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to the clicked card and corresponding content
            card.classList.add('active');
            document.querySelector(`.feature-content[data-id="${id}"]`).classList.add('active');
        });
    });

    // Image zoom handler
    const modal = document.querySelector('.image-modal');
    const modalImg = document.querySelector('.modal-image');
    
    function openModal(imgSrc) {
        modal.style.display = "block";
        modalImg.src = imgSrc;
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    }

    function closeModalFunc() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }

    // Add event listeners to all images in the slider
    document.querySelectorAll('.slide').forEach(img => {
        img.addEventListener('click', function() {
            openModal(this.src);
        });
    });

    // Add event listeners to images in feature cards
    document.querySelectorAll('.feature-content img').forEach(img => {
        img.addEventListener('click', function() {
            openModal(this.src);
        });
    });

    // Close modal when clicking on the background or the image
    modal.addEventListener('click', function(e) {
        closeModalFunc();
    });

    // Add event listener for Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === "block") {
            closeModalFunc();
        }
    });

    // About card handler
    const aboutCards = document.querySelectorAll('.about-card');
    const aboutModal = document.querySelector('.about-modal');
    const aboutModalBody = document.querySelector('.about-modal-body');
    const aboutModalClose = document.querySelector('.about-modal-close');

    aboutCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('p').innerHTML;
            
            aboutModalBody.innerHTML = `
                <h2>${title}</h2>
                <div>${description}</div>
            `;
            
            aboutModal.style.display = 'block';
            requestAnimationFrame(() => {
                aboutModal.classList.add('active');
            });
        });
    });

    function closeAboutModal() {
        aboutModal.classList.remove('active');
        setTimeout(() => {
            aboutModal.style.display = 'none';
        }, 300);
    }

    aboutModalClose.addEventListener('click', closeAboutModal);
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            closeAboutModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && aboutModal.style.display === 'block') {
            closeAboutModal();
        }
    });

    document.querySelector('.cta-button').addEventListener('click', () => {
        const aboutSection = document.querySelector('.about-us');
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });

    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми анимируемыми элементами
    document.querySelectorAll('.animate-fadeInUp, .animate-fadeInLeft, .animate-fadeInRight, .animate-scaleIn').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // Анимация для иконок
    const floatIcons = document.querySelectorAll('.animate-float');
    floatIcons.forEach(icon => {
        icon.style.animation = 'float 3s ease-in-out infinite';
    });

    // Анимация для кнопок
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 4px 12px rgba(var(--accent-rgb), 0.3)';
        });

        button.addEventListener('mouseout', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });
    });

    // Анимация для карточек
    const cards = document.querySelectorAll('.feature-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseover', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 16px var(--shadow-color)';
        });

        card.addEventListener('mouseout', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 6px var(--shadow-color)';
        });
    });

    // Анимация для социальных иконок
    const socialIcons = document.querySelectorAll('.social-links a');
    socialIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.1}s`;
    });

    // Плавный скролл для навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Анимация для чисел в статистике
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Анимация для чисел при появлении
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const end = parseInt(element.getAttribute('data-value'));
                animateValue(element, 0, end, 2000);
                numberObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.animate-number').forEach(el => {
        numberObserver.observe(el);
    });

    function showPlanSelectionModal(planType) {
        const planData = {
            monthly: {
                name: 'Monthly',
                price: '€5',
                period: 'month'
            },
            semester: {
                name: 'Semester',
                price: '€25',
                period: 'semester'
            },
            annual: {
                name: 'Annual',
                price: '€45',
                period: 'year'
            }
        };

        const plan = planData[planType];
        
        // Remove existing modal if any
        const existingModal = document.querySelector('.plan-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'plan-modal';
        modal.innerHTML = `
            <div class="plan-modal-content">
                <button class="close-button">&times;</button>
                <h2>Plan Selection Confirmation</h2>
                <div class="plan-details">
                    <p>You selected the "${plan.name}" plan</p>
                    <p>Price: ${plan.price}/${plan.period}</p>
                </div>
                <form class="payment-form">
                    <div class="form-group">
                        <label for="cardNumber">Card Number</label>
                        <input type="text" id="cardNumber" maxlength="19" placeholder="1234 5678 9012 3456" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="expiryDate">Expiry Date</label>
                            <input type="text" id="expiryDate" maxlength="5" placeholder="MM/YY" required>
                        </div>
                        <div class="form-group">
                            <label for="cvv">CVV</label>
                            <input type="text" id="cvv" maxlength="4" placeholder="123" required>
                        </div>
                    </div>
                    <button type="submit" class="cta-button confirm-plan">Confirm Payment</button>
                </form>
            </div>
        `;

        // Add modal to body
        document.body.appendChild(modal);

        // Show modal with animation
        setTimeout(() => modal.classList.add('active'), 10);

        // Card number formatting
        const cardNumber = modal.querySelector('#cardNumber');
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value;
        });

        // Expiry date formatting
        const expiryDate = modal.querySelector('#expiryDate');
        expiryDate.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });

        // CVV formatting
        const cvv = modal.querySelector('#cvv');
        cvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        // Close modal function
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };

        // Add event listeners
        modal.querySelector('.close-button').addEventListener('click', closeModal);
        modal.querySelector('.payment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('success', `You have successfully selected the "${plan.name}" plan`);
            closeModal();
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    function showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});

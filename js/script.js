// DOM готов
document.addEventListener('DOMContentLoaded', function() {
    
    // Таймер обратного отсчета
    const launchDate = new Date('December 22, 2025 23:59:59').getTime();
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    function updateTimer() {
        const now = new Date().getTime();
        const timeLeft = launchDate - now;
        
        if (timeLeft < 0) {
            daysEl.innerText = '00';
            hoursEl.innerText = '00';
            minutesEl.innerText = '00';
            secondsEl.innerText = '00';
            
            // Изменяем текст, если время истекло
            const timerNote = document.querySelector('.timer-note');
            if (timerNote) {
                timerNote.innerHTML = 'Запуск состоялся! <span class="highlight">Платформа ЭЛАР доступна</span>';
            }
            
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Анимация изменения чисел
        animateNumberChange(daysEl, days);
        animateNumberChange(hoursEl, hours);
        animateNumberChange(minutesEl, minutes);
        animateNumberChange(secondsEl, seconds);
    }
    
    // Анимация изменения чисел в таймере
    function animateNumberChange(element, newValue) {
        const oldValue = parseInt(element.textContent);
        if (oldValue === newValue) return;
        
        element.style.transform = 'translateY(-10px)';
        element.style.opacity = '0.5';
        
        setTimeout(() => {
            element.textContent = newValue.toString().padStart(2, '0');
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        }, 150);
    }
    
    // Запуск таймера
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    
    // Анимация прогресс-бара
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    let progressValue = 0;
    const targetProgress = 85;
    
    function animateProgressBar() {
        if (progressValue < targetProgress) {
            progressValue++;
            progressFill.style.width = `${progressValue}%`;
            progressPercent.textContent = `${progressValue}%`;
            
            // Меняем цвет в зависимости от прогресса
            if (progressValue < 30) {
                progressFill.style.background = 'linear-gradient(to right, #ff3b30, #ff9500)';
            } else if (progressValue < 70) {
                progressFill.style.background = 'linear-gradient(to right, #ff9500, #ffcc00)';
            } else {
                progressFill.style.background = 'linear-gradient(to right, #34c759, #0044D8)';
            }
            
            setTimeout(animateProgressBar, 20);
        }
    }
    
    // Запуск анимации прогресс-бара при прокрутке до него
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateProgressBar, 500);
                progressObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressObserver.observe(progressContainer);
    }
    
    // Анимация статистики
    function animateStats() {
        const statValues = document.querySelectorAll('.stat-value');
        
        statValues.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const increment = target / 100;
            let current = 0;
            
            const updateStat = () => {
                if (current < target) {
                    current += increment;
                    if (current > target) current = target;
                    stat.textContent = Math.round(current);
                    setTimeout(updateStat, 20);
                } else {
                    stat.textContent = target;
                    // Добавляем знак процента или плюс
                    if (stat.textContent === '99') stat.textContent += '%';
                    if (stat.textContent === '24') stat.textContent += '/7';
                }
            };
            
            updateStat();
        });
    }
    
    // Наблюдатель для анимации статистики
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }
    
    // Бургер-меню
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileNav = document.getElementById('mobileNav');
    const closeMenu = document.getElementById('closeMenu');
    
    burgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeMenu.addEventListener('click', function() {
        burgerMenu.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Закрытие мобильного меню при клике на ссылку
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            burgerMenu.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Плавная прокрутка для всех ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Кнопка "Наверх"
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
        
        // Анимация header при прокрутке
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Анимация элементов при прокрутке
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('visible');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    // Запускаем один раз при загрузке
    animateOnScroll();
    
    // Форма подписки
    const subscribeForm = document.getElementById('subscribeForm');
    const formMessage = document.getElementById('formMessage');
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Валидация email
            if (!validateEmail(email)) {
                showFormMessage('Пожалуйста, введите корректный email адрес', 'error');
                return;
            }
            
            // Имитация отправки
            showFormMessage('Спасибо! Вы подписались на обновления. Мы сообщим о запуске первыми.', 'success');
            
            // Очистка поля
            emailInput.value = '';
            
            // Скрытие сообщения через 5 секунд
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        });
    }
    
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function showFormMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
    }
    
    // Динамическое изменение текста в заголовке
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        let isAnimating = false;
        
        heroTitle.addEventListener('mouseenter', function() {
            if (isAnimating) return;
            isAnimating = true;
            
            // Эффект разбора текста на буквы
            const letters = originalText.split('');
            let scrambledText = '';
            
            // Создаем "скремблированный" текст
            letters.forEach(letter => {
                if (letter === ' ') {
                    scrambledText += ' ';
                } else {
                    scrambledText += String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            });
            
            // Анимация "сборки" текста
            let currentIndex = 0;
            const interval = setInterval(() => {
                if (currentIndex >= originalText.length) {
                    clearInterval(interval);
                    isAnimating = false;
                    return;
                }
                
                const newText = originalText.substring(0, currentIndex + 1) + scrambledText.substring(currentIndex + 1);
                heroTitle.textContent = newText;
                currentIndex++;
            }, 50);
        });
    }
    
    // Случайное изменение цвета некоторых элементов при наведении
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.icon-circle');
            if (icon) {
                // Случайный оттенок синего
                const hue = 210 + Math.floor(Math.random() * 30);
                icon.style.backgroundColor = `hsl(${hue}, 100%, 60%)`;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.icon-circle');
            if (icon) {
                // Возвращаем исходный цвет через 0.5 секунд
                setTimeout(() => {
                    icon.style.backgroundColor = '';
                }, 500);
            }
        });
    });
    
    // Эффект параллакса для фона
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const animatedBg = document.querySelector('.animated-bg');
        
        if (animatedBg) {
            animatedBg.style.transform = `translateY(${scrolled * 0.05}px)`;
        }
        
        // Плавающие элементы
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((el, index) => {
            const speed = 0.03 + (index * 0.01);
            el.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02}deg)`;
        });
    });
    
    // Запуск всех анимаций после загрузки страницы
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});
// DOM готов
document.addEventListener('DOMContentLoaded', function() {
    
    // Таймер обратного отсчета
    const launchDate = new Date('December 22, 2025 23:59:59').getTime();
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // Глобальные переменные для таймера
    let timerInterval;
    let lastValues = {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
    };
    
    // Улучшенная функция обновления значений таймера
    function updateTimerValue(element, newValue, unit) {
        const oldValue = parseInt(element.textContent);
        if (oldValue === newValue) return;
        
        // Форматируем значение (добавляем ведущий ноль)
        const formattedValue = newValue.toString().padStart(2, '0');
        
        // Сохраняем текущее значение для проверки изменений
        lastValues[unit] = formattedValue;
        
        // Добавляем класс анимации
        element.classList.add('updating');
        
        // Обновляем значение после начала анимации
        setTimeout(() => {
            element.textContent = formattedValue;
        }, 300);
        
        // Убираем класс анимации после её завершения
        setTimeout(() => {
            element.classList.remove('updating');
        }, 600);
        
        // Добавляем эффект "пульсации" для секунд
        if (unit === 'seconds') {
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    // Основная функция таймера
    function updateTimer() {
        const now = new Date().getTime();
        const timeLeft = launchDate - now;
        
        if (timeLeft < 0) {
            // Запуск уже состоялся
            clearInterval(timerInterval);
            daysEl.innerText = '00';
            hoursEl.innerText = '00';
            minutesEl.innerText = '00';
            secondsEl.innerText = '00';
            
            // Изменяем текст, если время истекло
            const timerNote = document.querySelector('.timer-note');
            if (timerNote) {
                timerNote.innerHTML = 'Запуск состоялся! <span class="highlight">Платформа ЭЛАР доступна</span>';
            }
            
            // Меняем прогресс-бар на 100%
            if (progressFill && progressPercent) {
                progressFill.style.width = '100%';
                progressPercent.textContent = '100%';
            }
            
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Обновляем значения с плавной анимацией
        if (daysEl) updateTimerValue(daysEl, days, 'days');
        if (hoursEl) updateTimerValue(hoursEl, hours, 'hours');
        if (minutesEl) updateTimerValue(minutesEl, minutes, 'minutes');
        if (secondsEl) updateTimerValue(secondsEl, seconds, 'seconds');
    }
    
    // Запуск таймера
    if (daysEl && hoursEl && minutesEl && secondsEl) {
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    // Анимация прогресс-бара
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    let progressValue = 0;
    const targetProgress = 85;
    
    function animateProgressBar() {
        if (progressValue < targetProgress) {
            progressValue++;
            
            if (progressFill) {
                progressFill.style.width = `${progressValue}%`;
            }
            
            if (progressPercent) {
                progressPercent.textContent = `${progressValue}%`;
            }
            
            // Плавное изменение цвета по мере прогресса
            if (progressFill) {
                const hue = 210 + (progressValue * 0.6); // От синего к зеленому
                const saturation = 80 + (progressValue * 0.2);
                progressFill.style.background = `linear-gradient(90deg, 
                    hsl(${hue}, ${saturation}%, 60%) 0%, 
                    hsl(${hue + 20}, ${saturation}%, 70%) 100%)`;
            }
            
            // Плавное увеличение скорости в конце
            const delay = progressValue < 70 ? 20 : 10;
            setTimeout(animateProgressBar, delay);
        }
    }
    
    // Запуск анимации прогресс-бара при прокрутке до него
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && progressFill && progressPercent) {
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
            const target = parseInt(stat.getAttribute('data-count')) || 0;
            const increment = Math.max(target / 100, 1);
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
    
    if (burgerMenu && mobileNav && closeMenu) {
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
    }
    
    // Плавная прокрутка для всех ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Кнопка "Наверх"
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollToTopBtn.style.display = 'flex';
                scrollToTopBtn.classList.add('active');
            } else {
                scrollToTopBtn.style.display = 'none';
                scrollToTopBtn.classList.remove('active');
            }
            
            // Анимация header при прокрутке
            const header = document.querySelector('header');
            if (header) {
                if (window.scrollY > 100) {
                    header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
                    header.style.backdropFilter = 'blur(10px)';
                } else {
                    header.style.boxShadow = 'none';
                    header.style.backdropFilter = 'blur(5px)';
                }
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
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
    setTimeout(animateOnScroll, 100);
    
    // Форма подписки
    const subscribeForm = document.getElementById('subscribeForm');
    const formMessage = document.getElementById('formMessage');
    
    if (subscribeForm && formMessage) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value : '';
            
            // Валидация email
            if (!validateEmail(email)) {
                showFormMessage('Пожалуйста, введите корректный email адрес', 'error');
                return;
            }
            
            // Имитация отправки
            showFormMessage('Спасибо! Вы подписались на обновления. Мы сообщим о запуске первыми.', 'success');
            
            // Очистка поля
            if (emailInput) {
                emailInput.value = '';
            }
            
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
        if (formMessage) {
            formMessage.textContent = text;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';
        }
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
        
        // Параллакс для CTA секции опроса
        const surveySection = document.querySelector('.survey-cta');
        if (surveySection) {
            const offset = surveySection.offsetTop;
            const windowHeight = window.innerHeight;
            
            if (scrolled + windowHeight > offset) {
                const parallaxValue = (scrolled - offset + windowHeight) * 0.05;
                surveySection.style.backgroundPositionY = `${parallaxValue}px`;
            }
        }
    });
    
    // Анимация для CTA кнопки опроса
    const surveyButton = document.querySelector('.survey-button');
    if (surveyButton) {
        let pulseInterval;
        
        // Функция пульсирующей анимации
        function startPulseAnimation() {
            pulseInterval = setInterval(() => {
                surveyButton.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    surveyButton.style.transform = 'scale(1)';
                }, 500);
            }, 3000);
        }
        
        // Запускаем анимацию
        setTimeout(startPulseAnimation, 2000);
        
        // Добавляем эффект при наведении
        surveyButton.addEventListener('mouseenter', function() {
            if (pulseInterval) {
                clearInterval(pulseInterval);
                pulseInterval = null;
            }
            this.style.transform = 'scale(1.05)';
        });
        
        surveyButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            if (!pulseInterval) {
                startPulseAnimation();
            }
        });
        
        // Клик по кнопке опроса
        surveyButton.addEventListener('click', function() {
            // Добавляем эффект клика
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Здесь можно добавить аналитику или другие действия
            console.log('Кнопка опроса нажата');
        });
    }
    
    // Анимация для иконки опроса
    const surveyIcon = document.querySelector('.survey-icon');
    if (surveyIcon) {
        setInterval(() => {
            surveyIcon.style.transform = 'rotate(5deg)';
            setTimeout(() => {
                surveyIcon.style.transform = 'rotate(-5deg)';
            }, 500);
            setTimeout(() => {
                surveyIcon.style.transform = 'rotate(0deg)';
            }, 1000);
        }, 4000);
    }
    
    // Анимация элементов преимуществ опроса
    const benefitItems = document.querySelectorAll('.benefit-item');
    benefitItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
    });
    
    // Дополнительные анимации при загрузке
    const quoteCard = document.querySelector('.quote-card');
    if (quoteCard) {
        setTimeout(() => {
            quoteCard.style.transform = 'scale(1.02)';
            setTimeout(() => {
                quoteCard.style.transform = 'scale(1)';
            }, 300);
        }, 1000);
    }
    
    // Загрузка анимированных элементов
    const loadAnimatedElements = () => {
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((el, index) => {
            el.style.opacity = '0';
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s ease';
                el.style.opacity = '1';
            }, 500 + (index * 200));
        });
    };
    
    // Запуск всех анимаций после загрузки страницы
    setTimeout(() => {
        document.body.classList.add('loaded');
        loadAnimatedElements();
        
        // Инициализация всех наблюдателей
        animateOnScroll();
    }, 500);
    
    // Обработка видимости кнопки "Наверх" при загрузке
    if (scrollToTopBtn) {
        setTimeout(() => {
            if (window.scrollY > 500) {
                scrollToTopBtn.style.display = 'flex';
                scrollToTopBtn.classList.add('active');
            }
        }, 100);
    }
    
    // Предотвращение перезагрузки страницы при отправке формы
    document.addEventListener('submit', function(e) {
        if (e.target.tagName === 'FORM' && !e.target.action) {
            e.preventDefault();
        }
    });
    
    // Улучшенная обработка ресайза окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Обновляем позиции элементов при ресайзе
            animateOnScroll();
            
            // Скрываем мобильное меню при увеличении ширины
            if (window.innerWidth > 768 && mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                if (burgerMenu) burgerMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }, 250);
    });
    
    // Добавляем слушатель для клавиши Escape (закрытие меню)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            if (burgerMenu) burgerMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Анимация при первом скролле
    let firstScroll = true;
    window.addEventListener('scroll', function() {
        if (firstScroll && window.scrollY > 50) {
            firstScroll = false;
            
            // Анимация для header
            const header = document.querySelector('header');
            if (header) {
                header.style.transition = 'all 0.3s ease';
            }
            
            // Анимация для кнопки наверх
            if (scrollToTopBtn && window.scrollY > 500) {
                scrollToTopBtn.style.transition = 'all 0.3s ease';
            }
        }
    });
});

// Глобальные функции для повторного использования
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

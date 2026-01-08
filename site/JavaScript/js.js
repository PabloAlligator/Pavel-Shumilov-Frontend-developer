// Прелоудер с эффектом "матрицы" - ОПТИМИЗИРОВАННАЯ ВЕРСИЯ
document.addEventListener('DOMContentLoaded', function() {
    // Настройки
    const COLOR_MAIN = '#9b5cff'; // Основной цвет (фиолетовый)
    const BG_ALPHA = 0.18; // Прозрачность фона
    const HELLO_TEXT = 'HELLO'; // Текст для анимации

    // Получаем элементы
    const preloader = document.querySelector('.preloader');
    const canvas = document.querySelector('#preloader');
    
    if (!canvas) {
        console.error('Canvas не найден!');
        // Сразу скрываем прелоудер
        if (preloader) {
            preloader.style.display = 'none';
            document.body.classList.remove('preloader-active');
        }
        document.body.style.overflow = 'auto';
        return;
    }
    
    const ctx = canvas.getContext('2d');

    // Проверяем, есть ли элементы
    if (!canvas || !preloader) {
        console.error('Не найдены элементы прелоудера');
        document.body.style.overflow = 'auto';
        return;
    }

    console.log('Прелоудер запускается...');

    // Добавляем класс к body для управления стилями
    document.body.classList.add('preloader-active');

    // Переменные состояния
    let running = true;
    let phase = 'matrix';
    let particles = [];
    let helloTargets = [];
    let startTime = Date.now();

    // Блокируем скролл во время прелоудера
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';

    // ============ РАЗМЕРЫ CANVAS ============
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Вычисляем размер шрифта и колонок
    const fontSize = Math.max(window.innerWidth / 45, 14);
    const columns = Math.floor(canvas.width / fontSize);
    
    // Массивы для капель матрицы
    const dropsDown = Array(columns).fill(0);
    const dropsUp = Array(columns).fill(canvas.height / fontSize);

    // ============ ФУНКЦИЯ ОТРИСОВКИ МАТРИЦЫ ============
    function drawMatrix() {
        // Полупрозрачный черный фон для эффекта следа
        ctx.fillStyle = `rgba(0, 0, 0, ${BG_ALPHA})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Цвет цифр
        ctx.fillStyle = COLOR_MAIN;
        ctx.font = `${fontSize}px 'Courier New', monospace`;

        // Рисуем цифры для каждой колонки
        for (let i = 0; i < columns; i++) {
            const char = Math.floor(Math.random() * 10); // Случайная цифра 0-9

            // Падающие вниз капли
            ctx.fillText(char, i * fontSize, dropsDown[i] * fontSize);
            if (dropsDown[i] * fontSize > canvas.height && Math.random() > 0.975) {
                dropsDown[i] = 0; // Сброс капли
            }
            dropsDown[i]++;

            // Поднимающиеся вверх капли
            ctx.fillText(char, i * fontSize, dropsUp[i] * fontSize);
            if (dropsUp[i] * fontSize < 0 && Math.random() > 0.975) {
                dropsUp[i] = canvas.height / fontSize; // Сброс капли
            }
            dropsUp[i]--;
        }
    }

    // ============ СОЗДАНИЕ ЦЕЛЕЙ ДЛЯ ТЕКСТА "HELLO" ============
    function createHelloTargets() {
        // Очищаем canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Рисуем текст "HELLO" для анализа пикселей
        ctx.font = `bold ${fontSize * 5}px 'Courier New', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(HELLO_TEXT, canvas.width / 2, canvas.height / 2);

        // Получаем данные пикселей
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        helloTargets = [];

        // Проходим по всем пикселям с шагом 6 (для оптимизации)
        for (let y = 0; y < canvas.height; y += 6) {
            for (let x = 0; x < canvas.width; x += 6) {
                const pixelIndex = (y * canvas.width + x) * 4;
                // Если пиксель непрозрачный (альфа > 150)
                if (imageData[pixelIndex + 3] > 150) {
                    helloTargets.push({ x, y });
                }
            }
        }

        // Создаем частицы для морфинга
        particles = helloTargets.map(target => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            targetX: target.x,
            targetY: target.y,
            speed: Math.random() * 0.06 + 0.02,
            char: Math.floor(Math.random() * 10)
        }));
    }

    // ============ МОРФИНГ В СЛОВО "HELLO" ============
    function morphToHello() {
        // Полупрозрачный фон
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Настройки для цифр
        ctx.fillStyle = COLOR_MAIN;
        ctx.font = `${fontSize}px 'Courier New', monospace`;

        // Анимируем каждую частицу
        particles.forEach(particle => {
            // Плавное движение к цели
            particle.x += (particle.targetX - particle.x) * particle.speed;
            particle.y += (particle.targetY - particle.y) * particle.speed;
            
            // Рисуем цифру
            ctx.fillText(particle.char, particle.x, particle.y);
            
            // Иногда меняем цифру
            if (Math.random() > 0.9) {
                particle.char = Math.floor(Math.random() * 10);
            }
        });
    }

    // ============ ЭФФЕКТ ГЛИТЧА ============
    function drawGlitch() {
        // Темный фон
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Настройки текста
        ctx.font = `bold ${fontSize * 5}px 'Courier New', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const text = 'H▒LL0'; // Текст с глитч-символами
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Рисуем несколько слоев со смещением для эффекта глитча
        ctx.fillStyle = COLOR_MAIN;
        ctx.fillText(text, centerX, centerY);

        // Белый слой со смещением
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, centerX + 3, centerY);

        // Основной слой с обратным смещением
        ctx.fillStyle = COLOR_MAIN;
        ctx.fillText(text, centerX - 3, centerY);

        // Случайные линии глитча
        if (Math.random() > 0.7) {
            const glitchY = centerY - fontSize * 2 + Math.random() * fontSize * 4;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(centerX - 150, glitchY, 300, 2);
        }
    }

    // ============ УПРОЩЕННАЯ АНИМАЦИЯ СОКРАЩЕННАЯ В 1.3 РАЗА ============
    function animate() {
        if (!running) return;

        const currentTime = Date.now() - startTime;

        // СОКРАЩЕННЫЕ ВРЕМЕНА (оригинал / 1.3)
        // Было: 2000, 1500, 500, 500 = 4500ms (4.5 сек)
        // Стало: 1538, 1154, 385, 385 = 3462ms (~3.5 сек)
        if (currentTime < 1538) {
            phase = 'matrix';
            drawMatrix();
        } else if (currentTime < 2692) { // 1538 + 1154
            phase = 'morph';
            morphToHello();
        } else if (currentTime < 3077) { // 2692 + 385
            phase = 'glitch';
            drawGlitch();
        } else if (currentTime < 3462) { // 3077 + 385
            phase = 'morph';
            morphToHello();
        } else {
            destroyPreloader();
            return;
        }

        // Запрашиваем следующий кадр
        requestAnimationFrame(animate);
    }

    // ============ УНИЧТОЖЕНИЕ ПРЕЛОУДЕРА ============
    function destroyPreloader() {
        if (!running) return;
        running = false;
        
        console.log('Завершаем прелоудер...');
        
        // Убираем класс с body перед анимацией исчезновения
        document.body.classList.remove('preloader-active');
        
        // Плавное исчезновение
        preloader.style.transition = 'opacity 0.5s ease';
        preloader.style.opacity = '0';
        
        // Разблокируем скролл сразу (не ждем окончания анимации)
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
        
        // Удаляем прелоудер из DOM
        setTimeout(() => {
            if (preloader && preloader.parentElement) {
                preloader.style.display = 'none';
                preloader.remove();
                console.log('Прелоудер удален');
            }
        }, 500); // Уменьшили время ожидания
    }

    // ============ ЗАПУСК АНИМАЦИИ ============
    
    // Создаем цели для морфинга
    createHelloTargets();
    
    // Запускаем анимацию
    animate();
    
    // Автоматическое закрытие через 4 секунды на всякий случай
    setTimeout(() => {
        if (preloader && preloader.parentElement && running) {
            console.log('Автоматическое закрытие прелоудера');
            destroyPreloader();
        }
    }, 4000);
});



// // прелоадер
// window.addEventListener("load", function() {
//     const preloader = document.getElementById("preloader");
//     const content = document.getElementById("content");

//     // Минимальное время показа прелоадера (в миллисекундах)
//     const minDisplayTime = 200; // = 2 секунды

//     const startTime = Date.now();

//     // Функция скрытия прелоадера
//     const hidePreloader = () => {
//       const elapsed = Date.now() - startTime;
//       const remaining = Math.max(0, minDisplayTime - elapsed);

//       // ждём, если страница загрузилась слишком быстро
//       setTimeout(() => {
//         preloader.style.opacity = "0";
//         setTimeout(() => {
//           preloader.style.display = "none";
//           content.style.display = "block";
//         }, 600); // анимация исчезновения
//       }, remaining);
//     };

//     hidePreloader();
//   });

// document.addEventListener('DOMContentLoaded', function() {
//     const typedText = document.querySelector('.typed-text');
//     const cursor = document.querySelector('.cursor');
    
//     const texts = [
//         {text: "Hello world!", speed: 100, pause: 1000},
//         {text: "Hi, my name is Pavel!", speed: 80, pause: 3000}
//     ];
    
//     let textIndex = 0;
//     let charIndex = 0;
//     let isDeleting = false;
    
//     function type() {
//         const current = texts[textIndex];
        
//         if (!isDeleting && charIndex < current.text.length) {
//             typedText.textContent += current.text.charAt(charIndex);
//             charIndex++;
//             setTimeout(type, current.speed);
//         } else if (isDeleting && charIndex > 0) {
//             typedText.textContent = current.text.substring(0, charIndex - 1);
//             charIndex--;
//             setTimeout(type, current.speed / 2);
//         } else {
//             isDeleting = !isDeleting;
            
//             if (!isDeleting) {
//                 textIndex = (textIndex + 1) % texts.length;
//             }
            
//             setTimeout(type, current.pause);
//         }
//     }
    
//     // Запускаем анимацию
//     setTimeout(type, 500);
// });

// burger menu
// document.addEventListener('DOMContentLoaded', function() {
//     const burger = document.querySelector('.burger');
//     const navLinks = document.querySelector('.navbar-links');

//     burger.addEventListener('click', () => {
//         burger.classList.toggle('active');
//         navLinks.classList.toggle('active');
//     });

//     document.querySelectorAll('.navbar-links a').forEach(link => {
//         link.addEventListener('click', () => {
//             burger.classList.remove('active');
//             navLinks.classList.remove('active');
//         });
//     });
// });



// new menu
(function () {
    const overlay = document.getElementById('menuOverlay');
    const burgerElems = document.querySelectorAll('#burgerMenu, .burger, .burger-menu');
    const closeBtn = overlay && overlay.querySelector('.menu-close');
    const firstLink = overlay && overlay.querySelector('.menu-nav a');

    function openMenu(e) {
        e && e.preventDefault();
        if (!overlay) return;
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        // фокус на первый элемент для доступа с клавиатуры
        setTimeout(() => firstLink && firstLink.focus(), 260);
    }

    function closeMenu() {
        if (!overlay) return;
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    burgerElems.forEach(el => el && el.addEventListener('click', openMenu));
    closeBtn && closeBtn.addEventListener('click', closeMenu);

    // клик по фону закрывает меню
    overlay && overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeMenu();
    });

    // Esc закрывает
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // автоматически закрывать при переходе по ссылке внутри меню
    overlay && overlay.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a');
        if (a && a.closest('.menu-nav')) closeMenu();
    });
})();





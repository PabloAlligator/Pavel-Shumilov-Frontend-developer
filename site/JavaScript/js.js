
// прелоадер
window.addEventListener("load", function() {
    const preloader = document.getElementById("preloader");
    const content = document.getElementById("content");

    // Минимальное время показа прелоадера (в миллисекундах)
    const minDisplayTime = 1000; // = 2 секунды

    const startTime = Date.now();

    // Функция скрытия прелоадера
    const hidePreloader = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);

      // ждём, если страница загрузилась слишком быстро
      setTimeout(() => {
        preloader.style.opacity = "0";
        setTimeout(() => {
          preloader.style.display = "none";
          content.style.display = "block";
        }, 600); // анимация исчезновения
      }, remaining);
    };

    hidePreloader();
  });

document.addEventListener('DOMContentLoaded', function() {
    const typedText = document.querySelector('.typed-text');
    const cursor = document.querySelector('.cursor');
    
    const texts = [
        {text: "Hello world!", speed: 100, pause: 1000},
        {text: "Hi, my name is Pavel!", speed: 80, pause: 3000}
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const current = texts[textIndex];
        
        if (!isDeleting && charIndex < current.text.length) {
            typedText.textContent += current.text.charAt(charIndex);
            charIndex++;
            setTimeout(type, current.speed);
        } else if (isDeleting && charIndex > 0) {
            typedText.textContent = current.text.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(type, current.speed / 2);
        } else {
            isDeleting = !isDeleting;
            
            if (!isDeleting) {
                textIndex = (textIndex + 1) % texts.length;
            }
            
            setTimeout(type, current.pause);
        }
    }
    
    // Запускаем анимацию
    setTimeout(type, 500);
});

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





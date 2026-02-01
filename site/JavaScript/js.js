
document.addEventListener('DOMContentLoaded', function() {
    const COLOR_MAIN = '#9b5cff';
    const BG_ALPHA = 0.18; 
    const HELLO_TEXT = 'HELLO'; 

    const preloader = document.querySelector('.preloader');
    const canvas = document.querySelector('#preloader');
    
    if (!canvas) {
        console.error('Canvas не найден!');

        if (preloader) {
            preloader.style.display = 'none';
            document.body.classList.remove('preloader-active');
        }
        document.body.style.overflow = 'auto';
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!canvas || !preloader) {
        console.error('Не найдены элементы прелоудера');
        document.body.style.overflow = 'auto';
        return;
    }

    console.log('Прелоудер запускается...');

    document.body.classList.add('preloader-active');


    let running = true;
    let phase = 'matrix';
    let particles = [];
    let helloTargets = [];
    let startTime = Date.now();

    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const fontSize = Math.max(window.innerWidth / 45, 14);
    const columns = Math.floor(canvas.width / fontSize);

    const dropsDown = Array(columns).fill(0);
    const dropsUp = Array(columns).fill(canvas.height / fontSize);

    function drawMatrix() {

        ctx.fillStyle = `rgba(0, 0, 0, ${BG_ALPHA})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = COLOR_MAIN;
        ctx.font = `${fontSize}px 'Courier New', monospace`;

        for (let i = 0; i < columns; i++) {
            const char = Math.floor(Math.random() * 10); 

            ctx.fillText(char, i * fontSize, dropsDown[i] * fontSize);
            if (dropsDown[i] * fontSize > canvas.height && Math.random() > 0.975) {
                dropsDown[i] = 0; 
            }
            dropsDown[i]++;

            ctx.fillText(char, i * fontSize, dropsUp[i] * fontSize);
            if (dropsUp[i] * fontSize < 0 && Math.random() > 0.975) {
                dropsUp[i] = canvas.height / fontSize; 
            }
            dropsUp[i]--;
        }
    }

    function createHelloTargets() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = `bold ${fontSize * 5}px 'Courier New', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(HELLO_TEXT, canvas.width / 2, canvas.height / 2);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        helloTargets = [];

        for (let y = 0; y < canvas.height; y += 6) {
            for (let x = 0; x < canvas.width; x += 6) {
                const pixelIndex = (y * canvas.width + x) * 4;

                if (imageData[pixelIndex + 3] > 150) {
                    helloTargets.push({ x, y });
                }
            }
        }

        particles = helloTargets.map(target => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            targetX: target.x,
            targetY: target.y,
            speed: Math.random() * 0.06 + 0.02,
            char: Math.floor(Math.random() * 10)
        }));
    }

    function morphToHello() {

        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = COLOR_MAIN;
        ctx.font = `${fontSize}px 'Courier New', monospace`;


        particles.forEach(particle => {

            particle.x += (particle.targetX - particle.x) * particle.speed;
            particle.y += (particle.targetY - particle.y) * particle.speed;
            

            ctx.fillText(particle.char, particle.x, particle.y);
            

            if (Math.random() > 0.9) {
                particle.char = Math.floor(Math.random() * 10);
            }
        });
    }

    function drawGlitch() {

        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        ctx.font = `bold ${fontSize * 5}px 'Courier New', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const text = 'H▒LL0';
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;


        ctx.fillStyle = COLOR_MAIN;
        ctx.fillText(text, centerX, centerY);


        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, centerX + 3, centerY);

        ctx.fillStyle = COLOR_MAIN;
        ctx.fillText(text, centerX - 3, centerY);


        if (Math.random() > 0.7) {
            const glitchY = centerY - fontSize * 2 + Math.random() * fontSize * 4;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(centerX - 150, glitchY, 300, 2);
        }
    }


    function animate() {
        if (!running) return;

        const currentTime = Date.now() - startTime;

      
        if (currentTime < 1538) {
            phase = 'matrix';
            drawMatrix();
        } else if (currentTime < 2692) { 
            phase = 'morph';
            morphToHello();
        } else if (currentTime < 3077) {
            phase = 'glitch';
            drawGlitch();
        } else if (currentTime < 3462) {
            phase = 'morph';
            morphToHello();
        } else {
            destroyPreloader();
            return;
        }

        requestAnimationFrame(animate);
    }


    function destroyPreloader() {
        if (!running) return;
        running = false;
        
        console.log('Завершаем прелоудер...');
        
        document.body.classList.remove('preloader-active');
        
        preloader.style.transition = 'opacity 0.5s ease';
        preloader.style.opacity = '0';

        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
        
        setTimeout(() => {
            if (preloader && preloader.parentElement) {
                preloader.style.display = 'none';
                preloader.remove();
                console.log('Прелоудер удален');
            }
        }, 500); 
    }


    createHelloTargets();
    

    animate();
    

    setTimeout(() => {
        if (preloader && preloader.parentElement && running) {
            console.log('Автоматическое закрытие прелоудера');
            destroyPreloader();
        }
    }, 4000);
});


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

    overlay && overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
    overlay && overlay.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a');
        if (a && a.closest('.menu-nav')) closeMenu();
    });
})();





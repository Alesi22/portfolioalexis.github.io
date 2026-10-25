document.addEventListener('DOMContentLoaded', () => {

    // 1. Lógica del Tema 
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn.querySelector('.theme-icon-img');
    
    // Al cargar la página, revisa qué tema está guardado
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.src = 'img/luna.png'; // En modo claro mostramos la luna
    } else {
        themeIcon.src = 'img/sol.png'; // En modo oscuro mostramos el sol
    }

    // Al hacer clic en el botón
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            themeIcon.src = 'img/luna.png';
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.src = 'img/sol.png';
            localStorage.setItem('theme', 'dark');
        }
    });

    // 2. Menú Móvil
    const menuBtn = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // 3. Casos de estudio independientes: solo cambia la tarjeta pulsada.
    const toggleButtons = document.querySelectorAll('.toggle-btn');

    toggleButtons.forEach((btn, index) => {
        const card = btn.closest('.card');
        const details = card.querySelector('.card-details');
        const detailsId = `project-details-${index + 1}`;

        details.id = details.id || detailsId;
        btn.setAttribute('aria-controls', details.id);
        btn.setAttribute('aria-expanded', 'false');

        btn.addEventListener('click', function() {
            const isOpen = details.classList.toggle('open');
            this.textContent = isOpen ? 'Ocultar detalles' : 'Ver caso de estudio';
            this.setAttribute('aria-expanded', String(isOpen));
        });
    });

    // 4. Slider elegante e independiente por proyecto: autoplay lento, flechas, puntos y pausa.
    document.querySelectorAll('.project-slider').forEach((slider, sliderIndex) => {
        const allImages = Array.from(slider.querySelectorAll('.slider-image'));

        // Elimina imágenes que no se pudieron cargar y evita mostrar iconos rotos.
        allImages.forEach(image => {
            const removeIfBroken = () => {
                if (!image.naturalWidth) {
                    const wasActive = image.classList.contains('is-active');
                    image.remove();
                    if (wasActive) {
                        const first = slider.querySelector('.slider-image');
                        if (first) first.classList.add('is-active');
                    }
                }
            };
            if (image.complete) removeIfBroken();
            else image.addEventListener('error', () => image.remove(), { once: true });
        });

        const images = Array.from(slider.querySelectorAll('.slider-image'));
        if (images.length < 2) return;

        slider.setAttribute('role', 'region');
        slider.setAttribute('aria-roledescription', 'carrusel');
        slider.setAttribute('tabindex', '0');

        let currentIndex = Math.max(0, images.findIndex(image => image.classList.contains('is-active')));
        let timer = null;
        const interval = Math.max(3500, Number(slider.dataset.interval) || 4500);

        const controls = document.createElement('div');
        controls.className = 'slider-controls';
        controls.setAttribute('aria-label', 'Controles de la galería');

        const previous = document.createElement('button');
        previous.className = 'slider-arrow slider-arrow--prev';
        previous.type = 'button';
        previous.setAttribute('aria-label', 'Ver imagen anterior');
        previous.innerHTML = '<span aria-hidden="true">&#8249;</span>';

        const next = document.createElement('button');
        next.className = 'slider-arrow slider-arrow--next';
        next.type = 'button';
        next.setAttribute('aria-label', 'Ver imagen siguiente');
        next.innerHTML = '<span aria-hidden="true">&#8250;</span>';

        const pagination = document.createElement('div');
        pagination.className = 'slider-pagination';
        pagination.setAttribute('aria-label', 'Elegir imagen');
        const dots = images.map((image, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'slider-dot';
            dot.setAttribute('aria-label', `Mostrar imagen ${index + 1} de ${images.length}`);
            dot.addEventListener('click', () => showImage(index, true));
            pagination.appendChild(dot);
            return dot;
        });

        controls.append(previous, pagination, next);
        slider.appendChild(controls);

        function showImage(index, userInitiated = false) {
            const nextIndex = (index + images.length) % images.length;
            images[currentIndex].classList.remove('is-active');
            images[nextIndex].classList.add('is-active');
            currentIndex = nextIndex;
            dots.forEach((dot, dotIndex) => {
                const active = dotIndex === currentIndex;
                dot.classList.toggle('is-active', active);
                if (active) dot.setAttribute('aria-current', 'true');
                else dot.removeAttribute('aria-current');
            });
            if (userInitiated) restartAutoplay();
        }

        function stopAutoplay() {
            if (timer) window.clearInterval(timer);
            timer = null;
        }
        function startAutoplay() {
            stopAutoplay();
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            timer = window.setInterval(() => showImage(currentIndex + 1), interval);
        }
        function restartAutoplay() {
            startAutoplay();
        }

        previous.addEventListener('click', () => showImage(currentIndex - 1, true));
        next.addEventListener('click', () => showImage(currentIndex + 1, true));
        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
        slider.addEventListener('focusin', stopAutoplay);
        slider.addEventListener('focusout', event => {
            if (!slider.contains(event.relatedTarget)) startAutoplay();
        });
        slider.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(currentIndex - 1, true); }
            if (event.key === 'ArrowRight') { event.preventDefault(); showImage(currentIndex + 1, true); }
        });

        // Gesto táctil para avanzar con un deslizamiento en móviles.
        let touchStartX = null;
        slider.addEventListener('touchstart', event => {
            touchStartX = event.changedTouches[0].clientX;
        }, { passive: true });
        slider.addEventListener('touchend', event => {
            if (touchStartX === null) return;
            const deltaX = event.changedTouches[0].clientX - touchStartX;
            if (Math.abs(deltaX) > 45) showImage(currentIndex + (deltaX < 0 ? 1 : -1), true);
            touchStartX = null;
        }, { passive: true });

        showImage(currentIndex);
        startAutoplay();
    });

    // 5. Intersect Observer para animaciones fluidas
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    });

    fadeElements.forEach(el => {
        observer.observe(el);
    });

});

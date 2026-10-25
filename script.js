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

    // 4. Slider independiente por proyecto, con fundido automático.
    document.querySelectorAll('.project-slider').forEach(slider => {
        const images = Array.from(slider.querySelectorAll('.slider-image'));
        // Si algún archivo falta, lo quitamos de la galería para evitar un cuadro roto.
        images.forEach(image => {
            image.addEventListener('error', () => {
                image.remove();
            }, { once: true });
        });

        if (images.length < 2) return;

        let currentIndex = 0;
        const interval = Number(slider.dataset.interval) || 1500;

        window.setInterval(() => {
            const availableImages = Array.from(slider.querySelectorAll('.slider-image'));
            if (availableImages.length < 2) return;
            const activeIndex = availableImages.findIndex(image => image.classList.contains('is-active'));
            const safeIndex = activeIndex < 0 ? 0 : activeIndex;
            const nextIndex = (safeIndex + 1) % availableImages.length;
            availableImages[safeIndex].classList.remove('is-active');
            availableImages[nextIndex].classList.add('is-active');
        }, interval);
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

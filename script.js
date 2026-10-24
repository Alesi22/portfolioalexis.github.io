document.addEventListener('DOMContentLoaded', () => {

    // 1. Lógica del Tema (Base: Oscuro/Púrpura)
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn.querySelector('.theme-icon');
    
    // Como el tema base (CSS :root) es oscuro, solo aplicamos la clase si el usuario eligió "light"
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.textContent = '🌙'; // Muestra la luna para poder volver al oscuro
    } else {
        themeIcon.textContent = '☀️'; // Por defecto muestra el sol para pasar a claro
    }

    // Alternar tema al hacer click
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    });

    // 2. Menú Móvil (Toggle)
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

    // 3. Acordeón para expandir Casos de Estudio en Cards
    const toggleButtons = document.querySelectorAll('.toggle-btn');

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.card');
            const details = card.querySelector('.card-details');
            
            details.classList.toggle('open');
            
            if (details.classList.contains('open')) {
                this.textContent = 'Ocultar detalles';
            } else {
                this.textContent = 'Ver caso de estudio';
            }
        });
    });

    // 4. Intersect Observer para animaciones "fade-in"
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
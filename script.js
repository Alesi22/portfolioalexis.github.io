document.addEventListener('DOMContentLoaded', () => {

    // 1. Menú Móvil (Toggle)
    const menuBtn = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace (mobile)
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // 2. Acordeón para expandir Casos de Estudio en Cards
    const toggleButtons = document.querySelectorAll('.toggle-btn');

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.card');
            const details = card.querySelector('.card-details');
            
            // Alterna la clase open para animar altura y opacidad por CSS
            details.classList.toggle('open');
            
            // Cambiar texto dinámicamente
            if (details.classList.contains('open')) {
                this.textContent = 'Ocultar detalles';
            } else {
                this.textContent = 'Ver caso de estudio';
            }
        });
    });

    // 3. Intersect Observer para animaciones "fade-in" al hacer scroll
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Agrega la clase que desencadena la animación CSS
                entry.target.classList.add('visible');
                // Deja de observar para que la animación suceda solo una vez
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Se activa cuando el 10% del elemento es visible en pantalla
    });

    fadeElements.forEach(el => {
        observer.observe(el);
    });

});
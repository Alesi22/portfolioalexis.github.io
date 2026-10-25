document.addEventListener('DOMContentLoaded', () => {

    // 1. Lógica del Tema 
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn.querySelector('.theme-icon-img');
    
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.src = 'img/luna.png'; 
    } else {
        themeIcon.src = 'img/sol.png'; 
    }

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

    // 4. Intersect Observer para animaciones fluidas
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

// 5. Lógica del Slider de Imágenes (Función Global para el onclick)
window.moveSlide = function(n, button) {
    // Busca el contenedor específico de este slider (por si hay más de uno)
    const container = button.closest('.slider-container');
    const slides = container.querySelectorAll('.slide');
    
    // Encuentra qué imagen está activa ahora mismo
    let currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
    
    // Oculta la actual
    slides[currentIndex].classList.remove('active');
    
    // Calcula el nuevo índice
    currentIndex += n;
    
    // Logica de ciclo infinito
    if (currentIndex >= slides.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = slides.length - 1;
    }
    
    // Muestra la nueva
    slides[currentIndex].classList.add('active');
};
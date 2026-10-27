document.addEventListener('DOMContentLoaded', () => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = motionQuery.matches && !document.documentElement.classList.contains('force-motion');
    const desktop = window.matchMedia('(min-width: 860px)');

    const root = document.documentElement;
    const themeToggle = document.querySelector('.theme-toggle');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const schemeMeta = document.querySelector('meta[name="color-scheme"]');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    let pinnedTheme = false;

    try {
        const savedTheme = localStorage.getItem('theme');
        pinnedTheme = savedTheme === 'light' || savedTheme === 'dark';
    } catch (error) {}

    const applyTheme = (theme, persist) => {
        const dark = theme === 'dark';

        root.setAttribute('data-theme', theme);

        if (themeMeta) {
            themeMeta.setAttribute('content', dark ? '#15101B' : '#E7E5DE');
        }

        if (schemeMeta && (persist || pinnedTheme)) {
            schemeMeta.setAttribute('content', dark ? 'dark' : 'light');
        }

        if (themeToggle) {
            themeToggle.setAttribute('aria-label', dark ? 'Cambiar a modo día' : 'Cambiar a modo noche');
        }

        if (persist) {
            pinnedTheme = true;

            try {
                localStorage.setItem('theme', theme);
            } catch (error) {}
        }
    };

    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
        });
    }

    if (!pinnedTheme) {
        systemTheme.addEventListener('change', event => {
            if (pinnedTheme) return;
            applyTheme(event.matches ? 'dark' : 'light', false);
        });
    }

    document.querySelectorAll('[data-coverflow] img').forEach(img => {
        img.loading = 'eager';
    });

    const nav = document.getElementById('nav');
    const navBtn = document.querySelector('.navbtn');
    const navLinks = nav.querySelectorAll('a');
    const topbar = document.querySelector('.topbar');
    const motionToggle = document.querySelector('.motion-toggle');

    if (motionToggle && motionQuery.matches && !document.documentElement.classList.contains('force-motion')) {
        motionToggle.hidden = false;

        motionToggle.addEventListener('click', () => {
            document.documentElement.classList.add('force-motion');
            reduceMotion = false;
            motionToggle.hidden = true;

            try {
                localStorage.setItem('motion', 'on');
            } catch (error) {}
        });
    }

    const closeNav = () => {
        document.body.classList.remove('nav-open');
        navBtn.setAttribute('aria-expanded', 'false');
        navBtn.setAttribute('aria-label', 'Abrir menú');
    };

    navBtn.addEventListener('click', () => {
        const open = document.body.classList.toggle('nav-open');
        navBtn.setAttribute('aria-expanded', String(open));
        navBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        if (open) navLinks[0].focus();
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
            closeNav();
            navBtn.focus();
        }
    });

    desktop.addEventListener('change', event => {
        if (event.matches) closeNav();
    });

    let scrollFrame = null;

    const cancelScroll = () => {
        if (scrollFrame) {
            cancelAnimationFrame(scrollFrame);
            scrollFrame = null;
        }
    };

    const easeInOut = t => -(Math.cos(Math.PI * t) - 1) / 2;

    const scrollToTarget = target => {
        cancelScroll();

        const offset = (topbar ? topbar.offsetHeight : 70) + 16;
        const startY = window.scrollY;
        const targetY = Math.max(0, target.getBoundingClientRect().top + startY - offset);
        const distance = targetY - startY;

        if (reduceMotion || Math.abs(distance) < 2) {
            window.scrollTo(0, targetY);
            return;
        }

        const duration = Math.min(1200, Math.max(450, Math.abs(distance) * 0.3));
        let startTime = null;

        const step = now => {
            if (startTime === null) startTime = now;
            const progress = Math.min(1, (now - startTime) / duration);
            window.scrollTo(0, startY + distance * easeInOut(progress));

            if (progress < 1) {
                scrollFrame = requestAnimationFrame(step);
            } else {
                scrollFrame = null;
            }
        };

        scrollFrame = requestAnimationFrame(step);
    };

    window.addEventListener('wheel', cancelScroll, { passive: true });
    window.addEventListener('touchstart', cancelScroll, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        if (link.classList.contains('skip')) return;

        link.addEventListener('click', event => {
            const hash = link.getAttribute('href');
            if (!hash || hash === '#') return;

            const target = document.querySelector(hash);
            if (!target) return;

            event.preventDefault();
            closeNav();

            try {
                history.pushState(null, '', window.location.pathname + window.location.search + hash);
            } catch (error) {}

            scrollToTarget(target);
        });
    });

    window.addEventListener('popstate', () => {
        const target = location.hash.length > 1 ? document.querySelector(location.hash) : null;

        if (target) {
            scrollToTarget(target);
        } else {
            window.scrollTo(0, 0);
        }
    });

    const revealItems = document.querySelectorAll('[data-reveal]');

    if ('IntersectionObserver' in window && !reduceMotion) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -8% 0px',
            threshold: 0.1
        });

        revealItems.forEach(item => observer.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add('is-in'));
    }

    document.querySelectorAll('[data-coverflow]').forEach(coverflow => {
        const stage = coverflow.querySelector('.coverflow__stage');
        const slides = Array.from(coverflow.querySelectorAll('.cover-slide'));
        const count = coverflow.querySelector('[data-count]');
        const caption = coverflow.querySelector('[data-caption]');
        const progress = coverflow.querySelector('[data-progress]');
        const buttons = coverflow.querySelectorAll('[data-dir]');

        if (!stage || !slides.length) return;

        const total = slides.length;
        const mod = value => ((value % total) + total) % total;
        let active = Math.max(0, slides.findIndex(slide => slide.dataset.state === 'active'));

        const render = () => {
            slides.forEach((slide, index) => {
                let state = 'far';

                if (index === active) {
                    state = 'active';
                } else if (index === mod(active - 1)) {
                    state = 'prev';
                } else if (index === mod(active + 1)) {
                    state = 'next';
                }

                slide.dataset.state = state;
                slide.setAttribute('aria-hidden', state === 'active' ? 'false' : 'true');
            });

            count.textContent = String(active + 1).padStart(2, '0');
            caption.textContent = slides[active].dataset.label || '';

            if (progress) {
                progress.style.transform = `scaleX(${((active + 1) / total).toFixed(4)})`;
            }
        };

        const go = direction => {
            active = mod(active + direction);
            render();
        };

        buttons.forEach(button => {
            button.addEventListener('click', () => go(Number(button.dataset.dir)));
        });

        stage.addEventListener('keydown', event => {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                go(1);
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                go(-1);
            } else if (event.key === 'Home') {
                event.preventDefault();
                active = 0;
                render();
            } else if (event.key === 'End') {
                event.preventDefault();
                active = total - 1;
                render();
            }
        });

        let startX = null;
        let downTarget = null;
        let moved = false;

        stage.addEventListener('pointerdown', event => {
            if (event.pointerType === 'mouse' && event.button !== 0) return;

            startX = event.clientX;
            downTarget = event.target;
            moved = false;
            stage.classList.add('is-dragging');
            stage.setPointerCapture(event.pointerId);
        });

        stage.addEventListener('pointermove', event => {
            if (startX === null) return;
            if (Math.abs(event.clientX - startX) > 8) moved = true;
        });

        const endDrag = event => {
            if (startX === null) return;

            const delta = event.clientX - startX;
            startX = null;
            moved = Math.abs(delta) > 8;
            stage.classList.remove('is-dragging');

            if (stage.hasPointerCapture(event.pointerId)) {
                stage.releasePointerCapture(event.pointerId);
            }

            if (Math.abs(delta) > 45) {
                go(delta < 0 ? 1 : -1);
                return;
            }

            if (!moved) {
                const slide = downTarget && downTarget.closest('.cover-slide');
                if (!slide) return;

                if (slide.dataset.state === 'prev') {
                    go(-1);
                } else if (slide.dataset.state === 'next') {
                    go(1);
                }
            }
        };

        stage.addEventListener('pointerup', endDrag);
        stage.addEventListener('pointercancel', () => {
            startX = null;
            stage.classList.remove('is-dragging');
        });

        render();
    });
});

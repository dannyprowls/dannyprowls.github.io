// main.js ✨
// Autor: Danny Prowls | Refactorizado por IA
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // === NAV MOBILE ===
    function toggleNav() {
        const isActive = navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isActive);
        navToggle.setAttribute('aria-label', isActive ? 'Cerrar menú' : 'Abrir menú');
        document.body.classList.toggle('no-scroll', isActive);
    }

    navToggle.setAttribute('aria-label', 'Abrir menú');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', 'nav');

    navToggle.addEventListener('click', toggleNav);

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const offset = document.querySelector('.header').offsetHeight;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        });
    });

    // === SCROLL HEADER ===
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 100);
    });

    // === HERO SCROLL ===
    document.querySelector('.hero-scroll')?.addEventListener('click', () => {
        const about = document.querySelector('#sobre-mi');
        if (about) {
            const offset = document.querySelector('.header').offsetHeight;
            window.scrollTo({ top: about.offsetTop - offset, behavior: 'smooth' });
        }
    });

    // === ANIMACIONES CON INTERSECTION OBSERVER ===
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.book-card, .blog-card, .about-content, .contact-content')
        .forEach(el => observer.observe(el));

    // === FORMULARIO DE CONTACTO ===
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const data = new FormData(contactForm);
            const email = data.get('email');
            if (!data.get('name') || !email || !data.get('subject') || !data.get('message')) {
                showNotification('Por favor, completa todos los campos.', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showNotification('Por favor, ingresa un email válido.', 'error');
                return;
            }
            showNotification('¡Mensaje enviado correctamente! Te responderé pronto.', 'success');
            contactForm.reset();
        });
    }

    // === NOTIFICACIONES ===
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = \`notification notification-\${type}\`;
        notification.textContent = message;
        notification.style.cssText = \`
            position: fixed; top: 20px; right: 20px;
            padding: 15px 20px; border-radius: 8px;
            color: white; font-weight: 600;
            z-index: 10000; max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        \`;
        notification.style.backgroundColor = type === 'success' ? '#27ae60' : '#e74c3c';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = 'margin-left:10px;background:none;border:none;color:white;font-size:1.2rem;cursor:pointer;';
        closeBtn.addEventListener('click', () => notification.remove());
        notification.appendChild(closeBtn);

        document.body.appendChild(notification);
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // === PARALLAX HERO ===
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = \`translateY(\${scrolled * 0.4}px)\`;
            hero.style.opacity = 1 - scrolled / hero.offsetHeight;
        }
    });

    // === LAZY LOAD ===
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imgObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src && !img.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imgObserver.unobserve(img);
                    }
                }
            });
        });
        lazyImages.forEach(img => imgObserver.observe(img));
    }

    // === MODO OSCURO MANUAL ===
    const themeToggle = document.querySelector('#dark-mode-toggle');
    const htmlEl = document.documentElement;
    if (localStorage.getItem('theme') === 'dark') {
        htmlEl.classList.add('dark');
    }
    themeToggle?.addEventListener('click', () => {
        htmlEl.classList.toggle('dark');
        localStorage.setItem('theme', htmlEl.classList.contains('dark') ? 'dark' : 'light');
    });

    // === PREFERENCIA DE MOTION REDUCIDO ===
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const style = document.createElement('style');
        style.innerHTML = '* { transition: none !important; animation: none !important; }';
        document.head.appendChild(style);
    }

    // === RESPONSIVE: AUTO CIERRE DE MENÚ EN RESIZE ===
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    console.log('✨ Sitio web cargado y listo.');
});
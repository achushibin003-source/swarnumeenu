document.addEventListener('DOMContentLoaded', () => {
    // 1. KATHAKALI CURTAIN RAISER
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);

    // 2. NAVIGATION OVERLAY
    const menuBtn = document.getElementById('hamburger-btn');
    const navOverlay = document.getElementById('nav-overlay');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-links a');

    const toggleNav = () => {
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', toggleNav);
    navClose.addEventListener('click', toggleNav);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            toggleNav();
            // Smooth scroll handled by CSS/Browser default for simple href anchors
        });
    });

    // 3. LAZY LOADING & FADE-IN ANIMATIONS
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once visible, stop observing
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-lazy]').forEach(el => {
        observer.observe(el);
    });

    // 4. PARALLAX SCROLLING FOR MURAL BORDERS
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(el => {
            const speed = 0.2;
            const yPos = -(scrolled * speed);
            // We apply it to the mural frame specifically if needed, 
            // or just subtle shift to the whole section
            const frame = el.querySelector('.mural-frame');
            if (frame) {
                frame.style.transform = `translateY(${yPos % 100}px)`;
            }
        });
    });

    // 5. MASONRY FILTERING (Optional enhancement)
    const filters = document.querySelectorAll('.g-fil');
    const items = document.querySelectorAll('.m-item');

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            const cat = filter.getAttribute('data-filter');

            items.forEach(item => {
                if (cat === 'all' || item.getAttribute('data-cat') === cat) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 500);
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. KATHAKALI CURTAIN RAISER
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);

    // 3. LAZY LOADING & FADE-IN ANIMATIONS
    const observerOptions = {
        threshold: 0,
        rootMargin: '300px' // Load photos well before they scroll into view
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

    // 4. PARALLAX SCROLLING FOR    // Parallax Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('[data-parallax]').forEach(el => {
            const speed = 0.4;
            el.style.backgroundPositionY = -(scrolled * speed) + 'px';
        });
    });

    // LIGHTBOX LOGIC
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    // Function to open lightbox
    const openLightbox = (src) => {
        lightboxImg.src = src;
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('active'), 10);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 400);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Attach to all gallery and family images
    document.addEventListener('click', (e) => {
        // For background-image thumbnails
        const mImg = e.target.closest('.m-img');
        if (mImg) {
            const style = window.getComputedStyle(mImg);
            const url = style.backgroundImage.slice(5, -2).replace(/"/g, "");
            openLightbox(url);
            return;
        }

        // For direct <img> tags (like in the Family section)
        if (e.target.tagName === 'IMG' && (e.target.closest('.f-full-item') || e.target.closest('.hero-bg-container'))) {
            openLightbox(e.target.src);
        }
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

    // 6. FALLING PETALS EFFECT
    const petalContainer = document.getElementById('petal-container');
    if (petalContainer) {
        const petalCount = 30;
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            
            const size = Math.random() * 15 + 10 + 'px';
            petal.style.width = size;
            petal.style.height = size;
            petal.style.left = Math.random() * 100 + 'vw';
            
            // Randomize animation properties
            const duration = Math.random() * 7 + 5;
            const delay = Math.random() * 10;
            
            petal.style.animation = `petal-fall ${duration}s linear ${delay}s infinite`;
            
            // Random initial rotation
            petal.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            petalContainer.appendChild(petal);
        }
    }

    // 7. PRIVATE PHOTOS MODAL
    const privateBtn = document.getElementById('private-photos-btn');
    const privateModal = document.getElementById('private-modal');
    const privateClose = document.getElementById('private-close');
    const privateSubmit = document.getElementById('private-submit');
    const privatePass = document.getElementById('private-pass');
    const privateError = document.getElementById('private-error');

    if (privateBtn) {
        privateBtn.addEventListener('click', () => {
            privateModal.style.display = 'flex';
            setTimeout(() => privateModal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
        });

        const closePrivate = () => {
            privateModal.classList.remove('active');
            setTimeout(() => {
                privateModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                privateError.style.opacity = '0';
                privatePass.value = '';
            }, 400);
        };

        privateClose.addEventListener('click', closePrivate);
        privateModal.addEventListener('click', (e) => {
            if (e.target === privateModal) closePrivate();
        });

        privateSubmit.addEventListener('click', () => {
            // Simple placeholder logic
            if (privatePass.value === '2025') {
                alert('Access Granted. This section is under construction.');
                closePrivate();
            } else {
                privateError.style.opacity = '1';
                privatePass.style.borderColor = '#D01C1F';
                setTimeout(() => {
                    privatePass.style.borderColor = 'rgba(255,255,255,0.05)';
                }, 2000);
            }
        });
    }
});

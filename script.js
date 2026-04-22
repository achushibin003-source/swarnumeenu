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
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const lightboxNav = document.querySelector('.lightbox-nav');

    let currentImages = [];
    let currentIndex = 0;

    // Function to open lightbox
    const openLightbox = (src, imagesList) => {
        currentImages = imagesList || [src];
        currentIndex = currentImages.indexOf(src);
        if (currentIndex === -1) currentIndex = 0;

        lightboxImg.src = src;
        lightbox.style.display = 'flex';
        
        // Show/Hide navigation
        if (currentImages.length > 1) {
            lightboxNav.style.display = 'flex';
        } else {
            lightboxNav.style.display = 'none';
        }

        setTimeout(() => lightbox.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    };

    const showNext = (e) => {
        if (e) e.stopPropagation();
        currentIndex = (currentIndex + 1) % currentImages.length;
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = currentImages[currentIndex];
            lightboxImg.style.opacity = '1';
        }, 200);
    };

    const showPrev = (e) => {
        if (e) e.stopPropagation();
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = currentImages[currentIndex];
            lightboxImg.style.opacity = '1';
        }, 200);
    };

    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);

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

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'Escape') closeLightbox();
    });

    // Attach to all gallery and family images
    document.addEventListener('click', (e) => {
        // For background-image thumbnails (Masonry Gallery)
        const mImg = e.target.closest('.m-img');
        if (mImg) {
            const allVisibleItems = Array.from(document.querySelectorAll('.m-item'))
                .filter(item => item.style.display !== 'none');
            
            const allVisibleUrls = allVisibleItems.map(item => {
                const img = item.querySelector('.m-img');
                const style = window.getComputedStyle(img);
                return style.backgroundImage.slice(5, -2).replace(/"/g, "");
            });

            const style = window.getComputedStyle(mImg);
            const url = style.backgroundImage.slice(5, -2).replace(/"/g, "");
            openLightbox(url, allVisibleUrls);
            return;
        }

        // For direct <img> tags (Family section)
        const familyImg = e.target.closest('.f-full-item img');
        if (familyImg) {
            const allFamilyUrls = Array.from(document.querySelectorAll('.f-full-item img')).map(img => img.src);
            openLightbox(familyImg.src, allFamilyUrls);
            return;
        }

        // Hero image
        if (e.target.tagName === 'IMG' && e.target.closest('.hero-bg-container')) {
            openLightbox(e.target.src, [e.target.src]);
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

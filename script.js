document.addEventListener('DOMContentLoaded', () => {
    // 1. INTRO SEQUENCE
    const introOverlay = document.getElementById('intro-overlay');
    
    window.addEventListener('load', () => {
        // Minimum display time for intro (3 seconds)
        setTimeout(() => {
            document.body.classList.add('loaded');
            // Remove overlay from DOM after animation finishes to save resources
            setTimeout(() => {
                if (introOverlay) introOverlay.style.display = 'none';
            }, 1500); 
        }, 3000);
    });



    // 2. LAYERED PETAL EFFECT
    const petalBgContainer = document.getElementById('petal-bg');
    const petalFgContainer = document.getElementById('petal-fg');

    if (petalBgContainer && petalFgContainer) {
        // Background petals (Small, slow)
        for (let i = 0; i < 20; i++) {
            createPetal(petalBgContainer, 'bg');
        }
        // Foreground petals (Large, fast)
        for (let i = 0; i < 8; i++) {
            createPetal(petalFgContainer, 'fg');
        }
    }

    function createPetal(container, layer) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        // Base size based on layer
        const baseSize = layer === 'fg' ? 40 : 12;
        const size = Math.random() * baseSize + baseSize;
        petal.style.width = `${size}px`;
        petal.style.height = `${size * 1.2}px`;
        
        resetPetal(petal, layer);
        container.appendChild(petal);
        
        petal.addEventListener('animationiteration', () => {
            resetPetal(petal, layer);
        });
    }

    function resetPetal(petal, layer) {
        const left = Math.random() * 100;
        // Speed based on layer
        const duration = layer === 'fg' ? (Math.random() * 4 + 4) : (Math.random() * 8 + 10);
        const delay = Math.random() * 5;
        
        const drift1 = (Math.random() - 0.5) * 150;
        const drift2 = (Math.random() - 0.5) * 200;
        const drift3 = (Math.random() - 0.5) * 300;
        
        petal.style.setProperty('--drift-1', `${drift1}px`);
        petal.style.setProperty('--drift-2', `${drift2}px`);
        petal.style.setProperty('--drift-3', `${drift3}px`);
        
        petal.style.left = `${left}%`;
        petal.style.animation = `petal-fall ${duration}s ease-in-out ${delay}s infinite`;
        petal.style.opacity = layer === 'fg' ? (Math.random() * 0.4 + 0.6) : (Math.random() * 0.3 + 0.2);
    }
    const lazyElements = document.querySelectorAll('[data-lazy]');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                lazyObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    lazyElements.forEach(el => lazyObserver.observe(el));

    // 4. GALLERY FILTERING
    const filterBtns = document.querySelectorAll('.g-fil');
    const masonryItems = document.querySelectorAll('.m-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter items
            masonryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-cat') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 400);
                }
            });
        });
    });

    // 5. LIGHTBOX
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    let currentImgIndex = 0;
    let visibleImages = [];

    function updateVisibleImages() {
        visibleImages = Array.from(document.querySelectorAll('.m-item'))
            .filter(item => item.style.display !== 'none')
            .map(item => {
                const bgImg = item.querySelector('.m-img').style.backgroundImage;
                return bgImg.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
            });
    }

    masonryItems.forEach(item => {
        item.addEventListener('click', () => {
            updateVisibleImages();
            const bgImg = item.querySelector('.m-img').style.backgroundImage;
            const imgSrc = bgImg.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
            currentImgIndex = visibleImages.indexOf(imgSrc);
            
            lightboxImg.src = imgSrc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImgIndex = (currentImgIndex - 1 + visibleImages.length) % visibleImages.length;
        lightboxImg.src = visibleImages[currentImgIndex];
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImgIndex = (currentImgIndex + 1) % visibleImages.length;
        lightboxImg.src = visibleImages[currentImgIndex];
    });

    // 6. PRIVATE ACCESS
    const privateBtn = document.getElementById('private-photos-btn');
    const privateModal = document.getElementById('private-modal');
    const privateClose = document.getElementById('private-close');
    const privatePass = document.getElementById('private-pass');
    const privateSubmit = document.getElementById('private-submit');
    const privateError = document.getElementById('private-error');

    if (privateBtn) {
        privateBtn.addEventListener('click', () => {
            privateModal.classList.add('active');
        });
    }

    if (privateClose) {
        privateClose.addEventListener('click', () => {
            privateModal.classList.remove('active');
        });
    }

    if (privateSubmit) {
        privateSubmit.addEventListener('click', () => {
            if (privatePass.value === '2708') { // Example code
                window.location.href = 'all_images.txt'; // Or a dedicated page
            } else {
                privateError.style.opacity = '1';
                setTimeout(() => privateError.style.opacity = '0', 3000);
            }
        });
    }
});
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



    // 2. BLOOMING JASMINE EFFECT
    const jasmineContainer = document.getElementById('jasmine-container');

    if (jasmineContainer) {
        const jasmineCount = 15;
        for (let i = 0; i < jasmineCount; i++) {
            createJasmine();
        }
    }

    function createJasmine() {
        const j = document.createElement('div');
        j.className = 'jasmine-flower';
        
        const size = Math.random() * 10 + 10;
        j.style.width = `${size}px`;
        j.style.height = `${size}px`;
        
        resetJasmine(j);
        jasmineContainer.appendChild(j);
        
        j.addEventListener('animationiteration', () => {
            resetJasmine(j);
        });
    }

    function resetJasmine(j) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 15 + 15;
        const delay = Math.random() * 10;
        
        const dx = (Math.random() - 0.5) * 300;
        const dy = (Math.random() - 0.5) * 300;
        
        j.style.left = `${x}%`;
        j.style.top = `${y}%`;
        j.style.setProperty('--x', `${dx}px`);
        j.style.setProperty('--y', `${dy}px`);
        j.style.animation = `float-jasmine ${duration}s ease-in-out ${delay}s infinite`;
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
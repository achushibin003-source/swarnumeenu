document.addEventListener('DOMContentLoaded', () => {
    // 1. INTRO SEQUENCE
    const introOverlay = document.getElementById('intro-overlay');
    
    // Hide intro after a minimum of 3 seconds, without waiting for massive image payloads
    setTimeout(() => {
        document.body.classList.add('loaded');
        setTimeout(() => {
            if (introOverlay) introOverlay.style.display = 'none';
        }, 1500); 
    }, 3000);



    // 2. 3D GOLDEN PARTICLES (Classical Smooth Animation)
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 100;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.z = Math.random() * 1000; // 3D Depth
                this.size = Math.random() * 2 + 0.5;
                this.speedZ = -Math.random() * 1.5 - 0.5; // Moving towards viewer
                this.opacity = 0;
            }

            update() {
                this.z += this.speedZ;
                if (this.z <= 0) this.reset();
                
                // 3D Projection
                const scale = 500 / (500 + this.z);
                this.screenX = (this.x - canvas.width / 2) * scale + canvas.width / 2;
                this.screenY = (this.y - canvas.height / 2) * scale + canvas.height / 2;
                this.renderSize = this.size * scale;
                
                if (this.z < 800) {
                    this.opacity = Math.min(1, (800 - this.z) / 400);
                } else {
                    this.opacity = 0;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.screenX, this.screenY, this.renderSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity * 0.6})`;
                ctx.fill();
                // Add glow
                if (this.renderSize > 1) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#D4AF37';
                } else {
                    ctx.shadowBlur = 0;
                }
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // 3. MOUSE PARALLAX (3D Perspective)
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 40;
            const y = (window.innerHeight / 2 - e.pageY) / 40;
            heroContent.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(50px)`;
        });
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
                
                // Actual lazy loading of image
                const imgNode = entry.target.querySelector('img') || entry.target.querySelector('.m-img');
                if (imgNode) {
                    if (imgNode.hasAttribute('data-bg')) {
                        imgNode.style.backgroundImage = imgNode.getAttribute('data-bg');
                        imgNode.removeAttribute('data-bg');
                    }
                    if (imgNode.tagName.toLowerCase() === 'img' && imgNode.hasAttribute('data-src')) {
                        imgNode.src = imgNode.getAttribute('data-src');
                        imgNode.removeAttribute('data-src');
                    }
                }

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
                const imgNode = item.querySelector('.m-img');
                const bgImg = imgNode.style.backgroundImage || imgNode.getAttribute('data-bg');
                return bgImg ? bgImg.replace(/url\(['"]?(.*?)['"]?\)/i, '$1') : '';
            });
    }

    masonryItems.forEach(item => {
        item.addEventListener('click', () => {
            updateVisibleImages();
            const imgNode = item.querySelector('.m-img');
            const bgImg = imgNode.style.backgroundImage || imgNode.getAttribute('data-bg');
            const imgSrc = bgImg ? bgImg.replace(/url\(['"]?(.*?)['"]?\)/i, '$1') : '';
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
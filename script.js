document.addEventListener('DOMContentLoaded', () => {

    // 1. INTRO SEQUENCE
    const introOverlay = document.getElementById('intro-overlay');
    let introDismissed = false;

    function dismissIntro() {
        if (introDismissed) return;
        introDismissed = true;
        document.body.classList.add('loaded');
        if (introOverlay) {
            introOverlay.style.opacity = '0';
            introOverlay.style.pointerEvents = 'none';
            setTimeout(() => {
                introOverlay.style.display = 'none';
            }, 900);
        }
    }

    // Auto dismiss after 2 seconds
    setTimeout(dismissIntro, 2000);

    // Quick skip on user interaction
    if (introOverlay) {
        introOverlay.addEventListener('click', dismissIntro);
    }
    window.addEventListener('keydown', dismissIntro, { once: true });
    window.addEventListener('touchstart', dismissIntro, { once: true });
    window.addEventListener('wheel', dismissIntro, { once: true });

    // 2. 3D GOLDEN PARTICLES
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const particleCount = 100;
        let particles = [];

        function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        window.addEventListener('resize', resize); resize();

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.z = Math.random() * 1000;
                this.size = Math.random() * 2 + 0.5;
                this.speedZ = -Math.random() * 1.5 - 0.5;
                this.opacity = 0;
            }
            update() {
                this.z += this.speedZ;
                if (this.z <= 0) this.reset();
                const scale = 500 / (500 + this.z);
                this.screenX = (this.x - canvas.width / 2) * scale + canvas.width / 2;
                this.screenY = (this.y - canvas.height / 2) * scale + canvas.height / 2;
                this.renderSize = this.size * scale;
                this.opacity = this.z < 800 ? Math.min(1, (800 - this.z) / 400) : 0;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.screenX, this.screenY, this.renderSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212,175,55,${this.opacity * 0.6})`;
                ctx.fill();
                ctx.shadowBlur = this.renderSize > 1 ? 10 : 0;
                ctx.shadowColor = '#D4AF37';
            }
        }

        for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // 3. MOUSE PARALLAX
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 40;
            const y = (window.innerHeight / 2 - e.pageY) / 40;
            heroContent.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(50px)`;
        });
    }

    // Lazy loading for family/solitude sections
    const lazyElements = document.querySelectorAll('[data-lazy]');
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const imgNode = entry.target.querySelector('img') || entry.target.querySelector('.m-img');
                if (imgNode) {
                    if (imgNode.hasAttribute('data-bg')) {
                        imgNode.style.backgroundImage = imgNode.getAttribute('data-bg');
                        imgNode.removeAttribute('data-bg');
                    }
                }
                lazyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    lazyElements.forEach(el => lazyObserver.observe(el));


    // ============================================================
    // 4. PHOTO GALLERY GRID (NORMAL GRID VIEW)
    // ============================================================
    const masonryData = document.getElementById('masonry');
    let galleryImages = [];

    if (masonryData) {
        const items = masonryData.querySelectorAll('.m-item');
        items.forEach((item, i) => {
            const imgNode = item.querySelector('.m-img');
            let src = '';
            if (imgNode) {
                const bg = imgNode.getAttribute('data-bg') || imgNode.style.backgroundImage;
                if (bg) {
                    const m = bg.match(/url\(['"]?(.*?)['"]?\)/i);
                    if (m && m[1]) src = m[1];
                }
            }
            if (src) galleryImages.push(src);

            // Add action overlay (Download HD & Expand)
            const actions = document.createElement('div');
            actions.className = 'm-card-actions';
            actions.innerHTML = `
                <button type="button" class="card-act-btn card-act-download" title="Download Full Quality HD Photo">⬇ Download HD</button>
                <button type="button" class="card-act-btn card-act-expand" title="Expand Photo">⤢ Expand</button>
            `;
            item.appendChild(actions);

            actions.querySelector('.card-act-download').addEventListener('click', (e) => {
                e.stopPropagation();
                if (src) downloadOriginalPhoto(src, e.currentTarget);
            });
            actions.querySelector('.card-act-expand').addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(galleryImages, i);
            });

            item.addEventListener('click', (e) => {
                if (e.target.closest('.card-act-btn')) return;
                e.stopPropagation();
                openLightbox(galleryImages, i);
            });
        });
    }

    // ============================================================
    // 5. LIGHTBOX & ORIGINAL QUALITY DOWNLOAD
    // ============================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxDownload = document.getElementById('lightbox-download');
    const lightboxDownloadBottom = document.getElementById('lightbox-download-bottom');
    const lightboxPrevArrow = document.getElementById('lightbox-prev');
    const lightboxNextArrow = document.getElementById('lightbox-next');
    const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
    const lightboxNextBtn = document.getElementById('lightbox-next-btn');

    let activeGalleryList = [];
    let currentLightboxIdx = 0;

    function openLightbox(list, idx) {
        if (!list || list.length === 0) return;
        activeGalleryList = list;
        currentLightboxIdx = Math.max(0, Math.min(idx, list.length - 1));
        updateLightboxView();
        if (lightbox) {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function updateLightboxView() {
        if (!activeGalleryList.length) return;
        const currentSrc = activeGalleryList[currentLightboxIdx];
        if (lightboxImg) {
            lightboxImg.style.opacity = '0.4';
            lightboxImg.src = currentSrc;
            lightboxImg.onload = () => {
                lightboxImg.style.opacity = '1';
            };
            lightboxImg.onerror = () => {
                lightboxImg.style.opacity = '1';
            };
        }
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentLightboxIdx + 1} / ${activeGalleryList.length}`;
        }
        const hasPrev = currentLightboxIdx > 0;
        const hasNext = currentLightboxIdx < activeGalleryList.length - 1;
        if (lightboxPrevArrow) lightboxPrevArrow.style.visibility = hasPrev ? 'visible' : 'hidden';
        if (lightboxNextArrow) lightboxNextArrow.style.visibility = hasNext ? 'visible' : 'hidden';
        if (lightboxPrevBtn) lightboxPrevBtn.disabled = !hasPrev;
        if (lightboxNextBtn) lightboxNextBtn.disabled = !hasNext;
    }

    function lightboxPrev() {
        if (currentLightboxIdx > 0) {
            currentLightboxIdx--;
            updateLightboxView();
        }
    }

    function lightboxNext() {
        if (currentLightboxIdx < activeGalleryList.length - 1) {
            currentLightboxIdx++;
            updateLightboxView();
        }
    }

    async function downloadOriginalPhoto(url, triggerBtn) {
        if (!url) return;
        const btns = [triggerBtn, lightboxDownload, lightboxDownloadBottom].filter(Boolean);
        btns.forEach(btn => {
            btn.classList.add('downloading');
            const span = btn.querySelector('span') || btn;
            btn.dataset.origText = span.textContent;
            span.textContent = 'Downloading...';
        });

        const filename = url.split('/').pop().split('?')[0] || 'photo.jpg';

        try {
            // Direct binary fetch ensures original uncompressed photo with full EXIF/resolution
            const res = await fetch(url);
            if (!res.ok) throw new Error('Fetch failed');
            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 3000);

            btns.forEach(btn => {
                btn.classList.remove('downloading');
                const span = btn.querySelector('span') || btn;
                span.textContent = '✓ Downloaded!';
                setTimeout(() => {
                    span.textContent = btn.dataset.origText || 'Download HD';
                }, 2000);
            });
        } catch (err) {
            // Direct link fallback
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            btns.forEach(btn => {
                btn.classList.remove('downloading');
                const span = btn.querySelector('span') || btn;
                span.textContent = btn.dataset.origText || 'Download HD';
            });
        }
    }

    async function downloadCurrentImage() {
        if (!activeGalleryList.length) return;
        const url = activeGalleryList[currentLightboxIdx];
        if (url) downloadOriginalPhoto(url, lightboxDownload);
    }

    // Attach click listeners & action overlays to all Family photos
    const familyImgs = Array.from(document.querySelectorAll('#family .family-full-grid img')).map(img => img.getAttribute('src'));
    document.querySelectorAll('#family .family-full-grid .f-full-item').forEach((item, i) => {
        const img = item.querySelector('img');
        if (img) {
            const actions = document.createElement('div');
            actions.className = 'f-card-actions';
            actions.innerHTML = `
                <button type="button" class="card-act-btn card-act-download" title="Download Full Quality HD">⬇ Download HD</button>
                <button type="button" class="card-act-btn card-act-expand" title="Expand Photo">⤢ Expand</button>
            `;
            item.appendChild(actions);

            actions.querySelector('.card-act-download').addEventListener('click', (e) => {
                e.stopPropagation();
                downloadOriginalPhoto(img.getAttribute('src'), e.currentTarget);
            });
            actions.querySelector('.card-act-expand').addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(familyImgs, i);
            });
        }
        item.addEventListener('click', (e) => {
            if (e.target.closest('.card-act-btn')) return;
            e.stopPropagation();
            openLightbox(familyImgs, i);
        });
    });

    // Attach click listeners & action overlays to all Solitude photos
    const solitudeImgs = Array.from(document.querySelectorAll('#solitude .family-full-grid img')).map(img => img.getAttribute('src'));
    document.querySelectorAll('#solitude .family-full-grid .f-full-item').forEach((item, i) => {
        const img = item.querySelector('img');
        if (img) {
            const actions = document.createElement('div');
            actions.className = 'f-card-actions';
            actions.innerHTML = `
                <button type="button" class="card-act-btn card-act-download" title="Download Full Quality HD">⬇ Download HD</button>
                <button type="button" class="card-act-btn card-act-expand" title="Expand Photo">⤢ Expand</button>
            `;
            item.appendChild(actions);

            actions.querySelector('.card-act-download').addEventListener('click', (e) => {
                e.stopPropagation();
                downloadOriginalPhoto(img.getAttribute('src'), e.currentTarget);
            });
            actions.querySelector('.card-act-expand').addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(solitudeImgs, i);
            });
        }
        item.addEventListener('click', (e) => {
            if (e.target.closest('.card-act-btn')) return;
            e.stopPropagation();
            openLightbox(solitudeImgs, i);
        });
    });

    // Lightbox Controls
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxDownload) lightboxDownload.addEventListener('click', downloadCurrentImage);
    if (lightboxDownloadBottom) lightboxDownloadBottom.addEventListener('click', downloadCurrentImage);
    if (lightboxPrevArrow) lightboxPrevArrow.addEventListener('click', (e) => { e.stopPropagation(); lightboxPrev(); });
    if (lightboxNextArrow) lightboxNextArrow.addEventListener('click', (e) => { e.stopPropagation(); lightboxNext(); });
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); lightboxPrev(); });
    if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', (e) => { e.stopPropagation(); lightboxNext(); });

    // Close on click outside image
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content') || e.target.classList.contains('lightbox-img-container')) {
                closeLightbox();
            }
        });
    }

    // Global Keydown handler
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                lightboxPrev();
            } else if (e.key === 'ArrowRight') {
                lightboxNext();
            } else if (e.key.toLowerCase() === 'd') {
                downloadCurrentImage();
            }
        }
    });

});

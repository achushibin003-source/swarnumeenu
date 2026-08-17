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
    // 4. VINTAGE PHOTO ALBUM — REALISTIC CSS 3D PAGE FLIP
    // ============================================================

    const masonryData = document.getElementById('masonry');
    const bookContainer = document.getElementById('book-container');
    const prevBtn = document.getElementById('book-prev');
    const nextBtn = document.getElementById('book-next');
    const pageCountEl = document.getElementById('book-page-count');

    let images = [];
    if (masonryData && bookContainer) {

    // ── Extract image sources from hidden masonry ──────────────
    const items = masonryData.querySelectorAll('.m-item');
    items.forEach(item => {
        const imgNode = item.querySelector('.m-img');
        if (!imgNode) return;
        const bg = imgNode.getAttribute('data-bg') || imgNode.style.backgroundImage;
        if (bg) {
            const m = bg.match(/url\(['"]?(.*?)['"]?\)/i);
            if (m && m[1]) images.push(m[1]);
        }
    });

    if (images.length > 0) {

    // ── Build spreads: each = { left, right } image sources ───
    const spreads = [];
    for (let i = 0; i < images.length; i += 2) {
        spreads.push({ left: images[i], right: images[i + 1] || null });
    }
    const totalSpreads = spreads.length;
    let currentSpread = -1; // -1 = cover closed
    let isFlipping = false;

    // ── Build album DOM ────────────────────────────────────────
    const albumEl = document.createElement('div');
    albumEl.id = 'photo-album';
    bookContainer.appendChild(albumEl);

    albumEl.innerHTML = `
        <!-- ORNATE LEATHER COVER -->
        <div class="alb-cover-scene" id="alb-cover-scene">
            <div class="alb-cover" id="alb-cover">
                <div class="alb-cover-face alb-cover-front">
                    <div class="alb-c-noise"></div>
                    <div class="alb-c-border"></div>
                    <div class="alb-c-corner alb-c-tl"></div>
                    <div class="alb-c-corner alb-c-tr"></div>
                    <div class="alb-c-corner alb-c-bl"></div>
                    <div class="alb-c-corner alb-c-br"></div>
                    <div class="alb-c-orn alb-c-orn-t">&#10022; &ensp; &#10022; &ensp; &#10022;</div>
                    <div class="alb-c-monogram">S &#10022; M</div>
                    <div class="alb-c-rule"></div>
                    <div class="alb-c-subtitle">Wedding Album</div>
                    <div class="alb-c-date">27 &middot; August &middot; 2025</div>
                    <div class="alb-c-orn alb-c-orn-b">&#10022; &ensp; &#10022; &ensp; &#10022;</div>
                    <div class="alb-c-hint" id="alb-c-hint">Click to Open &#8250;</div>
                    <div class="alb-spine-strip"></div>
                </div>
                <div class="alb-cover-face alb-cover-inside">
                    <div class="alb-ep-pattern"></div>
                    <div class="alb-ep-text">
                        <h3>Swarnu &amp; Meenu</h3>
                        <div class="alb-ep-rule"></div>
                        <p>A Story of Two Hearts</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- OPEN BOOK (hidden until cover opens) -->
        <div class="alb-book" id="alb-book">

            <!-- Left static page -->
            <div class="alb-page alb-page-left" id="alb-left-pg">
                <div class="alb-pg-inner">
                    <div class="alb-photo-mat">
                        <div class="alb-ch alb-ch-tl"></div><div class="alb-ch alb-ch-tr"></div>
                        <div class="alb-ch alb-ch-bl"></div><div class="alb-ch alb-ch-br"></div>
                        <img class="alb-photo" id="alb-img-left" alt="Wedding photo" />
                        <div class="alb-mat-actions">
                            <button type="button" class="alb-act-btn alb-act-download" title="Download Full Quality HD Photo">⬇ Download HD</button>
                            <button type="button" class="alb-act-btn alb-act-expand" title="Expand Fullscreen">⤢ Expand</button>
                        </div>
                    </div>
                    <div class="alb-pg-num" id="alb-pn-left"></div>
                </div>
                <div class="alb-pg-shade-r"></div>
            </div>

            <!-- Book spine -->
            <div class="alb-spine-bar">
                <div class="alb-spine-line"></div>
            </div>

            <!-- Right section: underneath page + 3D flipper -->
            <div class="alb-right-section" id="alb-right-section">

                <!-- New right page revealed during forward flip -->
                <div class="alb-page alb-page-right alb-underneath" id="alb-underneath-pg">
                    <div class="alb-pg-inner">
                        <div class="alb-photo-mat">
                            <div class="alb-ch alb-ch-tl"></div><div class="alb-ch alb-ch-tr"></div>
                            <div class="alb-ch alb-ch-bl"></div><div class="alb-ch alb-ch-br"></div>
                            <img class="alb-photo" id="alb-img-underneath" alt="Wedding photo" />
                            <div class="alb-mat-actions">
                                <button type="button" class="alb-act-btn alb-act-download" title="Download Full Quality HD Photo">⬇ Download HD</button>
                                <button type="button" class="alb-act-btn alb-act-expand" title="Expand Fullscreen">⤢ Expand</button>
                            </div>
                        </div>
                        <div class="alb-pg-num" id="alb-pn-underneath"></div>
                    </div>
                    <div class="alb-pg-shade-l"></div>
                </div>

                <!-- 3D Flipper -->
                <div class="alb-flipper" id="alb-flipper">
                    <!-- Front face: current right page -->
                    <div class="alb-flip-face alb-flip-front">
                        <div class="alb-page alb-page-right">
                            <div class="alb-pg-inner">
                                <div class="alb-photo-mat">
                                    <div class="alb-ch alb-ch-tl"></div><div class="alb-ch alb-ch-tr"></div>
                                    <div class="alb-ch alb-ch-bl"></div><div class="alb-ch alb-ch-br"></div>
                                    <img class="alb-photo" id="alb-img-front" alt="Wedding photo" />
                                    <div class="alb-mat-actions">
                                        <button type="button" class="alb-act-btn alb-act-download" title="Download Full Quality HD Photo">⬇ Download HD</button>
                                        <button type="button" class="alb-act-btn alb-act-expand" title="Expand Fullscreen">⤢ Expand</button>
                                    </div>
                                </div>
                                <div class="alb-pg-num" id="alb-pn-right"></div>
                            </div>
                            <div class="alb-pg-shade-l"></div>
                            <div class="alb-flip-hover-hint">&#8250; Flip</div>
                        </div>
                    </div>
                    <!-- Back face: next left page content -->
                    <div class="alb-flip-face alb-flip-back">
                        <div class="alb-page alb-page-back">
                            <div class="alb-pg-inner">
                                <div class="alb-photo-mat">
                                    <div class="alb-ch alb-ch-tl"></div><div class="alb-ch alb-ch-tr"></div>
                                    <div class="alb-ch alb-ch-bl"></div><div class="alb-ch alb-ch-br"></div>
                                    <img class="alb-photo" id="alb-img-back" alt="Wedding photo" />
                                    <div class="alb-mat-actions">
                                        <button type="button" class="alb-act-btn alb-act-download" title="Download Full Quality HD Photo">⬇ Download HD</button>
                                        <button type="button" class="alb-act-btn alb-act-expand" title="Expand Fullscreen">⤢ Expand</button>
                                    </div>
                                </div>
                            </div>
                            <div class="alb-pg-shade-r"></div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Shadow overlay on left page during flip -->
            <div class="alb-left-overlay" id="alb-left-overlay"></div>

        </div>
    `;

    // ── DOM references ─────────────────────────────────────────
    const coverScene    = document.getElementById('alb-cover-scene');
    const coverEl       = document.getElementById('alb-cover');
    const bookEl        = document.getElementById('alb-book');
    const flipperEl     = document.getElementById('alb-flipper');
    const imgLeft       = document.getElementById('alb-img-left');
    const imgFront      = document.getElementById('alb-img-front');
    const imgBack       = document.getElementById('alb-img-back');
    const imgUnderneath = document.getElementById('alb-img-underneath');
    const pnLeft        = document.getElementById('alb-pn-left');
    const pnRight       = document.getElementById('alb-pn-right');
    const pnUnderneath  = document.getElementById('alb-pn-underneath');
    const leftOverlay   = document.getElementById('alb-left-overlay');

    // ── Helpers ────────────────────────────────────────────────
    function loadImg(el, src) {
        if (!el) return;
        el.classList.remove('loaded');
        if (!src) { el.removeAttribute('src'); return; }
        el.src = src;
        if (el.complete && el.naturalWidth > 0) {
            el.classList.add('loaded');
        } else {
            el.onload  = () => el.classList.add('loaded');
            el.onerror = () => el.classList.add('loaded');
        }
    }

    function setPN(el, n) { if (el) el.textContent = (n !== null && n !== undefined) ? String(n) : ''; }

    function setFlipper(deg, animated) {
        flipperEl.style.transition = animated
            ? 'transform 0.85s cubic-bezier(0.645, 0.045, 0.355, 1.000)'
            : 'none';
        flipperEl.style.transform = `rotateY(${deg}deg)`;
        if (!animated) void flipperEl.offsetWidth; // force reflow
    }

    // ── Open album ─────────────────────────────────────────────
    function openAlbum() {
        if (currentSpread >= 0) return;
        const hint = document.getElementById('alb-c-hint');
        if (hint) hint.textContent = 'Opening\u2026';
        coverEl.classList.add('alb-cover-open');

        setTimeout(() => {
            coverScene.style.display = 'none';
            bookEl.style.display = 'flex';
            currentSpread = 0;
            renderSpread(currentSpread);
            // Pre-load next underneath
            const n1 = spreads[1];
            if (n1) { loadImg(imgUnderneath, n1.right || n1.left); setPN(pnUnderneath, 4); }
            updateControls();
        }, 1150);
    }

    // ── Render current spread ──────────────────────────────────
    function renderSpread(idx) {
        const s = spreads[idx];
        if (!s) return;
        loadImg(imgLeft,  s.left);
        loadImg(imgFront, s.right);
        setPN(pnLeft,  idx * 2 + 1);
        setPN(pnRight, s.right ? idx * 2 + 2 : null);
    }

    // ── Flip NEXT ──────────────────────────────────────────────
    function flipNext() {
        if (isFlipping || currentSpread < 0 || currentSpread >= totalSpreads - 1) return;
        isFlipping = true;

        const next = currentSpread + 1;
        const ns   = spreads[next];

        // Back face = next left page
        loadImg(imgBack, ns.left);
        // Underneath = next right page (pre-loaded but set explicitly too)
        loadImg(imgUnderneath, ns.right);
        setPN(pnUnderneath, ns.right ? next * 2 + 2 : null);

        // Darken left page as page folds over it
        leftOverlay.classList.add('alb-overlay-active');

        // ── Animate 0° → -180° ──
        setFlipper(-180, true);

        setTimeout(() => {
            currentSpread = next;

            // Sync left static page to new left
            loadImg(imgLeft, ns.left);
            setPN(pnLeft, next * 2 + 1);

            // Sync front face for next flip cycle
            loadImg(imgFront, ns.right);
            setPN(pnRight, ns.right ? next * 2 + 2 : null);

            // Pre-load the following spread's right (underneath) page
            const nn = spreads[next + 1];
            if (nn) { loadImg(imgUnderneath, nn.right || nn.left); }

            // Reset flipper silently (instant, no animation)
            setFlipper(0, false);
            leftOverlay.classList.remove('alb-overlay-active');
            isFlipping = false;
            updateControls();
        }, 900);
    }

    // ── Flip PREV ──────────────────────────────────────────────
    function flipPrev() {
        if (isFlipping || currentSpread <= 0) return;
        isFlipping = true;

        const prev = currentSpread - 1;
        const ps   = spreads[prev];
        const cs   = spreads[currentSpread];

        // Set up faces before jumping flipper
        loadImg(imgFront, ps.right);           // front = prev right
        loadImg(imgBack,  cs.left);            // back  = current left (visible at -180)
        loadImg(imgUnderneath, cs.right);      // underneath = current right (visible at -180)
        loadImg(imgLeft, ps.left);             // left static = prev left (will be revealed)
        setPN(pnLeft, prev * 2 + 1);

        // Jump to -180° instantly
        setFlipper(-180, false);
        leftOverlay.classList.add('alb-overlay-active');

        // Animate -180° → 0°
        setTimeout(() => {
            setFlipper(0, true);

            setTimeout(() => {
                currentSpread = prev;
                loadImg(imgFront, ps.right);
                setPN(pnRight, ps.right ? prev * 2 + 2 : null);
                leftOverlay.classList.remove('alb-overlay-active');
                isFlipping = false;
                updateControls();
            }, 900);
        }, 30);
    }

    const bookDownloadCurBtn = document.getElementById('book-download-cur');

    // ── Update control state ───────────────────────────────────
    function updateControls() {
        if (pageCountEl) {
            if (currentSpread < 0) {
                pageCountEl.textContent = 'Click cover to open';
                if (bookDownloadCurBtn) bookDownloadCurBtn.style.display = 'none';
            } else {
                const from = currentSpread * 2 + 1;
                const to   = currentSpread * 2 + (spreads[currentSpread].right ? 2 : 1);
                pageCountEl.textContent = `Pages ${from}–${to} · Spread ${currentSpread + 1} of ${totalSpreads}`;
                if (bookDownloadCurBtn) bookDownloadCurBtn.style.display = 'inline-flex';
            }
        }
        if (prevBtn) prevBtn.disabled = currentSpread <= 0;
        if (nextBtn) nextBtn.disabled = currentSpread >= totalSpreads - 1;
    }

    if (bookDownloadCurBtn) {
        bookDownloadCurBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentSpread >= 0 && spreads[currentSpread]) {
                const s = spreads[currentSpread];
                const targetUrl = s.right || s.left;
                if (targetUrl) downloadOriginalPhoto(targetUrl, bookDownloadCurBtn);
            }
        });
    }

    // ── Event listeners ────────────────────────────────────────
    coverEl.addEventListener('click', openAlbum);

    flipperEl.addEventListener('click', (e) => {
        // Only flip if not clicking an action button inside the mat
        if (e.target.closest('.alb-mat-actions')) return;
        if (!isFlipping && currentSpread >= 0) flipNext();
    });

    if (prevBtn) prevBtn.addEventListener('click', flipPrev);
    if (nextBtn) nextBtn.addEventListener('click', flipNext);

    // Arrow key navigation (when gallery is visible)
    document.addEventListener('keydown', e => {
        if (currentSpread < 0) return;
        const sec = document.getElementById('gallery');
        const r   = sec ? sec.getBoundingClientRect() : null;
        if (r && r.top < window.innerHeight && r.bottom > 0) {
            if (e.key === 'ArrowRight') flipNext();
            if (e.key === 'ArrowLeft')  flipPrev();
        }
    });

    // ── Init ───────────────────────────────────────────────────
    bookEl.style.display = 'none';
    updateControls();

    } // end if (images.length > 0)
    } // end if (masonryData && bookContainer)

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

    // Attach click listeners to Album photos and Mat Actions
    document.addEventListener('click', (e) => {
        const dlBtn = e.target.closest('.alb-act-download');
        if (dlBtn) {
            e.stopPropagation();
            const mat = dlBtn.closest('.alb-photo-mat');
            const clickedImg = mat ? mat.querySelector('img') : null;
            if (clickedImg && clickedImg.getAttribute('src')) {
                downloadOriginalPhoto(clickedImg.getAttribute('src'), dlBtn);
            }
            return;
        }

        const expBtn = e.target.closest('.alb-act-expand');
        if (expBtn) {
            e.stopPropagation();
            const mat = expBtn.closest('.alb-photo-mat');
            const clickedImg = mat ? mat.querySelector('img') : null;
            if (clickedImg && clickedImg.getAttribute('src')) {
                const src = clickedImg.getAttribute('src');
                const idx = images.indexOf(src) >= 0 ? images.indexOf(src) : 0;
                openLightbox(images, idx);
            }
            return;
        }

        const mat = e.target.closest('.alb-photo-mat');
        if (mat && bookEl.style.display !== 'none') {
            const clickedImg = mat.querySelector('img');
            if (clickedImg && clickedImg.getAttribute('src')) {
                const src = clickedImg.getAttribute('src');
                const idx = images.indexOf(src) >= 0 ? images.indexOf(src) : 0;
                e.stopPropagation();
                openLightbox(images, idx);
            }
        }
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

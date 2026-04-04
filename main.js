// ==================== SPLASH INTRO ====================
const splash = document.getElementById('introSplash');
if (splash) {
    document.body.classList.add('splash-active');
    setTimeout(() => {
        document.body.classList.remove('splash-active');
    }, 2800);
    setTimeout(() => {
        splash.remove();
    }, 3800);
}

// ==================== NAVBAR + TRUST BAR ====================
const nav = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const trustBar = document.getElementById('topTrustBar');
const TRUST_BAR_H = trustBar ? trustBar.offsetHeight : 40;

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 80;
    nav.classList.toggle('scrolled', scrolled);
    if (trustBar) {
        trustBar.classList.toggle('hidden', scrolled);
        nav.style.top = scrolled ? '0px' : TRUST_BAR_H + 'px';
    }
});

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ==================== SCROLL PROGRESS BAR ====================
const scrollProgressBar = document.getElementById('scrollProgress');
if (scrollProgressBar) {
    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (window.scrollY / docHeight) * 100;
        scrollProgressBar.style.width = scrollPercent + '%';
    }, { passive: true });
}

// ==================== ACTIVE NAV LINK HIGHLIGHT ====================
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinksAll.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });

sections.forEach(section => navObserver.observe(section));

// ==================== ENERGETIC SCROLL REVEAL ====================
const energeticObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            energeticObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.energetic-reveal, .service-card, .why-item, .contact-card, .leader-card, .section-header').forEach((el, i) => {
    if (!el.classList.contains('energetic-reveal')) el.classList.add('energetic-reveal');
    
    // Add staggered delays
    const rowIdx = i % 4;
    el.style.transitionDelay = `${rowIdx * 0.08}s`;
    
    energeticObserver.observe(el);
});

// ==================== STAT COUNTER ====================
const counters = document.querySelectorAll('.stat-number[data-count]');
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1200; // Faster count
        const startTime = performance.now();
        
        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            el.textContent = current;
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        };
        requestAnimationFrame(update);
        countObserver.unobserve(el);
    });
}, { threshold: 0.5 });
counters.forEach(c => countObserver.observe(c));

// ==================== BACK TO TOP ====================
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visible', window.scrollY > 600);
});
backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==================== 3D TILT SERVICE CARDS ====================
if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            card.style.setProperty('--rx', rotateX + 'deg');
            card.style.setProperty('--ry', rotateY + 'deg');
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
        });
    });
}

// ==================== HERO MOUSE PARALLAX ====================
const hero = document.querySelector('.hero');
const heroOverlay = hero ? hero.querySelector('.hero-overlay') : null;
const heroTexture = hero ? hero.querySelector('.hero-texture-bg') : null;

if (hero && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        if (heroOverlay) {
            heroOverlay.style.transform = `translate(${x * -15}px, ${y * -15}px)`;
        }
        if (heroTexture) {
            heroTexture.style.transform = `scale(1.1) translate(${x * 30}px, ${y * 30}px)`;
        }
    });
}

// ==================== CANVAS THREAD PARTICLES (Fabric vibe) ====================
const heroCanvas = document.getElementById('heroCanvas');
if (heroCanvas && hero) {
    const ctx = heroCanvas.getContext('2d');
    let threads = [];
    let animId;

    function resizeCanvas() {
        heroCanvas.width = hero.offsetWidth;
        heroCanvas.height = hero.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Thread {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * heroCanvas.width;
            this.y = Math.random() * heroCanvas.height;
            this.length = 30 + Math.random() * 60;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = 0.15 + Math.random() * 0.3;
            this.drift = (Math.random() - 0.5) * 0.008;
            this.opacity = 0.08 + Math.random() * 0.15;
            this.thickness = 0.5 + Math.random() * 1;
            this.goldAmount = Math.random();
        }
        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.angle += this.drift;

            if (this.x < -this.length || this.x > heroCanvas.width + this.length ||
                this.y < -this.length || this.y > heroCanvas.height + this.length) {
                this.reset();
                // Re-enter from a random edge
                const edge = Math.floor(Math.random() * 4);
                if (edge === 0) { this.x = -this.length; this.y = Math.random() * heroCanvas.height; }
                else if (edge === 1) { this.x = heroCanvas.width + this.length; this.y = Math.random() * heroCanvas.height; }
                else if (edge === 2) { this.y = -this.length; this.x = Math.random() * heroCanvas.width; }
                else { this.y = heroCanvas.height + this.length; this.x = Math.random() * heroCanvas.width; }
            }
        }
        draw(ctx) {
            const endX = this.x + Math.cos(this.angle) * this.length;
            const endY = this.y + Math.sin(this.angle) * this.length;

            const r = Math.round(184 + (255 - 184) * this.goldAmount * 0.3);
            const g = Math.round(150 + (200 - 150) * this.goldAmount * 0.3);
            const b = Math.round(62 + (100 - 62) * this.goldAmount * 0.2);

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
            ctx.lineWidth = this.thickness;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }

    // Create threads
    const threadCount = Math.min(35, Math.floor(heroCanvas.width / 40));
    for (let i = 0; i < threadCount; i++) {
        threads.push(new Thread());
    }

    function animateThreads() {
        ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
        threads.forEach(t => {
            t.update();
            t.draw(ctx);
        });
        animId = requestAnimationFrame(animateThreads);
    }
    animateThreads();

    // Pause when hero is not visible
    const canvasObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            if (!animId) animateThreads();
        } else {
            cancelAnimationFrame(animId);
            animId = null;
        }
    }, { threshold: 0.1 });
    canvasObserver.observe(hero);
}

// ==================== TYPEWRITER EFFECT ON HERO SUBTITLE ====================
const heroSubtitle = hero ? hero.querySelector('.hero-content > p') : null;
if (heroSubtitle) {
    const fullText = heroSubtitle.textContent.trim();
    heroSubtitle.textContent = '';
    heroSubtitle.style.minHeight = '3em';
    let charIndex = 0;
    const typeDelay = 3500; // Wait for splash to finish

    setTimeout(() => {
        function typeChar() {
            if (charIndex < fullText.length) {
                heroSubtitle.textContent += fullText[charIndex];
                charIndex++;
                setTimeout(typeChar, 10 + Math.random() * 10);
            }
        }
        typeChar();
    }, 1500); // Start sooner after splash
}

// ==================== CONTACT FORM — REAL SUBMISSION via Formspree ====================
const form = document.getElementById('contactForm');
if (form) {
    const emailInput = document.getElementById('email');
    const replyTo = document.getElementById('replyTo');
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            replyTo.value = emailInput.value;
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.innerText;

        btn.innerText = 'Sending…';
        btn.disabled = true;
        btn.style.opacity = '0.65';

        const data = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                btn.innerText = '✓ Inquiry Sent! We will contact you soon.';
                btn.style.background = '#1a5c1a';
                btn.style.borderColor = '#1a5c1a';
                btn.style.color = '#fff';
                btn.style.opacity = '1';
                form.reset();
                replyTo.value = '';
            } else {
                const json = await response.json();
                if (json.errors) {
                    btn.innerText = 'Error — please try again or call us directly.';
                    btn.style.background = '#8b1a1a';
                    btn.style.opacity = '1';
                }
            }
        } catch (err) {
            btn.innerText = 'Network error — please call us directly.';
            btn.style.background = '#8b1a1a';
            btn.style.opacity = '1';
        }

        setTimeout(() => {
            btn.innerText = original;
            btn.style.cssText = '';
            btn.disabled = false;
        }, 5000);
    });
}

// ==================== SERVICE GALLERY MODAL ====================
let GALLERY_DATA = {
    industrial: {
        title: 'Industrial Uniforms',
        icon: 'fa-industry',
        images: [
            { src: 'assets/works/star-industrial-shirt-nobg.png', caption: 'Industrial Work Shirt — Star Industries' },
        ]
    },
    healthcare: {
        title: 'Healthcare Wear',
        icon: 'fa-stethoscope',
        images: [
            { src: 'assets/works/konnect-scrub-nobg.png', caption: 'Medical Scrubs — Konnect Diagnostics' },
            { src: 'assets/works/konnect-labcoat-nobg.png', caption: 'Lab Coat — Konnect Diagnostics' },
        ]
    },
    school: {
        title: 'School Uniforms',
        icon: 'fa-graduation-cap',
        images: [
            { src: 'assets/works/blazer-nobg.png', caption: 'Institutional Blazer — Aradhana Academy' },
            { src: 'assets/works/high-school-vest-nobg.png', caption: 'School Vest — Sri Gouthami High School' },
            { src: 'assets/works/laurus-pinafore.jpg', caption: 'Tartan Pinafore — Laurus School' },
            { src: 'assets/works/laurus-shirt-nobg.png', caption: 'Shirt & Tie Set — Laurus School' },
            { src: 'assets/works/uniform-set-nobg.png', caption: 'Complete Uniform Set — Primary School' },
        ]
    },
    bags: {
        title: 'Bags & Backpacks',
        icon: 'fa-shopping-bag',
        images: [
            { src: 'assets/works/techolution-bag-nobg.png', caption: 'Branded Corporate Bag — Techolution' },
            { src: 'assets/works/sih-bag-nobg.png', caption: 'Duffle Bag — Smart India Hackathon 2025' },
            { src: 'assets/works/vnrvjiet-bag.jpg', caption: 'Branded Bag — VNRVJIET' },
        ]
    },
    caps: {
        title: 'Caps & Headwear',
        icon: 'fa-hat-cowboy',
        images: [
            { src: 'assets/works/Deloitte cap-nobg.png', caption: 'Corporate Cap — Deloitte' },
            { src: 'assets/works/tsrtc-cap-nobg.png', caption: 'Official Cap — TSRTC' },
            { src: 'assets/works/bdubs-cap-nobg.png', caption: 'Embroidered Cap — B-DUBS' },
        ]
    },
    jackets: {
        title: 'Jackets & Rainwear',
        icon: 'fa-cloud-showers-heavy',
        images: [
            { src: 'assets/works/rainjacket-nobg.png', caption: 'Rain Jacket — All Weather Protection' },
        ]
    },
    customization: {
        title: 'Customization',
        icon: 'fa-magic',
        images: [
            { src: 'assets/works/custom-toofaan-shirt-nobg.png', caption: 'Custom Printed Sports Jersey' },
            { src: 'assets/works/custom-bsr-shirt-nobg.png', caption: 'Custom Gym T-Shirt — BSR' },
            { src: 'assets/works/custom-lock-decor-shirt-nobg.png', caption: 'Custom Corporate T-Shirt — Lock & Decor' },
            { src: 'assets/works/custom-political-shirts-nobg.png', caption: 'Custom Printed Event T-Shirts' },
        ]
    },
    corporate: {
        title: 'Corporate Apparel',
        icon: 'fa-briefcase',
        images: [
            { src: 'assets/works/corporate-polo-nobg.png', caption: 'Corporate Polo Shirt — liab expo' },
            { src: 'assets/works/emmadi-vest-nobg.png', caption: 'Corporate Nehru Vest — emmadi Silver Jewellery' },
            { src: 'assets/works/barbeque-pride-shirt-nobg.png', caption: 'Corporate Shirt — Barbeque Pride' },
        ]
    }
};

async function loadGalleryDataFromCMS() {
    try {
        const response = await fetch(`data/services-gallery.json?v=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) return;

        const data = await response.json();
        if (!data || typeof data !== 'object') return;

        const normalized = {};
        Object.entries(data).forEach(([key, value]) => {
            if (!value || typeof value !== 'object') return;

            const title = typeof value.title === 'string' && value.title.trim()
                ? value.title.trim()
                : key;
            const icon = typeof value.icon === 'string' && value.icon.trim()
                ? value.icon.trim()
                : 'fa-images';
            const images = Array.isArray(value.images)
                ? value.images
                    .filter((img) => img && typeof img.src === 'string' && typeof img.caption === 'string')
                    .map((img) => ({ src: img.src, caption: img.caption }))
                : [];

            normalized[key] = { title, icon, images };
        });

        if (Object.keys(normalized).length > 0) {
            GALLERY_DATA = normalized;
        }
    } catch (err) {
        // Keep bundled fallback data if CMS file is unavailable.
    }
}

loadGalleryDataFromCMS();

// Modal elements
const galleryModal = document.getElementById('galleryModal');
const galleryGrid = document.getElementById('galleryModalGrid');
const galleryTitle = document.getElementById('galleryModalTitle');
const galleryIcon = document.getElementById('galleryModalIcon');
const modalClose = document.getElementById('galleryModalClose');
const backdrop = galleryModal.querySelector('.gallery-modal-backdrop');

// Lightbox elements
const lightbox = document.getElementById('galleryLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxVideo = document.createElement('video');
lightboxVideo.className = 'lightbox-video';
lightboxVideo.id = 'lightboxVideo';
lightboxVideo.controls = true;
lightboxVideo.playsInline = true;
lightboxVideo.style.display = 'none';
lightboxImg.insertAdjacentElement('afterend', lightboxVideo);
const lightboxCap = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentImages = [];
let currentIndex = 0;

function isVideoFile(src) {
    return /\.(mp4|webm|ogg)(\?|#|$)/i.test(src || '');
}

function openGallery(category) {
    const data = GALLERY_DATA[category];
    if (!data) return;

    currentImages = data.images;
    galleryTitle.textContent = data.title;
    galleryIcon.innerHTML = `<i class="fas ${data.icon}"></i>`;

    galleryGrid.innerHTML = '';
    data.images.forEach((img, idx) => {
        const thumb = document.createElement('div');
        thumb.className = 'gallery-thumb';
        const mediaMarkup = isVideoFile(img.src)
            ? `<video src="${img.src}" muted playsinline preload="metadata"></video>`
            : `<img src="${img.src}" alt="${img.caption}" loading="lazy">`;

        thumb.innerHTML = `${mediaMarkup}<div class="gallery-thumb-caption">${img.caption}</div>`;
        // set pointer on the whole card
        thumb.addEventListener('click', () => openLightbox(idx));
        galleryGrid.appendChild(thumb);
    });

    galleryModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeGallery() {
    galleryModal.classList.remove('open');
    document.body.style.overflow = '';
    closeLightbox();
}

function openLightbox(idx) {
    currentIndex = idx;
    updateLightbox();
    lightbox.classList.add('open');
}

function closeLightbox() {
    lightbox.classList.remove('open');
}

function updateLightbox() {
    const img = currentImages[currentIndex];
    const isVideo = isVideoFile(img.src);

    lightboxCap.textContent = img.caption;

    if (isVideo) {
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = img.src;
        lightboxVideo.load();
    } else {
        lightboxVideo.pause();
        lightboxVideo.removeAttribute('src');
        lightboxVideo.style.display = 'none';

        lightboxImg.style.display = 'block';
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.caption;
            lightboxImg.style.opacity = '1';
        }, 150);
    }

    lightboxPrev.style.display = currentImages.length > 1 ? 'flex' : 'none';
    lightboxNext.style.display = currentImages.length > 1 ? 'flex' : 'none';
}

// Service card click events
document.querySelectorAll('.service-card[data-category]').forEach(card => {
    card.addEventListener('click', () => openGallery(card.dataset.category));
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openGallery(card.dataset.category);
        }
    });
});

// Close modal via button or backdrop
modalClose.addEventListener('click', closeGallery);
backdrop.addEventListener('click', closeGallery);

// Lightbox controls
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightbox();
});
lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (lightbox.classList.contains('open')) closeLightbox();
        else if (galleryModal.classList.contains('open')) closeGallery();
    }
    if (lightbox.classList.contains('open')) {
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    }
});
// ==================== MOBILE FLOATING ACTION BUTTONS ====================
document.addEventListener("DOMContentLoaded", function() {
    const fabToggle = document.querySelector(".mobile-fab-toggle");
    const fabMenu = document.querySelector(".mobile-fab-menu");

    if (fabToggle && fabMenu) {
        fabToggle.addEventListener("click", function() {
            fabToggle.classList.toggle("active");
            fabMenu.classList.toggle("active");
        });

        // Close FAB when clicking outside
        document.addEventListener("click", function(e) {
            if (!e.target.closest(".mobile-fab-container")) {
                fabToggle.classList.remove("active");
                fabMenu.classList.remove("active");
            }
        });

        // Auto-hide FAB on scroll down, show on scroll up
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateFabVisibility() {
            const currentScrollY = window.scrollY;
            const fabContainer = document.querySelector(".mobile-fab-container");
            
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                // Scrolling down - hide FAB
                fabContainer.style.transform = "scale(0.8)";
                fabContainer.style.opacity = "0.5";
            } else if (currentScrollY < lastScrollY || currentScrollY < 100) {
                // Scrolling up or near top - show FAB
                fabContainer.style.transform = "scale(1)";
                fabContainer.style.opacity = "1";
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateFabVisibility);
                ticking = true;
            }
        }

        window.addEventListener("scroll", requestTick, { passive: true });
    }
});

// ==================== GALLERY SWIPE FUNCTIONALITY ====================
let startX = null;
let startY = null;
let touchStartIndex = null;

function addSwipeToLightbox() {
    const lightboxElement = document.getElementById("galleryLightbox");
    if (!lightboxElement) return;

    lightboxElement.addEventListener("touchstart", function(e) {
        if (e.touches.length === 1) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            touchStartIndex = currentIndex;
        }
    }, { passive: true });

    lightboxElement.addEventListener("touchmove", function(e) {
        if (!startX || !startY) return;
        
        // Prevent default scroll behavior
        e.preventDefault();
    }, { passive: false });

    lightboxElement.addEventListener("touchend", function(e) {
        if (!startX || !startY) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Check if horizontal swipe (not vertical scroll)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe right - go to previous
                previousImage();
            } else {
                // Swipe left - go to next
                nextImage();
            }
        }

        // Reset
        startX = null;
        startY = null;
        touchStartIndex = null;
    }, { passive: true });
}

// Initialize swipe functionality when DOM loads
document.addEventListener("DOMContentLoaded", function() {
    addSwipeToLightbox();
});

// ==================== CLIENT LOGOS SHOWCASE ====================
async function loadClientLogos() {
    try {
        const response = await fetch("data/clients.json");
        if (!response.ok) return;
        
        const clients = await response.json();
        const clientSection = document.querySelector(".clients-section");
        
        if (clientSection && Array.isArray(clients) && clients.length > 0) {
            // Add client logos grid
            const logoGrid = document.createElement("div");
            logoGrid.className = "client-logos-grid";
            logoGrid.innerHTML = clients
                .filter(client => client.logo)
                .slice(0, 8) // Show top 8 client logos
                .map(client => `
                    <div class="client-logo-item">
                        <img src="${client.logo}" alt="${client.name}" loading="lazy">
                        <span class="client-logo-name">${client.name}</span>
                    </div>
                `).join("");
            
            // Insert after the section header but before the trust indicators
            const sectionHeader = clientSection.querySelector(".section-header");
            if (sectionHeader && sectionHeader.nextElementSibling) {
                sectionHeader.parentNode.insertBefore(logoGrid, sectionHeader.nextElementSibling);
            }
        }
    } catch (error) {
        console.log("Client logos not available:", error);
    }
}

// Load client logos when page loads
document.addEventListener("DOMContentLoaded", loadClientLogos);

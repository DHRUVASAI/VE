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

// ==================== SCROLL REVEAL ====================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const siblings = Array.from(entry.target.parentElement.children);
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${idx * 0.07}s`;
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll(
    '.service-card, .portfolio-item, .contact-card, .why-item, .section-header'
).forEach(el => {
    el.classList.add('reveal-item');
    revealObserver.observe(el);
});

const revealStyle = document.createElement('style');
revealStyle.textContent = `
    .reveal-item {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .revealed { opacity: 1 !important; transform: translateY(0) !important; }
`;
document.head.appendChild(revealStyle);

// ==================== STAT COUNTER ====================
const counters = document.querySelectorAll('.stat-number[data-count]');
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1800;
        const step = Math.ceil(target / (duration / 16));
        let current = 0;
        const tick = () => {
            current = Math.min(current + step, target);
            el.textContent = current;
            if (current < target) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
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
const GALLERY_DATA = {
    industrial: {
        title: 'Industrial Uniforms',
        icon: 'fa-industry',
        images: [
            { src: 'assets/works/star-industrial-shirt.jpg', caption: 'Industrial Work Shirt — Star Industries' },
        ]
    },
    healthcare: {
        title: 'Healthcare Wear',
        icon: 'fa-stethoscope',
        images: [
            { src: 'assets/works/konnect-scrub.jpg', caption: 'Medical Scrubs — Konnect Diagnostics' },
            { src: 'assets/works/konnect-labcoat.jpg', caption: 'Lab Coat — Konnect Diagnostics' },
        ]
    },
    school: {
        title: 'School Uniforms',
        icon: 'fa-graduation-cap',
        images: [
            { src: 'assets/works/blazer.jpg', caption: 'Institutional Blazer — Aradhana Academy' },
            { src: 'assets/works/high-school-vest.jpg', caption: 'School Vest with Logo — Sri Gouthami High School' },
            { src: 'assets/works/laurus-pinafore.jpg', caption: 'Tartan Pinafore — Laurus School' },
            { src: 'assets/works/laurus-shirt.jpg', caption: 'Shirt & Tie Set — Laurus School' },
            { src: 'assets/works/uniform-set.jpg', caption: 'Complete Uniform Set — Primary School Collection' },
        ]
    },
    bags: {
        title: 'Bags & Backpacks',
        icon: 'fa-shopping-bag',
        images: [
            { src: 'assets/works/techolution-bag.jpg', caption: 'Branded Corporate Bag — Techolution' },
            { src: 'assets/works/sih-bag.jpg', caption: 'Duffle Bag — Smart India Hackathon 2025' },
            { src: 'assets/works/vnrvjiet-bag.jpg', caption: 'Branded Bag — VNRVJIET' },
        ]
    },
    caps: {
        title: 'Caps & Headwear',
        icon: 'fa-hat-cowboy',
        images: [
            { src: 'assets/works/Deloitte cap.jpg', caption: 'Corporate Cap — Deloitte' },
            { src: 'assets/works/Corporate Cap.jpg', caption: 'Promotional Cap' },
            { src: 'assets/works/tsrtc-cap.jpg', caption: 'Official Cap — TSRTC' },
            { src: 'assets/works/bdubs-cap.jpg', caption: 'Embroidered Cap — B-DUBS' },
        ]
    },
    jackets: {
        title: 'Jackets & Rainwear',
        icon: 'fa-cloud-showers-heavy',
        images: [
            { src: 'assets/works/rainjacket.jpg', caption: 'Rain Jacket — All Weather Protection' },
        ]
    },
    customization: {
        title: 'Customization',
        icon: 'fa-magic',
        images: [
            { src: 'assets/works/t-shirt.jpg', caption: 'Custom Printed T-Shirt' },
        ]
    },
    corporate: {
        title: 'Corporate Apparel',
        icon: 'fa-briefcase',
        images: [
            { src: 'assets/works/corporate-polo.jpg', caption: 'Corporate Polo Shirt — liab expo' },
            { src: 'assets/works/emmadi-vest.jpg', caption: 'Corporate Nehru Vest — emmadi Silver Jewellery' },
            { src: 'assets/works/barbeque-pride-shirt.jpg', caption: 'Corporate Shirt — Barbeque Pride' },
        ]
    }
};

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
const lightboxCap = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentImages = [];
let currentIndex = 0;

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
        thumb.innerHTML = `
            <img src="${img.src}" alt="${img.caption}" loading="lazy">
            <div class="gallery-thumb-caption">${img.caption}</div>
        `;
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
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.caption;
        lightboxCap.textContent = img.caption;
        lightboxImg.style.opacity = '1';
    }, 150);
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
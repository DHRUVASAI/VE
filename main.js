

// ==================== NAVBAR ====================
const nav = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
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
    // Sync email field to hidden _replyto so owner can reply directly
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

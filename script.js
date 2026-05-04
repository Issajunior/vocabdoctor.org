/* ============================
   Theme Toggle
============================ */
const themeBtn = document.getElementById('themeBtn');
const html = document.documentElement;

const saved = localStorage.getItem('vd-theme') || 'light';
html.setAttribute('data-theme', saved);

themeBtn?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('vd-theme', next);
});

/* ============================
   Nav Scroll + Mobile Menu
============================ */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger?.addEventListener('click', () => {
    navMenu?.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navMenu?.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
});

navMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const spans = hamburger?.querySelectorAll('span');
        spans?.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
});

/* ============================
   Smooth Scroll
============================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = nav ? nav.offsetHeight : 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
});

/* ============================
   Reveal on Scroll
============================ */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

reveals.forEach((el, i) => {
    el.dataset.delay = (i % 4) * 80;
    revealObserver.observe(el);
});

/* ============================
   Flip Card (Hero)
============================ */
const flipCard = document.getElementById('flipCard');
const cardTag = document.getElementById('cardTag');
const cardWord = document.getElementById('cardWord');
const cardDef = document.getElementById('cardDef');
const cardEx = document.getElementById('cardEx');
const dots = document.querySelectorAll('.dot');

const cards = [
    { tag: '🌍 Spanish', word: 'serendipia', def: 'A pleasant discovery made by chance', ex: '"Fue pura serendipia encontrarte aquí."' },
    { tag: '🩺 Medical', word: 'tachycardia', def: 'Abnormally rapid heart rate above 100 bpm', ex: '"The patient presented with tachycardia."' },
    { tag: '⚖️ Legal', word: 'habeas corpus', def: 'The right to appear before a court of law', ex: '"He filed a writ of habeas corpus."' },
    { tag: '🗾 Japanese', word: '木漏れ日', def: 'Sunlight filtering through leaves of trees', ex: '"木漏れ日が森を美しく照らしていた。"' },
];

let cardIdx = 0;
let isFlipped = false;

function updateCard(idx) {
    const c = cards[idx];
    if (cardTag) cardTag.textContent = c.tag;
    if (cardWord) cardWord.textContent = c.word;
    if (cardDef) cardDef.textContent = c.def;
    if (cardEx) cardEx.textContent = c.ex;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

flipCard?.addEventListener('click', () => {
    isFlipped = !isFlipped;
    flipCard.classList.toggle('flipped', isFlipped);
});

document.querySelectorAll('.rate-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (isFlipped) {
            flipCard?.classList.remove('flipped');
            isFlipped = false;
            cardIdx = (cardIdx + 1) % cards.length;
            setTimeout(() => updateCard(cardIdx), 300);
        } else {
            flipCard?.classList.add('flipped');
            isFlipped = true;
        }
    });
});

setInterval(() => {
    if (!isFlipped) {
        cardIdx = (cardIdx + 1) % cards.length;
        updateCard(cardIdx);
    }
}, 3500);

/* ============================
   Animated Counters (Stats)
============================ */
const counters = document.querySelectorAll('.stat-number[data-target]');

const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const isDecimal = target % 1 !== 0;
        const duration = 1600;
        const steps = 60;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
                clearInterval(timer);
            } else {
                el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
            }
        }, duration / steps);

        countObserver.unobserve(el);
    });
}, { threshold: 0.5 });

counters.forEach(c => countObserver.observe(c));

/* ============================
   FAQ (Contact Page)
============================ */
document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q?.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => {
            i.classList.remove('open');
            i.querySelector('.faq-a').style.maxHeight = null;
        });
        if (!isOpen) {
            item.classList.add('open');
            a.style.maxHeight = a.scrollHeight + 'px';
        }
    });
});

/* ============================
   Contact Form
============================ */
const contactForm = document.getElementById('contactForm');
const successMsg = document.getElementById('successMsg');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    let valid = true;

    [nameInput, emailInput].forEach(input => {
        if (!input?.value.trim()) {
            input?.classList.add('error');
            valid = false;
        } else {
            input?.classList.remove('error');
        }
    });

    if (!valid) return;

    const btn = contactForm.querySelector('.submit-btn');
    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

    await new Promise(r => setTimeout(r, 1200));

    contactForm.style.display = 'none';
    if (successMsg) successMsg.style.display = 'block';
});

document.querySelectorAll('.form-row input, .form-row textarea').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
});

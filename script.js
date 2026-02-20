document.addEventListener('DOMContentLoaded', () => {
    // ── Navbar scroll effect ────────────────────────
    const navbar = document.querySelector('.navbar');

    // ── Mobile nav toggle ───────────────────────────
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // ── Scroll Reveal ───────────────────────────────
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ── Smooth anchor scroll (offset for fixed nav) ───
    let isClickScrolling = false;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                isClickScrolling = true;
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
                history.pushState(null, '', href);
                updateActiveNav(href);
                // Allow scroll-based updates again after animation
                setTimeout(() => { isClickScrolling = false; }, 1000);
            }
        });
    });

    // ── Hash update on scroll ───────────────────────
    // Collect all sections with IDs for scroll spy
    const sectionIds = ['features', 'kubernetes', 'how-it-works', 'download'];
    const navOffset = 120; // pixels from top to consider "in view"

    function getCurrentSection() {
        const scrollY = window.scrollY;

        // If near top, no hash
        if (scrollY < 300) return '';

        // Walk sections bottom-up — last one whose top is above the threshold wins
        for (let i = sectionIds.length - 1; i >= 0; i--) {
            const el = document.getElementById(sectionIds[i]);
            if (el && el.getBoundingClientRect().top <= navOffset) {
                return sectionIds[i];
            }
        }
        return '';
    }

    function updateActiveNav(hash) {
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.remove('nav-active');
            const href = a.getAttribute('href');
            if (href === hash || (hash && href && href.endsWith(hash))) {
                a.classList.add('nav-active');
            }
        });
    }

    let ticking = false;

    window.addEventListener('scroll', () => {
        // Navbar background
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        // Skip hash updates during click-initiated scroll
        if (isClickScrolling) return;

        if (!ticking) {
            requestAnimationFrame(() => {
                const current = getCurrentSection();
                const newHash = current ? '#' + current : '';
                const oldHash = window.location.hash;

                if (newHash !== oldHash) {
                    if (newHash) {
                        history.replaceState(null, '', newHash);
                    } else {
                        history.replaceState(null, '', window.location.pathname);
                    }
                    updateActiveNav(newHash);
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
});

fetch('header.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('header-placeholder').innerHTML = html;

        // 1. Get raw pathname (e.g. "/signup/" or "/signup.html")
        let raw = window.location.pathname;

        // 2. Strip leading & trailing slashes
        let clean = raw.replace(/^\/|\/$/g, '');  // "signup" or "signup.html" or ""

        // 3. Default home to "index.html"
        if (clean === '') clean = 'index.html';

        // 4. Ensure .html extension
        const currentFile = clean.endsWith('.html') ? clean : `${clean}.html`;

        // 5. Loop links
        document.querySelectorAll('#header-placeholder a').forEach(link => {
            let href = link.getAttribute('href');     // e.g. "signup.html" or "/signup.html"
            // normalize href too:
            href = href.replace(/^\/|\/$/g, '');      // strip slashes
            if (!href.endsWith('.html')) href = `${href}.html`;

            if (href === currentFile) {
                link.classList.add('active');
                link.addEventListener('click', e => e.preventDefault());
            } else {
                link.classList.remove('active');
            }
        });
    });


fetch('footer.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('footer-placeholder').innerHTML = html;
    });

document.addEventListener('DOMContentLoaded', () => {
    const els = document.querySelectorAll('.fade-in-element');
    const obs = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    els.forEach(el => obs.observe(el));
}); 
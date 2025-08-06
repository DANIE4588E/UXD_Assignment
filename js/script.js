fetch('header.html')
    .then(r => r.text())
    .then(html => {
        // Inject header
        document.getElementById('header-placeholder').innerHTML = html;

        // Grab all links in the injected header
        const links = document.querySelectorAll('#header-placeholder a');

        // 1. Normalize the current path into "something.html"
        //    - strip trailing slash, default "/" → "index.html"
        let rawPath = window.location.pathname.replace(/\/$/, '');  // "/signup" or ""
        let currentFile = rawPath
            ? rawPath.replace(/^\//, '')                                // drop leading slash
            : 'index.html';
        if (!currentFile.endsWith('.html')) {
            currentFile += '.html';
        }

        // 2. Loop through each <a> and normalize its href the same way
        links.forEach(link => {
            const url = new URL(link.getAttribute('href'), location.origin);
            let linkPath = url.pathname.replace(/\/$/, '');            // "/signup" or ""
            let linkFile = linkPath
                ? linkPath.replace(/^\//, '')                            // "signup"
                : 'index.html';
            if (!linkFile.endsWith('.html')) {
                linkFile += '.html';
            }

            // 3. Compare and toggle "active"
            if (linkFile === currentFile) {
                link.classList.add('active');
                link.addEventListener('click', e => e.preventDefault());
            } else {
                link.classList.remove('active');
            }
        });
    })
    .catch(err => console.error('Error loading header:', err));



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
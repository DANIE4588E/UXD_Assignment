fetch('header.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('header-placeholder').innerHTML = html;

        // strip trailing slash ("/about/" → "/about"), default "/" → "/index.html"
        let pathname = window.location.pathname.replace(/\/$/, '') || '/';
        if (pathname === '/') pathname = '/index.html';

        document
            .querySelectorAll('#header-placeholder a')
            .forEach(link => {
                // make link.href absolute and strip origin
                let linkPath = new URL(link.href, location.origin).pathname;
                linkPath = linkPath.replace(/\/$/, '') || '/index.html';

                if (linkPath === pathname) {
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
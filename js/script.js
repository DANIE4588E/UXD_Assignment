fetch('header.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('header-placeholder').innerHTML = html;

        const currentPath = window.location.pathname.split("/").pop();
        const links = document.querySelectorAll('#header-placeholder a');

        links.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath) {
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

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
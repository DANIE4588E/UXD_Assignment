fetch('header.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('header-placeholder').innerHTML = html;

        const links = document.querySelectorAll('#header-placeholder a');

        let rawPath = window.location.pathname.replace(/\/$/, '');
        let currentFile = rawPath
            ? rawPath.replace(/^\//, '')
            : 'index.html';
        if (!currentFile.endsWith('.html')) {
            currentFile += '.html';
        }

        links.forEach(link => {
            const url = new URL(link.getAttribute('href'), location.origin);
            let linkPath = url.pathname.replace(/\/$/, '');
            let linkFile = linkPath
                ? linkPath.replace(/^\//, '')
                : 'index.html';
            if (!linkFile.endsWith('.html')) {
                linkFile += '.html';
            }

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


// Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDZVoZMsL5tRMKlR3Y2m68PCilZqOiLYdw",
    authDomain: "ux-assignment.firebaseapp.com",
    projectId: "ux-assignment",
    storageBucket: "ux-assignment.appspot.com",
    messagingSenderId: "695373901468",
    appId: "1:695373901468:web:942d3bfb6d8b17f2fe8759",
    measurementId: "G-Q13N4V4F26"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function fetchAndCacheEvents() {
    const now = firebase.firestore.Timestamp.now();
    const snap = await db.collection('events')
        .where('startTime', '>=', now)
        .orderBy('startTime', 'asc')
        .get();

    const events = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    localStorage.setItem('cachedEvents', JSON.stringify({
        ts: Date.now(),
        data: events
    }));
    return events;
}

window.addEventListener('DOMContentLoaded', () => {
    const item = JSON.parse(localStorage.getItem('cachedEvents') || 'null');
    if (!item || Date.now() - item.ts > 5 * 60e3) {
        fetchAndCacheEvents().catch(console.error);
    }
});
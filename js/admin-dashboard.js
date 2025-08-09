(function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "AIzaSyDZVoZMsL5tRMKlR3Y2m68PCilZqOiLYdw",
      authDomain: "ux-assignment.firebaseapp.com",
      projectId: "ux-assignment",
      storageBucket: "ux-assignment.appspot.com",
      messagingSenderId: "695373901468",
      appId: "1:695373901468:web:942d3bfb6d8b17f2fe8759",
      measurementId: "G-Q13N4V4F26"
    });
  }
})();

const auth = firebase.auth();
const db = firebase.firestore();

// Authentication
auth.onAuthStateChanged(user => {
  if (!user) window.location.href = './admin-auth.html';
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await auth.signOut();
  window.location.href = './admin-auth.html';
});

const toTs = (d) => firebase.firestore.Timestamp.fromDate(new Date(d));
const toLocalInput = (ts) => {
  if (!ts) return '';
  const date = ts.toDate();
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// Applications
async function loadApplications() {
  const body = document.getElementById('applications-body');
  body.innerHTML = '';
  try {
    const snapshot = await db.collection('applications').orderBy('timestamp', 'desc').get();
    snapshot.forEach(doc => {
      const data = doc.data();
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${data.studentId || doc.id}</td>
        <td>${data.name || ''}</td>
        <td>${data.email || ''}</td>
        <td>${data.phone || ''}</td>
        <td>${data.experience || ''}</td>
        <td>${data.comment || ''}</td>
        <td>${data.timestamp ? data.timestamp.toDate().toLocaleString() : ''}</td>
      `;
      body.appendChild(tr);
    });
  } catch (err) {
    console.error('Error loading applications', err);
  }
}

// Add Event
document.getElementById('event-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('event-title').value.trim();
  const description = document.getElementById('event-description').value.trim();
  const location = document.getElementById('event-location').value.trim();
  const startTime = document.getElementById('event-start').value;
  const endTime = document.getElementById('event-end').value;
  const lat = parseFloat(document.getElementById('event-lat').value);
  const lng = parseFloat(document.getElementById('event-lng').value);

  try {
    await db.collection('events').add({
      title,
      description,
      location,
      startTime: toTs(startTime),
      endTime: toTs(endTime),
      geo: new firebase.firestore.GeoPoint(lat, lng),
      createdAt: firebase.firestore.Timestamp.now()
    });

    if (typeof fetchAndCacheEvents === 'function') {
      await fetchAndCacheEvents();
    }
    e.target.reset();
    alert('Event added successfully!');
  } catch (err) {
    console.error('Error adding event:', err);
    alert('Failed to add event.');
  }
});

const eventsBody = document.getElementById('events-body');
let editModal;

document.addEventListener('DOMContentLoaded', () => {
  const modalEl = document.getElementById('editEventModal');
  editModal = new bootstrap.Modal(modalEl);
});

function renderEventRow(id, data) {
  const tr = document.createElement('tr');
  tr.dataset.id = id;
  tr.innerHTML = `
    <td>${data.title}</td>
    <td>${data.description}</td>
    <td>${data.location}</td>
    <td>${data.startTime ? data.startTime.toDate().toLocaleString() : ''}</td>
    <td>${data.endTime ? data.endTime.toDate().toLocaleString() : ''}</td>
    <td class="table-actions">
      <button class="btn btn-sm btn-outline-primary" data-action="edit" title="Edit"><i class="bi bi-pencil-square"></i></button>
      <button class="btn btn-sm btn-outline-danger" data-action="delete" title="Delete"><i class="bi bi-trash"></i></button>
    </td>
  `;
  return tr;
}

function bindRowActions(tr, id, data) {
  tr.querySelector('[data-action="edit"]').addEventListener('click', () => {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-title').value = data.title || '';
    document.getElementById('edit-description').value = data.description || '';
    document.getElementById('edit-location').value = data.location || '';
    document.getElementById('edit-lat').value = data.geo?.latitude ?? '';
    document.getElementById('edit-lng').value = data.geo?.longitude ?? '';
    document.getElementById('edit-start').value = toLocalInput(data.startTime);
    document.getElementById('edit-end').value = toLocalInput(data.endTime);
    editModal.show();
  });

  tr.querySelector('[data-action="delete"]').addEventListener('click', async () => {
    const ok = confirm(`Delete event: "${data.title}"? This cannot be undone.`);
    if (!ok) return;
    try {
      await db.collection('events').doc(id).delete();
      if (typeof fetchAndCacheEvents === 'function') {
        await fetchAndCacheEvents();
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete event.');
    }
  });
}

document.getElementById('edit-event-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const title = document.getElementById('edit-title').value.trim();
  const description = document.getElementById('edit-description').value.trim();
  const location = document.getElementById('edit-location').value.trim();
  const lat = parseFloat(document.getElementById('edit-lat').value);
  const lng = parseFloat(document.getElementById('edit-lng').value);
  const start = document.getElementById('edit-start').value;
  const end = document.getElementById('edit-end').value;

  try {
    await db.collection('events').doc(id).update({
      title,
      description,
      location,
      geo: new firebase.firestore.GeoPoint(lat, lng),
      startTime: toTs(start),
      endTime: toTs(end)
    });
    if (typeof fetchAndCacheEvents === 'function') {
      await fetchAndCacheEvents();
    }
    editModal.hide();
    alert('Event updated.');
  } catch (err) {
    console.error('Update failed:', err);
    alert('Failed to update event.');
  }
});

function startEventsListener() {
  return db.collection('events').orderBy('startTime', 'asc').onSnapshot(snap => {
    eventsBody.innerHTML = '';
    if (snap.empty) {
      eventsBody.innerHTML = `<tr><td colspan="6" class="text-center">No events found.</td></tr>`;
      return;
    }
    snap.forEach(doc => {
      const data = doc.data();
      const tr = renderEventRow(doc.id, data);
      eventsBody.appendChild(tr);
      bindRowActions(tr, doc.id, data);
    });
  }, err => {
    console.error('Events listener error:', err);
  });
}

// Init
(async function init() {
  await loadApplications();
  startEventsListener();
})();

// const apiBase = 'http://localhost:5000/api';
const API_URL = "https://voxblend-music-app-1.onrender.com";

const audio       = document.getElementById('audioPlayer');
const vinyl       = document.getElementById('vinyl');
const trackName   = document.getElementById('trackName');
const trackArtist = document.getElementById('trackArtist');
const playingDot  = document.getElementById('playingDot');
const subLabel    = document.getElementById('subLabel');
const subSub      = document.getElementById('subSub');
const subFill     = document.getElementById('subFill');
const songsCount  = document.getElementById('songsCount');

let currentLikes = 0;

// Vinyl spin control
if (audio && vinyl) {
  audio.addEventListener('play',  () => {
    vinyl.classList.add('playing');
    if (playingDot) playingDot.classList.add('visible');
  });
  audio.addEventListener('pause', () => {
    vinyl.classList.remove('playing');
    if (playingDot) playingDot.classList.remove('visible');
  });
  audio.addEventListener('ended', () => {
    vinyl.classList.remove('playing');
    if (playingDot) playingDot.classList.remove('visible');
  });
}

// Speed control
function changeSpeed(speed, btn) {
  if (audio) audio.playbackRate = speed;

  // Update active state
  document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// Play a song
function playSong(url, title, artist) {
  if (!audio) return;
  audio.src = url;
  audio.play();

  if (trackName)   trackName.textContent  = title  || 'Unknown Title';
  if (trackArtist) trackArtist.textContent = artist || 'Unknown Artist';
}

// Load uploaded songs
async function loadUploads() {
  const container = document.getElementById('uploadsContainer');
  if (!container) return;

  try {
    const res     = await fetch(`${apiBase}/uploads`);
    const uploads = await res.json();

    container.innerHTML = '';

    if (!uploads.length) {
      container.innerHTML = `
        <div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 12px;display:block;opacity:0.25"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          <p style="font-size:0.9rem">No songs uploaded yet</p>
        </div>
      `;
      if (songsCount) songsCount.textContent = '0 tracks';
      return;
    }

    if (songsCount) songsCount.textContent = uploads.length + ' track' + (uploads.length !== 1 ? 's' : '');

    uploads.forEach((u, i) => {
      const row = document.createElement('div');
      row.className = 'song-row';
      row.style.animationDelay = (i * 0.06) + 's';

      // const url    = 'http://localhost:5000' + u.fileUrl;
      const url = 'https://voxblend-music-app-1.onrender.com' + u.fileUrl;
      const title  = u.title || 'Untitled';
      const artist = u.userId?.username || 'Unknown';

      row.innerHTML = `
        <div class="song-row-num">${i + 1}</div>
        <div class="song-row-playing-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="2" y1="4" x2="2" y2="20"/><line x1="7" y1="8" x2="7" y2="20"/>
            <line x1="12" y1="4" x2="12" y2="20"/><line x1="17" y1="10" x2="17" y2="20"/>
            <line x1="22" y1="6" x2="22" y2="20"/>
          </svg>
        </div>
        <div class="song-row-meta">
          <div class="song-row-title">${title}</div>
          <div class="song-row-bgm">${artist}</div>
        </div>
        <div class="song-row-likes">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span id="like-count-${u._id}">${u.likes || 0}</span>
        </div>
        <div class="song-row-actions">
          <button class="btn-icon btn-icon-play" onclick="playSong('${url}', '${title.replace(/'/g, "\\'")}', '${artist.replace(/'/g, "\\'")}'); setActive(this.closest('.song-row'))" title="Play">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </button>
          <button class="btn-icon btn-icon-like" onclick="likeUpload('${u._id}', this)" title="Like">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
      `;

      container.appendChild(row);
    });
  } catch {
    const container = document.getElementById('uploadsContainer');
    if (container) {
      container.innerHTML = `
        <div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
          <p style="font-size:0.85rem">Could not load songs — server may be offline</p>
        </div>
      `;
    }
  }
}

function setActive(row) {
  document.querySelectorAll('.song-row').forEach(r => r.classList.remove('active'));
  if (row) row.classList.add('active');
}

async function likeUpload(id, btn) {
  try {
    btn.disabled = true;
    const res = await fetch(`${apiBase}/uploads/${id}/like`, { method: 'PUT' });
    if (res.ok) {
      currentLikes++;
      updateSubscription();

      const countEl = document.getElementById('like-count-' + id);
      if (countEl) countEl.textContent = parseInt(countEl.textContent) + 1;

      btn.style.background = 'rgba(239,68,68,0.25)';
      btn.style.color = '#fca5a5';
    } else {
      btn.disabled = false;
    }
  } catch {
    btn.disabled = false;
  }
}

function updateSubscription() {
  const pct = Math.min((currentLikes / 10) * 100, 100);
  if (subFill) subFill.style.width = pct + '%';

  if (currentLikes >= 10) {
    if (subLabel) subLabel.textContent = 'Premium Active — 5 Days Free';
    if (subSub)   subSub.textContent   = 'Enjoy ad-free listening and exclusive features';
    setTimeout(() => { window.location.href = 'subscription-success.html'; }, 1500);
  } else {
    if (subLabel) subLabel.textContent = 'Premium Subscription';
    if (subSub)   subSub.textContent   = `Like ${10 - currentLikes} more song${10 - currentLikes !== 1 ? 's' : ''} to unlock 5 days free`;
  }
}

window.addEventListener('load', () => {
  loadUploads();
  updateSubscription();
});

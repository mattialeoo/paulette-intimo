if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (window.location.hash) {
  window.scrollTo(0, 0);
  history.replaceState(null, document.title, window.location.pathname + window.location.search);
}

document.getElementById('year').textContent = new Date().getFullYear();

const today = new Date().getDay();
const todayRow = document.querySelector(`.hours-list li[data-day="${today}"]`);
if (todayRow) todayRow.classList.add('is-today');

const header = document.querySelector('.site-header');
const burger = document.getElementById('burger');

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

burger.addEventListener('click', () => {
  const isOpen = header.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    header.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealItems.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

/* Hero slideshow */
const slides = document.querySelectorAll('.hero-slide');
const dotsWrap = document.querySelector('.hero-dots');
if (slides.length > 1) {
  let current = 0;
  const dots = [...slides].map((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('is-active');
    dotsWrap.appendChild(dot);
    return dot;
  });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    setInterval(() => {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }, 4500);
  }
}

/* Google Maps cookie consent gate */
const MAPS_SRC = 'https://www.google.com/maps?q=Via+Mazzini+42,+30031+Dolo+VE&output=embed';
const MAPS_CONSENT_KEY = 'paulette-maps-consent';
const mapFrame = document.getElementById('mapFrame');
const mapConsent = document.getElementById('mapConsent');
const mapConsentBtn = document.getElementById('mapConsentBtn');
const mapReset = document.getElementById('mapReset');

function loadMap() {
  if (mapFrame.querySelector('iframe')) return;
  const iframe = document.createElement('iframe');
  iframe.src = MAPS_SRC;
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.title = 'Mappa: Paulette {intimamente}, Via Mazzini 42, Dolo (VE)';
  mapFrame.appendChild(iframe);
  mapConsent.classList.add('is-hidden');
  setTimeout(() => mapConsent.remove(), 400);
}

if (localStorage.getItem(MAPS_CONSENT_KEY) === 'true') {
  loadMap();
}

mapConsentBtn.addEventListener('click', () => {
  localStorage.setItem(MAPS_CONSENT_KEY, 'true');
  loadMap();
});

mapReset.addEventListener('click', () => {
  localStorage.removeItem(MAPS_CONSENT_KEY);
  const existingIframe = mapFrame.querySelector('iframe');
  if (existingIframe) existingIframe.remove();
  if (!document.getElementById('mapConsent')) {
    mapFrame.insertAdjacentHTML('afterbegin', `
      <div class="map-consent" id="mapConsent">
        <svg class="map-consent-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M24 44s14-13.6 14-24a14 14 0 1 0-28 0c0 10.4 14 24 14 24Z"/>
          <circle cx="24" cy="20" r="5"/>
        </svg>
        <p>Qui sotto puoi caricare la mappa di Google Maps. Il servizio utilizza cookie di terze parti per funzionare.</p>
        <button class="btn btn-solid" id="mapConsentBtn" type="button">Accetta e mostra la mappa</button>
      </div>
    `);
    document.getElementById('mapConsentBtn').addEventListener('click', () => {
      localStorage.setItem(MAPS_CONSENT_KEY, 'true');
      loadMap();
    });
  }
});

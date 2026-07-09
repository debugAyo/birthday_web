/* =============================================================
   SCRIPT.JS — Birthday Surprise Site
   All configurable values are at the top.
   ============================================================= */

/* ---- ✦ CUSTOMIZATION: Edit these values ---- */

// ✦ CHANGE: Recipient name (used in typewriter and greeting)
const RECIPIENT_NAME = 'Precious Mosunmola Oni';

// ✦ CHANGE: Birthday date in ISO format (YYYY-MM-DD)
const BIRTHDAY_DATE = '2026-12-25';

// ✦ CHANGE: Typewriter greeting (the main birthday line)
const TYPEWRITER_TEXT = `Happy Birthday, ${RECIPIENT_NAME.split(' ')[0]}!`;

// Animation speeds
const TYPEWRITER_SPEED = 80;       // ms per character
const CONFETTI_COUNT = 180;        // number of particles
const BALLOON_COUNT = 8;           // number of balloons

// Colors matching the palette
const CONFETTI_COLORS = [
  '#D4A0B0', '#E8D5B7', '#D4C5E2', '#F5D6D0',
  '#B8D4B8', '#C5E0E8', '#E8C5D0', '#F0EAE8'
];

const BALLOON_COLORS = [
  '#D4A0B0', '#D4C5E2', '#C5E0E8', '#E8D5B7',
  '#B8D4B8', '#F5D6D0', '#E8C5D0', '#C5D4E8'
];

/* =============================================================
   DOM REFERENCES
   ============================================================= */
const html         = document.documentElement;
const themeToggle  = document.getElementById('themeToggle');
const sectionNav   = document.getElementById('sectionNav');
const navDots      = document.querySelectorAll('.nav-dot');
const sections     = document.querySelectorAll('.section');
const envelope     = document.getElementById('envelope');
const revealHint   = document.getElementById('revealHint');
const particlesW   = document.getElementById('particlesWrapper');
const countdownEl  = document.getElementById('countdownTimer');
const letterPars   = document.querySelectorAll('.letter-paragraph');
const memoryCards  = document.querySelectorAll('.memory-card');
const revealCont   = document.querySelector('.reveal-container');
const letterCard   = document.querySelector('.letter-card');
const canvas       = document.getElementById('confettiCanvas');
const balloonsC    = document.getElementById('balloonsContainer');
const typewriterEl = document.getElementById('typewriterText');
const sparkleBurstEl = document.getElementById('sparkleBurst');

/* =============================================================
   1. THEME TOGGLE
   ============================================================= */
function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('birthday-theme', theme);
  updateThemeMeta(theme);
}

function updateThemeMeta(theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.content = theme === 'dark' ? '#1A1418' : '#FDF6F0';
  }
}

// Load saved theme or default to light
const savedTheme = localStorage.getItem('birthday-theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* =============================================================
   2. FLOATING PARTICLES (Welcome Section)
   ============================================================= */
function createParticles() {
  const count = Math.min(30, Math.floor(window.innerWidth / 30));
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 3 + Math.random() * 7;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = (40 + Math.random() * 50) + '%';
    p.style.setProperty('--p-opacity', (0.08 + Math.random() * 0.2).toFixed(3));
    p.style.setProperty('--p-drift-x', (20 + Math.random() * 80) + 'px');
    p.style.setProperty('--p-drift-y', (-80 - Math.random() * 150) + 'px');
    p.style.animationDuration = (12 + Math.random() * 18) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';

    // Occasional sparkle particle
    if (i % 5 === 0) {
      p.style.background = 'transparent';
      p.style.boxShadow = '0 0 6px 2px rgba(212, 160, 176, 0.3)';
      p.style.border = '1px solid rgba(212, 160, 176, 0.4)';
    }

    particlesW.appendChild(p);
  }
}
createParticles();

/* =============================================================
   3. COUNTDOWN TIMER
   ============================================================= */
function updateCountdown() {
  const target = new Date(BIRTHDAY_DATE + 'T23:59:59');
  const now    = new Date();

  // Reset time parts to compare dates only
  const today     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffTime  = target.getTime() - now.getTime();

  if (diffTime <= 0 && today.getTime() === targetDay.getTime()) {
    countdownEl.textContent = 'Today is the day! \u{1F389}';
    return;
  }

  if (diffTime <= 0) {
    countdownEl.textContent = 'Celebrating you! \u{1F389}';
    return;
  }

  const days  = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diffTime % (1000 * 60)) / 1000);

  countdownEl.textContent =
    `${days}d ${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* =============================================================
   4. ENVELOPE INTERACTION
   ============================================================= */
let envelopeOpened = false;

function createSparkleBurst() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!sparkleBurstEl) return;

  const count = 16;
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    const angle = (i / count) * Math.PI * 2;
    const dist = 60 + Math.random() * 80;
    sparkle.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
    sparkle.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
    sparkle.style.animationDelay = Math.random() * 0.15 + 's';
    sparkle.style.width = (3 + Math.random() * 5) + 'px';
    sparkle.style.height = sparkle.style.width;
    // Some sparkles are star shapes (square with rotation), some circles
    if (i % 3 === 0) {
      sparkle.style.borderRadius = '2px';
      sparkle.style.background = '#fff';
    }
    sparkleBurstEl.appendChild(sparkle);
  }

  // Clean up sparkles after animation
  setTimeout(() => {
    sparkleBurstEl.innerHTML = '';
  }, 2000);
}

function typePoemLine(el, text, speed, callback) {
  el.textContent = '';
  el.classList.add('active');
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  el.appendChild(cursor);

  const interval = setInterval(() => {
    if (i < text.length) {
      cursor.before(text.charAt(i));
      i++;
    } else {
      clearInterval(interval);
      cursor.remove();
      if (callback) callback();
    }
  }, speed);
}

function typePoemBlock(lines, speeds, delayBetweenLines, doneCallback) {
  let index = 0;

  function typeNext() {
    if (index >= lines.length) {
      if (doneCallback) doneCallback();
      return;
    }
    const el = lines[index];
    const text = el.getAttribute('data-text') || '';
    const speed = speeds[index] || 100;
    typePoemLine(el, text, speed, () => {
      index++;
      setTimeout(typeNext, delayBetweenLines);
    });
  }

  typeNext();
}

function showPoemTextImmediately(container) {
  container.querySelectorAll('[data-text]').forEach(el => {
    el.textContent = el.getAttribute('data-text') || '';
    el.classList.add('active');
  });
}

function revealLetterAndPoems(afterEnvelopePoemDone) {
  const letterSection = document.getElementById('letter');
  letterSection.removeAttribute('aria-hidden');

  requestAnimationFrame(() => {
    if (letterCard) letterCard.classList.add('is-visible');
    letterPars.forEach((p, i) => {
      setTimeout(() => p.classList.add('is-visible'), i * 200);
    });

    // After letter card is visible, type the two letter poems
    setTimeout(() => {
      const poemBlocks = letterSection.querySelectorAll('.poem-block');
      if (!poemBlocks.length) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        poemBlocks.forEach(b => showPoemTextImmediately(b));
        return;
      }

      let blockIndex = 0;
      function typeNextPoemBlock() {
        if (blockIndex >= poemBlocks.length) {
          // Scroll to letter section after all poems are typed
          letterSection.scrollIntoView({ behavior: 'smooth' });
          return;
        }

        const block = poemBlocks[blockIndex];
        const lines = block.querySelectorAll('.poem-block-line, .poem-block-attribution');
        const speeds = Array(lines.length).fill(65);
        if (lines.length > 0) speeds[lines.length - 1] = 80; // attribution slower

        typePoemBlock(lines, speeds, 1800, () => {
          blockIndex++;
          setTimeout(typeNextPoemBlock, 3000);
        });
      }

      typeNextPoemBlock();
    }, 600);
  });
}

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  envelope.classList.add('is-open');
  revealHint.textContent = '';
  createSparkleBurst();

  // --- POEM 1: Type the envelope poem line by line ---
  const poemLines = document.querySelectorAll('.env-poem-line, .env-poem-attribution');
  if (!poemLines.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showPoemTextImmediately(document.querySelector('.envelope-poem'));
    // Still reveal letter after a short delay
    setTimeout(() => revealLetterAndPoems(), 1000);
    return;
  }

  const speeds = [90, 90, 90, 90, 70]; // 90ms per char for lines, 70 for attribution

  typePoemBlock(poemLines, speeds, 2000, () => {
    // --- POEM 1 done → after a pause, reveal letter + POEMS 2 & 3 ---
    setTimeout(() => revealLetterAndPoems(), 2000);
  });
}

envelope.addEventListener('click', openEnvelope);
envelope.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openEnvelope();
  }
});

/* =============================================================
   5. INTERSECTION OBSERVER — Section Reveals
   ============================================================= */
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const el = entry.target;

    if (entry.isIntersecting) {
      // Reveal container (envelope section)
      if (el.classList.contains('reveal-container')) {
        el.classList.add('is-visible');
      }

      // Letter card
      if (el.classList.contains('letter-card')) {
        el.classList.add('is-visible');
      }

      // Letter paragraphs (staggered)
      if (el.classList.contains('letter-paragraph')) {
        // Delay each paragraph slightly
        const index = Array.from(letterPars).indexOf(el);
        setTimeout(() => el.classList.add('is-visible'), index * 200);
      }

      // Memory cards (staggered via CSS)
      if (el.classList.contains('memory-card')) {
        el.classList.add('is-visible');
      }

      // Celebration section — trigger confetti + balloons once
      if (el.id === 'celebration') {
        if (!window._celebrationStarted) {
          window._celebrationStarted = true;
          startConfetti();
          createBalloons();
          startTypewriter();
        }
      }
    }
  });
}, observerOptions);

// Observe elements
if (revealCont) observer.observe(revealCont);
if (letterCard) observer.observe(letterCard);
letterPars.forEach(p => observer.observe(p));
memoryCards.forEach(card => observer.observe(card));
observer.observe(document.getElementById('celebration'));

/* =============================================================
   6. CONFETTI (Canvas)
   ============================================================= */
let confettiRunning = false;
let confettiParticles = [];
let confettiRAF = null;

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width  = rect.width;
  canvas.height = rect.height;
}

function startConfetti() {
  if (confettiRunning) return;

  // Check reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  confettiRunning = true;
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const cx = canvas.width / 2;
  const cy = canvas.height * 0.3;

    const shapes = ['rect', 'circle', 'heart'];
  confettiParticles = [];
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const angle    = Math.random() * Math.PI * 2;
    const speed    = 3 + Math.random() * 8;
    const burstRad = Math.random() * 120;
    confettiParticles.push({
      x: cx + Math.cos(angle) * burstRad,
      y: cy + Math.sin(angle) * burstRad * 0.6,
      vx: Math.cos(angle) * speed * (0.4 + Math.random() * 0.6),
      vy: Math.sin(angle) * speed * (0.4 + Math.random() * 0.6) - 4,
      size: 5 + Math.random() * 6,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      gravity: 0.2 + Math.random() * 0.15,
      wind: (Math.random() - 0.5) * 0.3
    });
  }

  animateConfetti();
}

function animateConfetti() {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let alive = false;

  confettiParticles.forEach(p => {
    p.vy += p.gravity;
    p.vx += p.wind;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotSpeed;

    // Fade after some time
    if (p.y > canvas.height * 0.6) {
      p.opacity = Math.max(0, p.opacity - 0.008);
    }

    if (p.opacity <= 0 || p.y > canvas.height + 50) {
      return; // skip drawing
    }

    alive = true;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;

    if (p.shape === 'rect') {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    } else if (p.shape === 'heart') {
      const s = p.size / 2;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.6);
      ctx.bezierCurveTo(-s * 1.2, -s * 0.2, -s * 0.6, -s * 0.9, 0, -s * 0.4);
      ctx.bezierCurveTo(s * 0.6, -s * 0.9, s * 1.2, -s * 0.2, 0, s * 0.6);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });

  if (alive) {
    confettiRAF = requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* =============================================================
   7. BALLOONS
   ============================================================= */
function createBalloons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const count = Math.min(BALLOON_COUNT, BALLOON_COLORS.length);

  for (let i = 0; i < count; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = (8 + Math.random() * 78) + '%';
    balloon.style.backgroundColor = BALLOON_COLORS[i];
    balloon.style.color = BALLOON_COLORS[i];
    balloon.style.setProperty('--balloon-sway', ((Math.random() - 0.5) * 12).toFixed(1) + 'deg');
    balloon.style.animationDuration = (10 + Math.random() * 8) + 's';
    balloon.style.animationDelay = (Math.random() * 4) + 's';
    balloon.style.transform = `scale(${0.5 + Math.random() * 0.7})`;

    // String
    const string = document.createElement('div');
    string.className = 'balloon-string';
    balloon.appendChild(string);

    balloonsC.appendChild(balloon);
  }
}

/* =============================================================
   8. TYPEWRITER EFFECT
   ============================================================= */
function startTypewriter() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typewriterEl.textContent = TYPEWRITER_TEXT;
    typewriterEl.classList.add('done');
    return;
  }

  typewriterEl.textContent = '';
  let index = 0;

  const interval = setInterval(() => {
    if (index < TYPEWRITER_TEXT.length) {
      typewriterEl.textContent += TYPEWRITER_TEXT.charAt(index);
      index++;
    } else {
      clearInterval(interval);
      typewriterEl.classList.add('done');
    }
  }, TYPEWRITER_SPEED);
}

/* =============================================================
   9. NAVIGATION DOTS — Active Section Tracking
   ============================================================= */
function updateActiveDot() {
  const scrollY = window.scrollY + window.innerHeight * 0.4;

  let activeIndex = 0;
  sections.forEach((section, i) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      activeIndex = i;
    }
  });

  navDots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === activeIndex);
  });
}

// Throttled scroll handler
let scrollTick = false;
window.addEventListener('scroll', () => {
  if (!scrollTick) {
    requestAnimationFrame(() => {
      updateActiveDot();
      scrollTick = false;
    });
    scrollTick = true;
  }
});

// Dot click — scroll to section
navDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.getAttribute('data-index'));
    sections[index].scrollIntoView({ behavior: 'smooth' });
  });
});

/* =============================================================
   10. RESIZE HANDLER (for canvas)
   ============================================================= */
window.addEventListener('resize', () => {
  if (confettiRunning) {
    resizeCanvas();
  }
});

/* =============================================================
   11. INIT — Set initial dot state
   ============================================================= */
updateActiveDot();

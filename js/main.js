/* =========================================================
   VD Brother Projects - Main JS
   Handles: mobile nav, scroll header, counters, reveal,
            back-to-top, contact form mock submit, footer year
   ========================================================= */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initScrollHeader();
    initBackToTop();
    initRevealOnScroll();
    initCounters();
    initContactForm();
    initFooterYear();
    initActiveNavLink();
    initBackgroundVideos();
  });

  /* ---------- Background videos ----------
     1. Check if a local override (data-local-src) exists. If yes, use it.
        Otherwise keep the remote CDN <source> already in HTML.
     2. Force autoplay (some browsers block autoplay even on muted videos).
     3. Log diagnostics so issues are easy to debug from DevTools.
  ---------------------------------------------------------------------- */
  function initBackgroundVideos() {
    const videos = document.querySelectorAll('video.bg-video');
    if (!videos.length) return;

    console.log('[VDBP] Found', videos.length, 'background video(s) to initialise');

    videos.forEach(function (video, idx) {
      const tag = '[VDBP video #' + idx + ']';

      video.muted = true;
      video.playsInline = true;
      video.loop = true;

      const currentSrc = function () {
        const s = video.querySelector('source');
        return s ? s.src : '(none)';
      };

      video.addEventListener('loadeddata', function () {
        console.log(tag, 'loadeddata OK -', currentSrc());
      });

      video.addEventListener('playing', function () {
        console.log(tag, 'PLAYING ✓');
      });

      video.addEventListener('error', function () {
        const err = video.error;
        console.warn(tag, 'video element error', err && err.code, err && err.message);
      });

      Array.prototype.forEach.call(video.querySelectorAll('source'), function (s) {
        s.addEventListener('error', function () {
          console.warn(tag, 'source FAILED to load:', s.src);
        });
      });

      const tryPlay = function () {
        const p = video.play();
        if (p && typeof p.catch === 'function') {
          p.catch(function (e) {
            console.warn(tag, 'autoplay blocked:', e && e.name, '- will retry on user interaction');
          });
        }
      };

      const wireAutoplay = function () {
        if (video.readyState >= 2) {
          tryPlay();
        } else {
          video.addEventListener('loadeddata', tryPlay, { once: true });
          video.addEventListener('canplay', tryPlay, { once: true });
        }

        const onFirstInteraction = function () {
          tryPlay();
          document.removeEventListener('click', onFirstInteraction);
          document.removeEventListener('scroll', onFirstInteraction);
        };
        document.addEventListener('click', onFirstInteraction, { once: true });
        document.addEventListener('scroll', onFirstInteraction, { once: true, passive: true });
      };

      const baseSrc = video.dataset.localSrc;

      const mimeFromExt = function (path) {
        const lower = path.toLowerCase();
        if (lower.endsWith('.webm')) return 'video/webm';
        if (lower.endsWith('.ogv') || lower.endsWith('.ogg')) return 'video/ogg';
        if (lower.endsWith('.mov')) return 'video/quicktime';
        return 'video/mp4';
      };

      const tryLocalCandidate = function (candidates, index) {
        if (index >= candidates.length) {
          console.log(tag, 'No local file found - using remote CDN:', currentSrc());
          wireAutoplay();
          return;
        }
        const candidate = candidates[index];
        fetch(candidate, { method: 'HEAD' })
          .then(function (res) {
            const len = parseInt(res.headers.get('content-length') || '0', 10);
            if (res.ok && len > 1000) {
              console.log(tag, 'Local override found:', candidate, '(' + len + ' bytes)');
              const localSource = document.createElement('source');
              localSource.src = candidate;
              localSource.type = mimeFromExt(candidate);
              video.insertBefore(localSource, video.firstChild);
              video.load();
              wireAutoplay();
            } else {
              tryLocalCandidate(candidates, index + 1);
            }
          })
          .catch(function () {
            tryLocalCandidate(candidates, index + 1);
          });
      };

      if (baseSrc) {
        const base = baseSrc.replace(/\.[a-z0-9]+$/i, '');
        const candidates = [
          baseSrc,
          base + '.mp4',
          base + '.webm',
          base + '.mov',
          base + '.ogv'
        ].filter(function (v, i, a) { return a.indexOf(v) === i; });
        tryLocalCandidate(candidates, 0);
      } else {
        wireAutoplay();
      }
    });
  }

  /* ---------- Mobile navigation toggle ---------- */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        menu.classList.remove('active');
      });
    });
  }

  /* ---------- Header background change on scroll ---------- */
  function initScrollHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const onScroll = function () {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Back-to-top button ---------- */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    const toggle = function () {
      if (window.scrollY > 400) btn.classList.add('show');
      else btn.classList.remove('show');
    };

    window.addEventListener('scroll', toggle, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggle();
  }

  /* ---------- Reveal-on-scroll using IntersectionObserver ---------- */
  function initRevealOnScroll() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length || !('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Animated counter for stats ---------- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute('data-count') + (el.dataset.suffix || '');
      });
      return;
    }

    const animate = function (el) {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      const tick = function (now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Contact form (mock client-side submit) ---------- */
  function initContactForm() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;
    const status = form.querySelector('.form-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value.trim();
      if (!name) return;

      if (status) {
        status.classList.add('show', 'success');
        status.textContent =
          'Thanks ' + name + '! Your enquiry has been recorded. We\'ll get back to you shortly.';
      }
      form.reset();

      setTimeout(function () {
        if (status) status.classList.remove('show');
      }, 6000);
    });
  }

  /* ---------- Auto-update footer year ---------- */
  function initFooterYear() {
    const el = document.querySelector('[data-year]');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Highlight active nav link based on page ---------- */
  function initActiveNavLink() {
    const links = document.querySelectorAll('.nav-menu a');
    if (!links.length) return;

    let current = window.location.pathname.split('/').pop();
    if (!current || current === '') current = 'index.html';

    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      if (href === current) link.classList.add('active');
    });
  }
})();

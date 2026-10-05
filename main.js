/* Mgr. Denisa Hanáková — advokátka
   Progressive enhancement only: the page is fully usable without this file. */

(function () {
  'use strict';

  var DESKTOP_QUERY = '(min-width: 900px)';
  var LABEL_OPEN = 'Otevřít menu';
  var LABEL_CLOSE = 'Zavřít menu';

  function prefersReducedMotion() {
    return typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initYear() {
    var el = document.getElementById('year');
    if (!el) return;
    el.textContent = String(new Date().getFullYear());
  }

  function initHeaderScroll() {
    var header = document.getElementById('siteHeader');
    if (!header) return;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function initNav() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('primaryNav');
    if (!toggle || !nav) return;

    var desktop = typeof window.matchMedia === 'function'
      ? window.matchMedia(DESKTOP_QUERY)
      : null;

    function isOpen() {
      return nav.classList.contains('is-open');
    }

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? LABEL_CLOSE : LABEL_OPEN);
    }

    toggle.addEventListener('click', function () {
      setOpen(!isOpen());
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    if (desktop) {
      var onChange = function (event) {
        if (event.matches) setOpen(false);
      };
      if (typeof desktop.addEventListener === 'function') {
        desktop.addEventListener('change', onChange);
      } else if (typeof desktop.addListener === 'function') {
        desktop.addListener(onChange);
      }
    }
  }

  function initScrollSpy() {
    var links = document.querySelectorAll('.nav-list a');
    var sections = document.querySelectorAll('main section[id]');
    if (!links.length || !sections.length) return;

    if (typeof window.IntersectionObserver !== 'function') return;

    function activate(id) {
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var active = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', active);
        if (active) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      }
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) activate(entries[i].target.id);
      }
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    for (var i = 0; i < sections.length; i++) observer.observe(sections[i]);
  }

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    function showAll() {
      for (var i = 0; i < items.length; i++) items[i].classList.add('is-visible');
    }

    if (prefersReducedMotion() || typeof window.IntersectionObserver !== 'function') {
      showAll();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('is-visible');
          observer.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.15 });

    for (var i = 0; i < items.length; i++) observer.observe(items[i]);
  }

  function init() {
    initYear();
    initHeaderScroll();
    initNav();
    initScrollSpy();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('navMenu');
  const toggle = document.querySelector('.mobile-toggle');
  const header = document.querySelector('.header-nav');

  // Mobile navigation
  if (nav && toggle) {
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.setAttribute('aria-controls', 'navMenu');
    toggle.setAttribute('aria-expanded', 'false');

    function closeMenu() {
      nav.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="fa fa-bars" aria-hidden="true"></i>';
      document.querySelectorAll('.has-dropdown.open').forEach(function (item) {
        item.classList.remove('open');
      });
    }

    function toggleMenu() {
      const open = !nav.classList.contains('show');
      nav.classList.toggle('show', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.innerHTML = open
        ? '<i class="fa fa-times" aria-hidden="true"></i>'
        : '<i class="fa fa-bars" aria-hidden="true"></i>';
    }

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const parent = link.parentElement;
        const dropdown = parent && parent.querySelector('.dropdown-menu');
        if (window.innerWidth <= 900 && dropdown && parent.classList.contains('has-dropdown')) {
          e.preventDefault();
          parent.classList.toggle('open');
          return;
        }
        if (window.innerWidth <= 900) closeMenu();
      });
    });

    document.addEventListener('click', function (e) {
      if (window.innerWidth <= 900 && nav.classList.contains('show') &&
          !nav.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  // Header shadow
  function updateHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // FAQ accordion - works with the existing HTML structure on the site.
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const children = item.children;
    if (children.length < 2) return;

    const question = children[0];
    const answer = children[1];
    question.classList.add('faq-question');
    answer.classList.add('faq-answer');

    const icon = question.querySelector('i');
    if (icon) icon.className = 'fa fa-plus faq-icon';

    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');
    question.setAttribute('aria-expanded', 'false');

    function setOpen(open) {
      item.classList.toggle('is-open', open);
      question.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (icon) icon.className = open ? 'fa fa-minus faq-icon' : 'fa fa-plus faq-icon';
    }

    question.addEventListener('click', function () {
      const shouldOpen = !item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function (other) {
        if (other !== item) {
          const q = other.querySelector('.faq-question');
          const i = other.querySelector('.faq-icon');
          other.classList.remove('is-open');
          if (q) q.setAttribute('aria-expanded', 'false');
          if (i) i.className = 'fa fa-plus faq-icon';
        }
      });
      setOpen(shouldOpen);
    });

    question.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });

  // Scroll reveal without hiding content if JS/observer is unavailable.
  const revealTargets = document.querySelectorAll(
    '.curved-card, .achieve-box, .community-grid, .faq-item, section > .container > div, footer .footer-grid'
  );
  revealTargets.forEach(function (el) { el.classList.add('site-reveal'); });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.site-reveal').forEach(function (el) { observer.observe(el); });
  } else {
    document.querySelectorAll('.site-reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }
});


/* Skill Orbit hero content slider */
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".hero-slider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".hero-slide"));
  const dots = Array.from(slider.querySelectorAll(".hero-dot"));
  const prev = slider.querySelector(".hero-prev");
  const next = slider.querySelector(".hero-next");
  if (!slides.length) return;

  let current = 0;
  let timer;
  const delay = 5000;

  function showHero(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
  }

  function startHeroAuto() {
    clearInterval(timer);
    timer = setInterval(() => showHero(current + 1), delay);
  }

  function resetHeroAuto() {
    startHeroAuto();
  }

  showHero(0);

  if (next) next.addEventListener("click", function () {
    showHero(current + 1);
    resetHeroAuto();
  });

  if (prev) prev.addEventListener("click", function () {
    showHero(current - 1);
    resetHeroAuto();
  });

  dots.forEach((dot, i) => dot.addEventListener("click", function () {
    showHero(i);
    resetHeroAuto();
  }));

  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", startHeroAuto);

  let startX = 0;
  slider.addEventListener("touchstart", e => {
    startX = e.changedTouches[0].clientX;
    clearInterval(timer);
  }, {passive:true});

  slider.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const distance = endX - startX;
    if (Math.abs(distance) > 45) {
      showHero(distance < 0 ? current + 1 : current - 1);
    }
    startHeroAuto();
  }, {passive:true});

  startHeroAuto();
});

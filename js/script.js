document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile nav toggle */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (el) { el.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* Demo forms */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Thank you';
      setTimeout(function () { btn.textContent = original; form.reset(); }, 2200);
    });
  });

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* Animated counters */
  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    var animateCount = function (el) {
      var target = parseFloat(el.getAttribute('data-counter'));
      var duration = 1400;
      var start = null;
      var numEl = el.querySelector('.count-value');
      if (reduceMotion) { numEl.textContent = target; return; }
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        numEl.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else numEl.textContent = target;
      }
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { animateCount(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(animateCount);
    }
  }

  /* Cursor glow — follows pointer within sections that opt in */
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.glow-zone').forEach(function (zone) {
      var glow = document.createElement('div');
      glow.className = 'cursor-glow';
      glow.style.opacity = '0';
      zone.appendChild(glow);
      zone.addEventListener('mousemove', function (e) {
        var rect = zone.getBoundingClientRect();
        glow.style.left = (e.clientX - rect.left) + 'px';
        glow.style.top = (e.clientY - rect.top) + 'px';
        glow.style.opacity = '1';
      });
      zone.addEventListener('mouseleave', function () { glow.style.opacity = '0'; });
    });

    /* Gentle parallax on floating hero cards */
    var visual = document.querySelector('.hero-visual');
    if (visual) {
      var cards = visual.querySelectorAll('.float-card');
      visual.addEventListener('mousemove', function (e) {
        var rect = visual.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        cards.forEach(function (card, i) {
          var depth = (i + 1) * 6;
          card.style.transform = 'translate(' + (x * depth) + 'px,' + (y * depth) + 'px)';
        });
      });
      visual.addEventListener('mouseleave', function () {
        cards.forEach(function (card) { card.style.transform = ''; });
      });
    }
  }
});

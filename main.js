/* ============================================================
   Portfolio interactions — no dependencies
   ============================================================ */
(function () {
  'use strict';

  /* ---- year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- theme toggle (persists) ---- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) {}
  if (stored) root.setAttribute('data-theme', stored);

  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---- nav shadow on scroll ---- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (window.scrollY > 8) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  var burger = document.getElementById('navToggle');
  var links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- scroll reveal ---- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = document.querySelectorAll(
    '.section-title, .about__body, .chain__step, .card, .tl, .skillset, .contact__title, .chain__intro'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- animated stat counters ---- */
  var counters = document.querySelectorAll('.stat__num[data-count]');
  var animateCount = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = prefix + target + suffix; return; }
    var dur = 1100, start = null;
    var step = function (t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---- lightweight CV: generate a printable page on demand ----
     Keeps the repo free of binaries. Clicking "Download CV" opens a
     clean, print-to-PDF resume built from the same source of truth. */
  var resumeLinks = document.querySelectorAll('[data-resume]');
  resumeLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      openResume();
    });
  });

  function openResume() {
    var w = window.open('', '_blank');
    if (!w) return;
    w.document.write(RESUME_HTML);
    w.document.close();
  }

  var RESUME_HTML = [
    '<!doctype html><html lang="en-AU"><head><meta charset="utf-8">',
    '<title>Akhilesh Kumar Singh — CV</title>',
    '<style>',
    'body{font:14px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:#14181f;max-width:800px;margin:40px auto;padding:0 24px}',
    'h1{font-size:26px;margin:0}h2{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#F26522;border-bottom:1px solid #ddd;padding-bottom:4px;margin:26px 0 12px}',
    'h3{font-size:15px;margin:14px 0 2px}.muted{color:#556}.row{display:flex;justify-content:space-between;gap:12px}',
    'ul{margin:6px 0 0;padding-left:18px}li{margin:3px 0}.top{color:#556;font-size:13px;margin:6px 0 0}',
    '@media print{body{margin:0}button{display:none}}',
    'button{background:#F26522;color:#fff;border:0;padding:10px 18px;border-radius:8px;font-size:14px;cursor:pointer;margin:20px 0}',
    '</style></head><body>',
    '<button onclick="window.print()">Save as PDF</button>',
    '<h1>Akhilesh Kumar Singh</h1>',
    '<p class="top">Maintenance &amp; Assurance Engineer — ITS &amp; Tolling · Brisbane, QLD · +61 478 504 321 · akhi.singh1989@gmail.com<br>linkedin.com/in/akhilesh-kumar-singh-23115836 · github.com/SINGHL25 · Full work rights (482, to Feb 2028)</p>',
    '<h2>Summary</h2><p>Maintenance engineer with 14+ years across intelligent transport systems, tolling, EV charging and electrical infrastructure. Deliver maintenance assurance for tolling networks across VIC, QLD and NZ, keeping revenue-critical road assets available 24/7. 80% reduction in field complaints at Tritium; ~30% cut in manual fault-analysis effort through Python automation. Combines HV/LV electrical depth with applied AI/ML and cloud/DevOps.</p>',
    '<h2>Experience</h2>',
    '<div class="row"><h3>Maintenance Specialist — ITS &amp; Tolling · Kapsch TrafficCom</h3><span class="muted">Jan 2024 – Present</span></div>',
    '<ul><li>Maintenance assurance for tolling infrastructure across West Gate Tunnel, Gateway/Logan Motorways and NZ networks — 9+ tolling points, 24/7 availability.</li>',
    '<li>Power BI &amp; Python analytics over billions of passage/classification records; ~30% cut in manual log analysis.</li>',
    '<li>RCA on equipment/system anomalies (Maximo, Splunk, EVA, Glide); technical direction to field crews; back-office transaction validation.</li></ul>',
    '<div class="row"><h3>Technical Support Engineer — EV Charging · Tritium</h3><span class="muted">Aug 2023 – Jan 2024</span></div>',
    '<ul><li>Global L2/L3 support for 50–175 kW DC fast chargers; Wireshark/Grafana diagnostics; documentation improving first-time-fix.</li></ul>',
    '<div class="row"><h3>Quality Inspector — EV Charger Systems · Tritium</h3><span class="muted">Dec 2021 – Jul 2023</span></div>',
    '<ul><li>Owned CS3 quality work package — 80% reduction in field complaints via layered process audits and corrective action.</li></ul>',
    '<div class="row"><h3>Electrical Engineering &amp; Founder roles · India</h3><span class="muted">2012 – 2021</span></div>',
    '<ul><li>33/11 kV substations, HV/LV, HVAC and fire systems on high-rise and township projects; then co-founded and ran two ventures (P&amp;L, operations, procurement).</li></ul>',
    '<h2>Selected builds</h2><ul>',
    '<li><b>RoadAid AI</b> — computer vision (OpenCV/CNN) for real-time road incident detection.</li>',
    '<li><b>DocSage AI</b> — LangChain assistant that reads SOP/O&amp;M documents and answers technical questions.</li>',
    '<li><b>Tolling log analyser</b> — Python parsing and anomaly detection across tolling logs.</li></ul>',
    '<h2>Skills</h2><p>MLFF · GNSS tolling · ANPR · DSRC · C-ITS · back office · IBM Maximo · Splunk · Power BI · RCA · Python · ML/CNN · OpenCV · LangChain · Docker/Kubernetes · Azure · AWS · 33/11 kV · HV/LV · EV DC fast charging.</p>',
    '<h2>Education</h2><p>Executive MBA (Finance), IIM Calcutta, 2015 · B.Tech Electrical Engineering, UPTU, 2012 · Lean Six Sigma Green Belt.</p>',
    '</body></html>'
  ].join('');
})();

/* ============================================================
   SHARED SCRIPTS — used by every page on the site.
   Handles:
     1. Static-canopy mode (perf): freezes the hero canopy
        animation on mobile, slow connections, save-data, and
        when the user has reduced-motion / reduced-data preferences.
     2. Hamburger nav toggle + X-animation state sync.
   Loaded with `defer` so it runs after the DOM is parsed.
   ============================================================ */

  /* ----------------------------------------------------------
     STATIC-CANOPY MODE
     ----------------------------------------------------------
     The hero canopy uses an SVG <filter> chain (feTurbulence +
     feDisplacementMap, driven by SMIL <animate> elements) that
     runs every frame. It's beautiful on a desktop but EXPENSIVE
     — on mobile GPUs and slower devices it can drop the page to
     single-digit framerates. There's also a real data cost on
     slow connections (large SVG, lots of layout/paint work).

     Strategy: if the device looks resource-constrained, we
       (a) add `static-canopy` to <body> so CSS can pause the
           drift/breathe animations on the light spots, and
       (b) walk the canopy SVG and:
             - remove the `filter="url(#canopy-displace)"` from
               the masked group, so the displacement pass stops
               running on every frame, and
             - remove the SMIL <animate> elements driving the
               offset, so SMIL stops ticking.

     The canopy still RENDERS — silhouette, gradient, spots —
     it just stops moving. The scene reads as a still painting
     instead of a live one.
  ---------------------------------------------------------- */
  (function setupCanopyMode() {
    // Conditions that trigger static mode. Any one is enough.
    function shouldFreezeCanopy() {
      // 1. User has asked for reduced motion. Always honor this.
      try {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
      } catch (_) { /* matchMedia not supported — skip */ }

      // 2. User has asked for reduced data (lite mode, etc.).
      try {
        if (window.matchMedia('(prefers-reduced-data: reduce)').matches) return true;
      } catch (_) { /* not supported — skip */ }

      // 3. Network Information API: slow effective connection or
      //    explicit save-data flag. Not supported on every browser
      //    (notably Safari), so guard everything.
      var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn) {
        if (conn.saveData === true) return true;
        var eff = conn.effectiveType;
        if (eff === 'slow-2g' || eff === '2g' || eff === '3g') return true;
      }

      // 4. Mobile-ish device. Use a couple of signals so we don't
      //    rely on a single brittle one:
      //      - viewport width is narrow, OR
      //      - the primary pointer is coarse (touch) AND there's
      //        no hover capability (so it's almost certainly not
      //        a laptop with a touchscreen).
      try {
        var narrow = window.matchMedia('(max-width: 820px)').matches;
        var coarseNoHover = window.matchMedia('(pointer: coarse)').matches &&
                            window.matchMedia('(hover: none)').matches;
        if (narrow || coarseNoHover) return true;
      } catch (_) { /* fall through */ }

      return false;
    }

    function freezeCanopy() {
      document.body.classList.add('static-canopy');

      // Find the canopy SVG. It's only on the home page, so bail
      // quietly on other pages.
      var canopy = document.querySelector('.canopy-scene');
      if (!canopy) return;

      // Strip the animated displacement filter off the mask's
      // silhouette group. That filter is the single biggest cost.
      // The mask still works — the silhouette just stops bending.
      var displaced = canopy.querySelectorAll('[filter="url(#canopy-displace)"]');
      displaced.forEach(function (el) { el.removeAttribute('filter'); });

      // Stop SMIL ticking by removing the <animate> elements
      // inside the displacement filter. Belt-and-suspenders with
      // the above — even if a browser keeps animating an unused
      // filter, this kills the work outright.
      var animates = canopy.querySelectorAll('animate, animateTransform');
      animates.forEach(function (el) { el.remove(); });
    }

    if (shouldFreezeCanopy()) {
      freezeCanopy();
    }

    // Also react if the user's connection changes mid-session
    // (e.g. switches from wifi to cellular). One-way: once frozen,
    // stay frozen — re-enabling mid-scroll would be jarring.
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && typeof conn.addEventListener === 'function') {
      conn.addEventListener('change', function () {
        if (!document.body.classList.contains('static-canopy') && shouldFreezeCanopy()) {
          freezeCanopy();
        }
      });
    }
  })();

  /* ----------------------------------------------------------
     HAMBURGER NAV TOGGLE
  ---------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    // Also toggle the toggle button state for the X animation
    toggle.classList.toggle('open');
  });

  // When nav.open, animate the hamburger to X
  const observer = new MutationObserver(() => {
    if (nav.classList.contains('open')) {
      toggle.classList.add('open');
    } else {
      toggle.classList.remove('open');
    }
  });
  observer.observe(nav, { attributes: true, attributeFilter: ['class'] });

/* ============================================================
   SHARED SCRIPTS — used by every page on the site.
   Handles the hamburger nav toggle and keeps the button
   visual state in sync with the nav's open/closed class.
   Loaded with `defer` so it runs after the DOM is parsed.
   ============================================================ */

  // Hamburger toggle
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

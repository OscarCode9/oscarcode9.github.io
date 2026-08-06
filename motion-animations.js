/* ============================================================
   Motion animations — oscarcode9.github.io/index.html
   ------------------------------------------------------------
   Animaciones con Motion (https://motion.dev):
   - Barra de progreso de scroll bajo el navbar
   - Entrada del hero con spring + stagger
   - Reveals al hacer scroll (inView) con stagger por seccion
   - Se respeta prefers-reduced-motion
   ============================================================ */
(function () {
  const Motion = window.Motion;
  if (!Motion) return;

  const { animate, inView, scroll, stagger } = Motion;

  const reduceMotionQuery = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  const prefersReducedMotion = () => !!(reduceMotionQuery && reduceMotionQuery.matches);

  // Limpia los estilos inline al terminar para que los hovers CSS
  // (transform/opacity) sigan funcionando sobre las tarjetas.
  function doneCleanup(element) {
    return () => {
      element.style.removeProperty('transform');
      element.style.removeProperty('opacity');
    };
  }

  // ---- Barra de progreso de scroll --------------------------------
  if (!prefersReducedMotion()) {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = [
      'position: fixed',
      'top: 0',
      'left: 0',
      'right: 0',
      'height: 3px',
      'z-index: 10000',
      'background: linear-gradient(90deg, #00d4ff 0%, #7c3aed 100%)',
      'transform-origin: 0 50%',
      'transform: scaleX(0)',
      'pointer-events: none'
    ].join(';');
    document.body.appendChild(progressBar);

    scroll(animate(progressBar, {
      transform: ['scaleX(0)', 'scaleX(1)']
    }, { ease: 'linear' }));
  }

  // ---- Entrada del hero -------------------------------------------
  function animateHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    if (prefersReducedMotion()) return;

    const groups = [
      ['.hero-topline', 0],
      ['.hero-role', 0.08],
      ['.hero-title', 0.16],
      ['.hero-description', 0.24],
      ['.hero-stats .stat-item', 0.32],
      ['.hero-buttons a', 0.44],
      ['.hero-tech .tech-chip', 0.54],
      ['.hero-image', 0.62]
    ];

    groups.forEach(([selector, delay]) => {
      const elements = hero.querySelectorAll(selector);
      elements.forEach((element, index) => {
        animate(element, { opacity: 0, y: 28 }, { duration: 0 });
        animate(element, { opacity: 1, y: 0 }, {
          type: 'spring',
          stiffness: 140,
          damping: 20,
          delay: delay + index * 0.06,
          onComplete: doneCleanup(element)
        });
      });
    });
  }

  // ---- Reveals al hacer scroll ------------------------------------
  function reveal(selector, options) {
    const defaults = { y: 26, staggerDelay: 0.08, margin: '0px 0px -80px 0px' };
    const config = Object.assign({}, defaults, options || {});

    document.querySelectorAll(selector).forEach((element) => {
      if (prefersReducedMotion()) return;

      inView(element, () => {
        animate(element, { opacity: 0, y: config.y }, { duration: 0 });
        animate(element, { opacity: 1, y: 0 }, {
          type: 'spring',
          stiffness: 160,
          damping: 24,
          delay: config.staggerDelay,
          onComplete: doneCleanup(element)
        });
      }, { margin: config.margin });
    });
  }

  // staggerDelay real (por índice) para listas
  function revealStaggered(selector, options) {
    const defaults = { y: 24, step: 0.07, margin: '0px 0px -60px 0px' };
    const config = Object.assign({}, defaults, options || {});

    document.querySelectorAll(selector).forEach((element, index) => {
      if (prefersReducedMotion()) return;

      inView(element, () => {
        animate(element, { opacity: 0, y: config.y }, { duration: 0 });
        animate(element, { opacity: 1, y: 0 }, {
          type: 'spring',
          stiffness: 160,
          damping: 24,
          delay: index * config.step,
          onComplete: doneCleanup(element)
        });
      }, { margin: config.margin });
    });
  }

  // ---- Aplicación por sección -------------------------------------
  revealStaggered('.portfolio-card', { y: 30, step: 0.09 });
  revealStaggered('.blog-item', { y: 22, step: 0.06 });
  revealStaggered('.skill-category', { y: 26, step: 0.08 });
  revealStaggered('.timeline-item', { y: 30, step: 0.1 });
  revealStaggered('.fun-fact', { y: 18, step: 0.04 });
  reveal('.section-header');
  reveal('.about-love-section');
  reveal('.about-quote');
  reveal('.contact-container');
  reveal('.social-links');

  // ---- Skills tags con fade escalonado dentro de cada categoría ---
  document.querySelectorAll('.skill-category').forEach((category) => {
    if (prefersReducedMotion()) return;

    inView(category, () => {
      const tags = category.querySelectorAll('.skill-tag');
      tags.forEach((tag, index) => {
        animate(tag, { opacity: 0, scale: 0.9 }, { duration: 0 });
        animate(tag, { opacity: 1, scale: 1 }, {
          type: 'spring',
          stiffness: 200,
          damping: 22,
          delay: index * 0.03,
          onComplete: doneCleanup(tag)
        });
      });
    }, { margin: '0px 0px -80px 0px' });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateHero);
  } else {
    animateHero();
  }
})();

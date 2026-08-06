/* ============================================================
   Tema light/dark compartido — oscarcode9.github.io
   - Aplica el tema antes del primer paint (evita flash)
   - Inyecta el boton toggle en nav y sidenav si no existe
   - Persiste en localStorage, respeta prefers-color-scheme
   ============================================================ */
(function () {
  function getTheme() {
    var saved = localStorage.getItem('site-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  }

  var current = getTheme();
  document.documentElement.setAttribute('data-theme', current);

  function updateIcons() {
    document.querySelectorAll('.theme-icon').forEach(function (icon) {
      icon.textContent = current === 'light' ? 'light_mode' : 'dark_mode';
    });
  }

  function toggleTheme() {
    current = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', current);
    localStorage.setItem('site-theme', current);
    updateIcons();
  }

  function injectToggle() {
    if (document.querySelector('[data-theme-toggle]')) return;

    var icon = document.createElement('i');
    icon.className = 'material-icons theme-icon';
    icon.textContent = current === 'light' ? 'light_mode' : 'dark_mode';

    var link = document.createElement('a');
    link.setAttribute('data-theme-toggle', '');
    link.style.cursor = 'pointer';
    link.setAttribute('aria-label', 'Cambiar tema');
    link.title = 'Tema';
    link.appendChild(icon);
    link.onclick = toggleTheme;

    var li = document.createElement('li');
    li.appendChild(link);

    var navUl = document.querySelector('.nav-wrapper ul.right, nav ul');
    if (navUl) {
      navUl.appendChild(li);
    } else {
      // Paginas de articulo: pegar el toggle junto al lang-toggle del header
      var anchor = document.querySelector('.post-header .lang-toggle') ||
                   document.querySelector('.post-header .back-link') ||
                   document.querySelector('.lang-toggle') ||
                   document.querySelector('.back-link');
      if (anchor) {
        var btn = document.createElement('span');
        btn.className = 'lang-toggle';
        btn.setAttribute('data-theme-toggle', '');
        btn.style.cursor = 'pointer';
        btn.style.marginLeft = '12px';
        btn.title = 'Tema';
        var iconClone = icon.cloneNode(true);
        btn.appendChild(iconClone);
        btn.onclick = toggleTheme;
        if (getComputedStyle(anchor).position === 'absolute') {
          btn.style.position = 'absolute';
          btn.style.top = getComputedStyle(anchor).top || '30px';
          btn.style.right = '88px';
          btn.style.marginLeft = '0';
        }
        anchor.after(btn);
      } else if (document.body) {
        var floatBtn = document.createElement('div');
        floatBtn.setAttribute('data-theme-toggle', '');
        floatBtn.style.position = 'fixed';
        floatBtn.style.bottom = '20px';
        floatBtn.style.right = '20px';
        floatBtn.style.zIndex = '99999';
        floatBtn.style.background = 'var(--bg-card)';
        floatBtn.style.border = '1px solid var(--border)';
        floatBtn.style.borderRadius = '50%';
        floatBtn.style.width = '44px';
        floatBtn.style.height = '44px';
        floatBtn.style.display = 'flex';
        floatBtn.style.alignItems = 'center';
        floatBtn.style.justifyContent = 'center';
        floatBtn.style.cursor = 'pointer';
        floatBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        floatBtn.appendChild(icon.cloneNode(true));
        floatBtn.onclick = toggleTheme;
        document.body.appendChild(floatBtn);
      }
    }

    var sideUl = document.querySelector('ul.sidenav');
    if (sideUl) sideUl.appendChild(li.cloneNode(true));
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateIcons();
    injectToggle();
  });

  window.toggleTheme = toggleTheme;
})();

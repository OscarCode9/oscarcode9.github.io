// public/i18n.js — Bilingual support (ES/EN) with auto-detection
(function() {
  // Detect language: saved preference > browser language > default 'es'
  function detectLanguage() {
    var saved = localStorage.getItem('site-lang');
    if (saved) return saved;
    
    // Check browser language
    var browserLang = navigator.language || navigator.userLanguage || 'es';
    // If browser is English (en, en-US, en-GB, etc.), use English
    if (browserLang.toLowerCase().startsWith('en')) {
      return 'en';
    }
    // Default to Spanish for es-*, and any other language
    return 'es';
  }

  // Set language IMMEDIATELY before rendering to avoid flicker
  var currentLang = detectLanguage();
  document.documentElement.lang = currentLang;
  // Save detected preference so toggle works correctly
  if (!localStorage.getItem('site-lang')) {
    localStorage.setItem('site-lang', currentLang);
  }

  // Inject CSS for language switching
  var style = document.createElement('style');
  style.id = 'i18n-styles';
  style.textContent = [
    '/* Hide English by default */',
    '.lang-en { display: none !important; }',
    '',
    '/* When lang="en", swap visibility */',
    'html[lang="en"] .lang-es { display: none !important; }',
    'html[lang="en"] .lang-en { display: revert !important; }',
    '',
    '/* Language toggle button */',
    '.lang-toggle {',
    '  cursor: pointer;',
    '  background: rgba(38, 166, 154, 0.15) !important;',
    '  border: 1px solid rgba(38, 166, 154, 0.4);',
    '  color: #26a69a !important;',
    '  padding: 4px 14px !important;',
    '  border-radius: 20px;',
    '  font-size: 0.85em !important;',
    '  font-weight: 600;',
    '  letter-spacing: 0.5px;',
    '  transition: all 0.3s;',
    '  display: inline-flex !important;',
    '  align-items: center;',
    '  gap: 6px;',
    '  user-select: none;',
    '  text-decoration: none !important;',
    '  line-height: 1.2 !important;',
    '  height: auto !important;',
    '  margin: 0 4px;',
    '}',
    'nav ul li a.lang-toggle {',
    '  padding: 4px 14px !important;',
    '  height: auto !important;',
    '  line-height: 1.2 !important;',
    '}',
    'nav ul li:has(.lang-toggle) {',
    '  display: flex;',
    '  align-items: center;',
    '  height: 64px;',
    '}',
    '.lang-toggle:hover {',
    '  background: rgba(38, 166, 154, 0.3) !important;',
    '  border-color: #26a69a;',
    '  color: #80cbc4 !important;',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  // Toggle language
  window.toggleLanguage = function() {
    var newLang = document.documentElement.lang === 'es' ? 'en' : 'es';
    document.documentElement.lang = newLang;
    localStorage.setItem('site-lang', newLang);
    updateToggles();
    updatePlaceholders();
  };

  function updateToggles() {
    var lang = document.documentElement.lang;
    var toggles = document.querySelectorAll('.lang-toggle');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].textContent = lang === 'es' ? '🌐 EN' : '🌐 ES';
      toggles[i].title = lang === 'es' ? 'Switch to English' : 'Cambiar a Español';
    }
  }

  // Swap form placeholders based on language
  function updatePlaceholders() {
    var lang = document.documentElement.lang;
    var els = document.querySelectorAll('[data-placeholder-en]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el.getAttribute('data-placeholder-es')) {
        el.setAttribute('data-placeholder-es', el.getAttribute('placeholder'));
      }
      el.setAttribute('placeholder', lang === 'en' 
        ? el.getAttribute('data-placeholder-en') 
        : el.getAttribute('data-placeholder-es'));
    }
  }

  // Update toggles and placeholders when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      updateToggles();
      if (currentLang !== 'es') updatePlaceholders();
    });
  } else {
    updateToggles();
    if (currentLang !== 'es') updatePlaceholders();
  }
})();

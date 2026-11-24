/* Progressive enhancement: projects remain readable without JavaScript. */
(function () {
  const section = document.getElementById('portfolio');
  if (!section) return;
  const cards = Array.from(section.querySelectorAll('[data-project]'));
  const count = section.querySelector('[data-project-count]');
  section.querySelectorAll('[data-project-filter]').forEach(button => {
    button.addEventListener('click', () => {
      section.querySelectorAll('[data-project-filter]').forEach(filter => {
        filter.setAttribute('aria-pressed', String(filter === button));
      });
      const category = button.dataset.projectFilter;
      cards.forEach(card => { card.hidden = category !== 'all' && !card.dataset.category.split(' ').includes(category); });
      const visible = cards.filter(card => !card.hidden).length;
      count.querySelector('.lang-es').textContent = `${visible} ${visible === 1 ? 'proyecto' : 'proyectos'}`;
      count.querySelector('.lang-en').textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
    });
  });

  const dialog = document.getElementById('portfolio-lightbox');
  const image = dialog.querySelector('img');
  const title = dialog.querySelector('h3');
  const counter = dialog.querySelector('[data-gallery-counter]');
  const previews = Array.from(section.querySelectorAll('[data-gallery]'));
  let gallery = [];
  let current = 0;

  function showImage(index) {
    current = (index + gallery.length) % gallery.length;
    const item = gallery[current];
    image.src = item.src;
    image.alt = item.alt;
    title.textContent = item.title;
    counter.textContent = `${current + 1} / ${gallery.length}`;
    dialog.querySelectorAll('[data-gallery-step]').forEach(button => { button.hidden = gallery.length < 2; });
  }

  previews.forEach(preview => {
    preview.addEventListener('click', () => {
      gallery = JSON.parse(preview.dataset.gallery);
      showImage(0);
      dialog.showModal();
      document.body.classList.add('portfolio-lightbox-open');
    });
  });
  dialog.querySelector('[data-gallery-close]').addEventListener('click', () => dialog.close());
  dialog.querySelectorAll('[data-gallery-step]').forEach(button => {
    button.addEventListener('click', () => showImage(current + Number(button.dataset.galleryStep)));
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showImage(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('portfolio-lightbox-open');
    image.removeAttribute('src');
  });
})();

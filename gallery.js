/* ============================================================
   GALLERY SCRIPT — only used on gallery.html.
   Builds the bento grid from `galleryItems` and wires up
   the lightbox interactions. Loaded with `defer`.
   ============================================================ */

  // ============================================================
  // ✏️  EDIT: GALLERY ITEMS
  //
  //   This array is the SINGLE SOURCE OF TRUTH for the gallery.
  //   Add, remove, or reorder items — both the cards on the page
  //   AND the lightbox content will update automatically.
  //
  //   Each item is an object with these keys:
  //     image     — path to the image file (e.g. "images/project-1.jpg")
  //                 Use an empty string "" to keep the colored placeholder.
  //     title     — short project name (shown on hover + in lightbox)
  //     subhead   — small uppercase label (e.g. "Brand identity · 2025")
  //     info      — paragraph of description shown in the lightbox
  //     alt       — short image description for screen readers
  //
  //   To add a new piece: copy one of the {...} blocks below, paste it
  //   in, and edit the values. The grid expands automatically.
  //   To remove: delete its {...} block.
  //   To reorder: cut and paste the {...} blocks in the order you want.
  // ============================================================
  const galleryItems = [
    {
      image: "",
      title: "Project One",
      subhead: "Brand identity · 2025",
      info: "A short paragraph about this project — what it was, who it was for, and what made it interesting to work on. This text appears in the lightbox alongside the image.",
      alt: "Project one preview image"
    },
    {
      image: "",
      title: "Project Two",
      subhead: "Editorial · 2025",
      info: "A short paragraph about this project — what it was, who it was for, and what made it interesting to work on. This text appears in the lightbox alongside the image.",
      alt: "Project two preview image"
    },
    {
      image: "",
      title: "Project Three",
      subhead: "Illustration · 2024",
      info: "A short paragraph about this project — what it was, who it was for, and what made it interesting to work on. This text appears in the lightbox alongside the image.",
      alt: "Project three preview image"
    },
    {
      image: "",
      title: "Project Four",
      subhead: "Packaging · 2024",
      info: "A short paragraph about this project — what it was, who it was for, and what made it interesting to work on. This text appears in the lightbox alongside the image.",
      alt: "Project four preview image"
    },
    {
      image: "",
      title: "Project Five",
      subhead: "Brand identity · 2024",
      info: "A short paragraph about this project — what it was, who it was for, and what made it interesting to work on. This text appears in the lightbox alongside the image.",
      alt: "Project five preview image"
    },
    {
      image: "",
      title: "Project Six",
      subhead: "Art direction · 2024",
      info: "A short paragraph about this project — what it was, who it was for, and what made it interesting to work on. This text appears in the lightbox alongside the image.",
      alt: "Project six preview image"
    },
    {
      image: "",
      title: "Project Seven",
      subhead: "Print · 2023",
      info: "A short paragraph about this project — what it was, who it was for, and what made it interesting to work on. This text appears in the lightbox alongside the image.",
      alt: "Project seven preview image"
    },
    {
      image: "",
      title: "Project Eight",
      subhead: "Illustration · 2023",
      info: "A short paragraph about this project — what it was, who it was for, and what made it interesting to work on. This text appears in the lightbox alongside the image.",
      alt: "Project eight preview image"
    }
  ];
  // ============================================================
  // END: GALLERY ITEMS — don't edit anything below this line
  // unless you know what you're doing.
  // ============================================================

  // Render the gallery grid from the data above.
  (function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    grid.innerHTML = galleryItems.map((item, i) => `
      <button class="gallery-card" data-index="${i}" aria-label="Open ${item.title.replace(/"/g, '&quot;')}">
        ${item.image ? `<img class="gallery-card-img" src="${item.image}" alt="${(item.alt || item.title).replace(/"/g, '&quot;')}">` : ''}
        <span class="gallery-card-title"><span>${item.title}</span></span>
      </button>
    `).join('');

    grid.querySelectorAll('.gallery-card').forEach(card => {
      card.addEventListener('click', () => openLightbox(parseInt(card.dataset.index, 10)));
    });
  })();

  // ---- Lightbox controller ----
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightboxImage');
  const lightboxTitle  = document.getElementById('lightboxTitle');
  const lightboxSub    = document.getElementById('lightboxSubhead');
  const lightboxInfo   = document.getElementById('lightboxInfo');
  const lightboxClose  = document.getElementById('lightboxClose');

  function openLightbox(index) {
    const item = galleryItems[index];
    if (!item) return;
    if (item.image) {
      lightboxImg.src = item.image;
      lightboxImg.alt = item.alt || item.title;
      lightboxImg.style.display = '';
    } else {
      lightboxImg.removeAttribute('src');
      lightboxImg.style.display = 'none';
    }
    lightboxTitle.textContent = item.title;
    lightboxSub.textContent   = item.subhead || '';
    lightboxInfo.textContent  = item.info || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) closeLightbox();
  });

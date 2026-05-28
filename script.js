/* ============================================
   PILA SYSTEMS — JavaScript
   Interactions, Animations, Certificate Vault
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ——————————————————————————————
     1. NAVIGATION
  —————————————————————————————— */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll — add background
  const handleNavScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav__links--open');
    navToggle.classList.toggle('nav__toggle--active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav__links--open');
      navToggle.classList.remove('nav__toggle--active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Active nav highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinkElements = document.querySelectorAll('.nav__link');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinkElements.forEach(link => {
          link.classList.toggle('nav__link--active',
            link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });


  /* ——————————————————————————————
     2. SCROLL REVEAL (Intersection Observer)
  —————————————————————————————— */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ——————————————————————————————
     3. SKILL BAR ANIMATION
  —————————————————————————————— */
  const skillBars = document.querySelectorAll('.skill-bar__fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width = target.getAttribute('data-width');
        // Slight delay so the card reveal finishes first
        setTimeout(() => {
          target.style.width = width + '%';
        }, 300);
        skillObserver.unobserve(target);
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => skillObserver.observe(bar));


  /* ——————————————————————————————
     4. SMOOTH SCROLL for anchor links
  —————————————————————————————— */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ——————————————————————————————
     5. CONTACT FORM
  —————————————————————————————— */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple client-side "send" simulation
    const submitBtn = document.getElementById('contactSubmit');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');
    }, 1200);
  });


  /* ——————————————————————————————
     6. CERTIFICATE VAULT
  —————————————————————————————— */
  const STORAGE_KEY = 'pila_certificates';
  const certsGrid = document.getElementById('certsGrid');
  const certsEmpty = document.getElementById('certsEmpty');
  const certUploadArea = document.getElementById('certUploadArea');
  const certFileInput = document.getElementById('certFileInput');
  const certSearch = document.getElementById('certSearch');
  const certFilters = document.getElementById('certFilters');
  const certModal = document.getElementById('certModal');
  const modalBody = document.getElementById('modalBody');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.getElementById('modalClose');

  // Sample certificates
  const sampleCerts = [
    { id: 's1', title: 'Full-Stack Web Development', issuer: 'Udemy', category: 'development', date: '2025-03', type: 'sample' },
    { id: 's2', title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', category: 'cloud', date: '2025-06', type: 'sample' },
    { id: 's3', title: 'Python for Data Science', issuer: 'Coursera', category: 'data', date: '2024-11', type: 'sample' },
    { id: 's4', title: 'Cybersecurity Fundamentals', issuer: 'IBM', category: 'security', date: '2025-01', type: 'sample' },
    { id: 's5', title: 'Machine Learning Specialization', issuer: 'Stanford / Coursera', category: 'data', date: '2025-08', type: 'sample' },
    { id: 's6', title: 'React Advanced Patterns', issuer: 'Frontend Masters', category: 'development', date: '2024-09', type: 'sample' },
  ];

  // Load certificates from localStorage, seeding with samples if empty
  function loadCerts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleCerts));
    return [...sampleCerts];
  }

  let certificates = loadCerts();
  let activeFilter = 'all';
  let searchQuery = '';

  function saveCerts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certificates));
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  }

  function renderCerts() {
    const filtered = certificates.filter(cert => {
      const matchesFilter = activeFilter === 'all' || cert.category === activeFilter;
      const matchesSearch = !searchQuery ||
        cert.title.toLowerCase().includes(searchQuery) ||
        cert.issuer.toLowerCase().includes(searchQuery);
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      certsGrid.innerHTML = '';
      certsEmpty.style.display = 'block';
      return;
    }

    certsEmpty.style.display = 'none';
    certsGrid.innerHTML = filtered.map(cert => `
      <div class="glass-card cert-card" data-id="${cert.id}">
        <div class="cert-card__preview">
          ${cert.thumbnail
            ? `<img src="${cert.thumbnail}" alt="${cert.title}">`
            : `<div class="cert-card__preview-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                <span>${cert.fileType === 'pdf' ? 'PDF' : 'Certificate'}</span>
              </div>`
          }
          <button class="cert-card__remove" title="Remove certificate" data-remove="${cert.id}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="cert-card__body">
          <h3 class="cert-card__title">${cert.title}</h3>
          <p class="cert-card__issuer">${cert.issuer}</p>
          <div class="cert-card__meta">
            <span class="cert-card__category-tag">${cert.category}</span>
            <span class="cert-card__date">${formatDate(cert.date)}</span>
          </div>
        </div>
      </div>
    `).join('');

    // Click to preview
    certsGrid.querySelectorAll('.cert-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.cert-card__remove')) return;
        const id = card.dataset.id;
        const cert = certificates.find(c => c.id === id);
        if (cert) openCertModal(cert);
      });
    });

    // Remove buttons
    certsGrid.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.remove;
        certificates = certificates.filter(c => c.id !== id);
        saveCerts();
        renderCerts();
      });
    });
  }

  // Filters
  certFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.certs__filter-btn');
    if (!btn) return;
    certFilters.querySelectorAll('.certs__filter-btn').forEach(b =>
      b.classList.remove('certs__filter-btn--active'));
    btn.classList.add('certs__filter-btn--active');
    activeFilter = btn.dataset.filter;
    renderCerts();
  });

  // Search
  certSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderCerts();
  });

  // Upload area
  certUploadArea.addEventListener('click', () => certFileInput.click());

  certUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    certUploadArea.style.borderColor = 'var(--accent-teal)';
    certUploadArea.style.background = 'var(--accent-teal-soft)';
  });

  certUploadArea.addEventListener('dragleave', () => {
    certUploadArea.style.borderColor = '';
    certUploadArea.style.background = '';
  });

  certUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    certUploadArea.style.borderColor = '';
    certUploadArea.style.background = '';
    handleFiles(e.dataTransfer.files);
  });

  certFileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
    certFileInput.value = '';
  });

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      if (!isImage && !isPdf) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const cert = {
          id: 'u_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          issuer: 'Uploaded',
          category: 'other',
          date: new Date().toISOString().slice(0, 7),
          fileType: isPdf ? 'pdf' : 'image',
          fileData: e.target.result,
          thumbnail: isImage ? e.target.result : null,
          type: 'uploaded'
        };

        certificates.unshift(cert);
        saveCerts();
        renderCerts();
      };
      reader.readAsDataURL(file);
    });
  }

  // Modal
  function openCertModal(cert) {
    modalTitle.textContent = cert.title;
    if (cert.fileData) {
      if (cert.fileType === 'pdf') {
        modalBody.innerHTML = `<iframe src="${cert.fileData}" title="${cert.title}"></iframe>`;
      } else {
        modalBody.innerHTML = `<img src="${cert.fileData}" alt="${cert.title}">`;
      }
    } else {
      modalBody.innerHTML = `
        <div style="text-align:center; padding: 48px; color: var(--text-tertiary);">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
          <h3 style="margin-top: 16px; color: var(--text-primary);">${cert.title}</h3>
          <p style="margin-top: 8px;">Issued by ${cert.issuer}</p>
          <p style="margin-top: 4px; font-size: 0.85rem;">This is a sample certificate. Upload your own to see a full preview.</p>
        </div>
      `;
    }

    certModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCertModal() {
    certModal.classList.remove('active');
    document.body.style.overflow = '';
    modalBody.innerHTML = '';
  }

  modalClose.addEventListener('click', closeCertModal);
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) closeCertModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains('active')) {
      closeCertModal();
    }
  });

  // Initial render
  renderCerts();


  /* ——————————————————————————————
     7. TECH ITEMS STAGGER ANIMATION
  —————————————————————————————— */
  const techItems = document.querySelectorAll('.tech-item');

  const techObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.tech-item');
        items.forEach((item, i) => {
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transition = 'opacity 0.6s ease';
            item.style.opacity = '1';
          }, i * 50);
        });
        techObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const techGrid = document.querySelector('.tech__grid');
  if (techGrid) techObserver.observe(techGrid);


  /* ——————————————————————————————
     8. GOAL TIMELINE STAGGER
  —————————————————————————————— */
  const goalItems = document.querySelectorAll('.goal-item');

  const goalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        const index = Array.from(goalItems).indexOf(entry.target);
        setTimeout(() => {
          entry.target.style.transition = 'opacity 0.8s ease';
          entry.target.style.opacity = '1';
        }, index * 150);
        goalObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  goalItems.forEach(item => goalObserver.observe(item));


  /* ——————————————————————————————
     9. YEAR IN FOOTER
  —————————————————————————————— */
  const yearEl = document.querySelector('.footer__bottom p');
  if (yearEl) {
    yearEl.innerHTML = yearEl.innerHTML.replace('2026', new Date().getFullYear());
  }

});

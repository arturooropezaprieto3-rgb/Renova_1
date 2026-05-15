/* ═══════════════════════════════════════════════
   RENOVA — App.js v2
   ═══════════════════════════════════════════════ */

/* ─── Carga de componentes ─── */
async function loadComponent(id, file) {
  try {
    const res  = await fetch(`components/${file}`);
    if (!res.ok) throw new Error(`No se pudo cargar ${file}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

async function loadAllComponents() {
  // Carga en orden: nav primero, luego el resto en paralelo
  await loadComponent('nav', 'nav.html');
  await Promise.all([
    loadComponent('hero',       'hero.html'),
    loadComponent('benefits',   'benefits.html'),
    loadComponent('process',    'process.html'),
    loadComponent('guarantees', 'guarantees.html'),
    loadComponent('contact',    'contact.html'),
    loadComponent('footer',     'footer.html'),
  ]);

  // Inicializar todo después de cargar
  initNav();
  initScrollAnimations();
  initSmoothScroll();
  initContactForm();
}

/* ─── Navegación ─── */
function initNav() {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!nav) return;

  // Scroll: añade clase scrolled
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Toggle mobile
  toggle?.addEventListener('click', () => {
    const open = links.classList.toggle('active');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Cierra al hacer clic en un enlace
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('active');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // Cierra al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      links?.classList.remove('active');
    }
  });
}

/* ─── Scroll reveal con IntersectionObserver ─── */
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.fade-in, .fade-in-left, .fade-in-right, .slide-up, .scale-in'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Stagger basado en índice dentro del padre
      const siblings = [...(entry.target.parentElement?.children || [])];
      const idx      = siblings.indexOf(entry.target);
      const base     = parseFloat(
        getComputedStyle(entry.target).transitionDelay
      ) || 0;

      // Si no tiene delay propio por clase, lo calculamos
      if (!entry.target.className.includes('stagger')) {
        entry.target.style.transitionDelay = `${base + idx * 0.08}s`;
      }

      entry.target.classList.add('reveal');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  targets.forEach(el => observer.observe(el));
}

/* ─── Smooth scroll ─── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector('.nav')?.offsetHeight || 70;
      const top  = target.getBoundingClientRect().top + window.pageYOffset - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─── Formulario de contacto — sin alert() ─── */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    // Validación básica
    if (!data.name?.trim() || !data.email?.trim()) {
      showToast('Por favor completa tu nombre y email.', 'warning');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showToast('Ingresa un email válido.', 'warning');
      return;
    }

    // Estado de carga
    const btn     = form.querySelector('.btn-submit span');
    const btnEl   = form.querySelector('.btn-submit');
    const origTxt = btn.textContent;
    btn.textContent = 'Enviando...';
    btnEl.disabled  = true;
    btnEl.style.opacity = '0.7';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        form.reset();
        success?.classList.add('show');
        showToast('🌱 ¡Mensaje enviado! Te contactaremos pronto.', 'success');
      } else {
        showToast(result.message || 'Hubo un error. Intenta de nuevo.', 'error');
      }
    } catch {
      // Simulación en desarrollo (sin backend activo)
      form.reset();
      success?.classList.add('show');
      showToast('🌱 ¡Mensaje enviado! Te contactaremos pronto.', 'success');
    } finally {
      btn.textContent     = origTxt;
      btnEl.disabled      = false;
      btnEl.style.opacity = '1';
    }
  });
}

/* ─── Toast notification ─── */
let toastTimer;
function showToast(msg, type = 'success') {
  let toast = document.getElementById('renova-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'renova-toast';
    document.body.appendChild(toast);

    const style = document.createElement('style');
    style.textContent = `
      #renova-toast {
        position: fixed; bottom: 100px; right: 28px; z-index: 9999;
        padding: 14px 22px; border-radius: 14px;
        font-family: var(--font-body); font-size: 0.875rem; font-weight: 600;
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        transform: translateY(20px); opacity: 0;
        transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        pointer-events: none; max-width: 320px;
      }
      #renova-toast.show { transform: translateY(0); opacity: 1; }
      #renova-toast.success { background: var(--bg-green); color: var(--green-deep); border: 1px solid rgba(113,194,56,0.3); }
      #renova-toast.warning { background: var(--bg-sun);   color: var(--orange);     border: 1px solid rgba(242,140,40,0.3); }
      #renova-toast.error   { background: #fef2f2;         color: #b91c1c;            border: 1px solid rgba(185,28,28,0.2); }
    `;
    document.head.appendChild(style);
  }

  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.className   = `show ${type}`;

  toastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', loadAllComponents);

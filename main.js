/* ============================================================
   REVIVE — main.js
   Handles: nav scroll state, smooth scroll helpers,
            intersection observer fade-in animations,
            audit CTA click tracking
============================================================ */

'use strict';

// ── NAV SCROLL STATE ───────────────────────────────────────
(function initNav() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navConsult = document.getElementById('nav-consult');
  const sectionStack = document.getElementById('section-stack');
  const heroLeadForm = document.getElementById('hero-lead-form');
  const stackDotClasses = ['is-red', 'is-green', 'is-blue', 'is-violet'];
  const stackHeadings = Array.from(
    document.querySelectorAll('.section-h')
  );
  if (!nav) return;
  let isScrolled = false;
  let lastStackKey = '';

  function formatStackLabel(el) {
    return el.textContent.replace(/\s+/g, ' ').trim();
  }

  function renderSectionStack() {
    if (!sectionStack) return;

    if (!isScrolled) {
      sectionStack.hidden = true;
      lastStackKey = '';
      return;
    }

    const navBottom = nav.getBoundingClientRect().bottom;
    const activeLabels = stackHeadings
      .filter((heading) => heading.getBoundingClientRect().top <= navBottom + 8)
      .map(formatStackLabel);

    const stackKey = activeLabels.join('|');
    if (!activeLabels.length) {
      sectionStack.hidden = true;
      lastStackKey = '';
      sectionStack.innerHTML = '';
      return;
    }

    if (stackKey === lastStackKey) {
      return;
    }

    sectionStack.innerHTML = activeLabels
      .map((label, index) => `
        <div class="section-stack-item">
          <span class="section-stack-dot ${stackDotClasses[index % stackDotClasses.length]}"></span>
          <span class="section-stack-label">${label}</span>
        </div>
      `)
      .join('');
    sectionStack.hidden = false;
    lastStackKey = stackKey;
  }

  function renderNavConsult() {
    if (!navConsult || !heroLeadForm) return;

    const navBottom = nav.getBoundingClientRect().bottom;
    const formBottom = heroLeadForm.getBoundingClientRect().bottom;
    const shouldShow = formBottom <= navBottom + 8;

    navConsult.classList.toggle('is-visible', shouldShow);
  }

  function onScroll() {
    const y = window.scrollY;

    // Use separate enter/exit thresholds so the sticky nav
    // doesn't bounce between sizes while its own height changes.
    if (!isScrolled && y > 72) {
      isScrolled = true;
      nav.classList.add('scrolled');
    } else if (isScrolled && y < 24) {
      isScrolled = false;
      nav.classList.remove('scrolled');
    }

    renderSectionStack();
    renderNavConsult();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    renderSectionStack();
    renderNavConsult();
  });
  onScroll(); // run once on load

  if (navToggle && navMenu) {
    function closeNav() {
      nav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.hidden = true;
    }

    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('nav-open', !isOpen);
      navMenu.hidden = isOpen;
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target)) {
        closeNav();
      }
    });
  }

  if (navConsult) {
    navConsult.addEventListener('click', () => {
      scrollToHeroForm();
    });
  }
})();


// ── SMOOTH SCROLL HELPERS ──────────────────────────────────
/**
 * Scroll to a section by its ID.
 * Called from onclick attributes in the HTML.
 */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const navHeight = document.getElementById('nav')?.offsetHeight || 0;
  const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 24;
  window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Scroll to the audit / contact CTA section.
 */
function scrollToAudit() {
  scrollToSection('contact');
}

function scrollToHeroForm() {
  const hero = document.getElementById('home');
  const projectField = document.querySelector('textarea[name="project"]');
  if (!hero || !projectField) return;

  const navHeight = document.getElementById('nav')?.offsetHeight || 0;
  const top = hero.getBoundingClientRect().top + window.scrollY - navHeight - 24;
  window.scrollTo({ top, behavior: 'smooth' });

  window.setTimeout(() => {
    projectField.classList.add('hero-field-flash');
    projectField.focus({ preventScroll: true });
    window.setTimeout(() => {
      projectField.classList.remove('hero-field-flash');
    }, 1200);
  }, 450);
}


// ── FADE-UP ANIMATIONS ─────────────────────────────────────
(function initFadeAnimations() {
  // Elements to animate — add .fade-up class in HTML to opt in,
  // or let this script auto-apply to key elements below.
  const autoTargets = [
    '.hero-eyebrow',
    '.hero-h1',
    '.hero-sub',
    '.hero-actions',
    '.strip-item',
    '.section-tag',
    '.section-h',
    '.section-p',
    '.process-step',
    '.pain-card',
    '.serve-card',
    '.svc-row',
    '.cta-inner',
  ];

  // Apply .fade-up to all matched elements
  autoTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('fade-up');
    });
  });

  // Set up IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
})();


// ── HERO FORMS ────────────────────────────────────────────
(function initHeroForms() {
  const meetingToggle = document.getElementById('meeting-toggle');
  const meetingPanel = document.getElementById('meeting-panel');
  const leadForm = document.getElementById('hero-lead-form');
  const meetingForm = document.getElementById('meeting-form');
  const meetingConfirmation = document.getElementById('meeting-confirmation');
  const projectField = leadForm?.querySelector('textarea[name="project"]');

  function openMeetingPanel() {
    if (!meetingToggle || !meetingPanel) return;
    meetingToggle.setAttribute('aria-expanded', 'true');
    meetingToggle.setAttribute('aria-controls', 'meeting-panel');
    if (meetingConfirmation) {
      meetingConfirmation.hidden = true;
    }
    meetingPanel.hidden = false;
    requestAnimationFrame(() => {
      meetingPanel.classList.add('is-open');
    });
  }

  function closeMeetingPanel() {
    if (!meetingToggle || !meetingPanel) return;
    meetingToggle.setAttribute('aria-expanded', 'false');
    meetingPanel.classList.remove('is-open');
    window.setTimeout(() => {
      if (meetingToggle.getAttribute('aria-expanded') === 'false') {
        meetingPanel.hidden = true;
      }
    }, 350);
  }

  if (leadForm) {
    if (projectField) {
      projectField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      });

      projectField.addEventListener('input', () => {
        projectField.value = projectField.value.replace(/[\r\n]+/g, ' ').slice(0, 50);
      });
    }

    leadForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(leadForm);
      const email = formData.get('email');
      const project = formData.get('project');
      const subject = encodeURIComponent('New Revive Lead Inquiry');
      const body = encodeURIComponent(
        `Email: ${email}\n\nProject description:\n${project}`
      );

      openMeetingPanel();
      window.location.href = `mailto:hello@revive.co?subject=${subject}&body=${body}`;
    });
  }

  if (meetingForm) {
    meetingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(meetingForm);
      const date = formData.get('meeting-date');
      const time = formData.get('meeting-time');
      const subject = encodeURIComponent('Meeting Request');
      const body = encodeURIComponent(
        `Preferred meeting date: ${date}\nPreferred meeting time: ${time}`
      );

      if (meetingConfirmation) {
        meetingConfirmation.hidden = false;
      }
      window.setTimeout(() => {
        closeMeetingPanel();
      }, 900);

      window.location.href = `mailto:hello@revive.co?subject=${subject}&body=${body}`;
    });
  }
})();


// ── CTA CLICK HANDLER ──────────────────────────────────────
(function initCTA() {
  const consultBtn = document.getElementById('consult-btn');
  if (!consultBtn) return;

  consultBtn.addEventListener('click', () => {
    scrollToHeroForm();
  });
})();


// ── LOGO CLICK ─────────────────────────────────────────────
(function initLogo() {
  const logo = document.querySelector('.logo');
  if (!logo) return;
  logo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

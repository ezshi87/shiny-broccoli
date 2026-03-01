/* =========================================================
   Cutie Cuddle – main.js
   Handles: Mobile nav, FAQ accordion, Newsletter exit popup
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------
     1. Mobile Navigation Toggle
     ------------------------------------------------------- */
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      hamburger.setAttribute(
        'aria-expanded',
        hamburger.classList.contains('open') ? 'true' : 'false'
      );
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------------------------------------------
     2. FAQ Accordion
     ------------------------------------------------------- */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item   = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all open items
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });

      // Toggle clicked item
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  /* -------------------------------------------------------
     3. Contact Form (client-side feedback only)
     ------------------------------------------------------- */
  const contactForm    = document.getElementById('contactForm');
  const formSuccess    = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name  = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const msg   = contactForm.querySelector('#message').value.trim();

      if (!name || !email || !msg) return;

      // Hide form, show success
      contactForm.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
    });
  }

  /* -------------------------------------------------------
     4. Newsletter Exit-Intent Popup
     ------------------------------------------------------- */
  const overlay          = document.getElementById('newsletterOverlay');
  const closeBtn         = document.getElementById('newsletterClose');
  const newsletterForm   = document.getElementById('newsletterForm');
  const newsletterThanks = document.getElementById('newsletterThanks');

  const SESSION_KEY = 'cc_newsletter_shown';

  function showPopup() {
    if (!overlay) return;
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function hidePopup() {
    if (!overlay) return;
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    // Remember for this session
    sessionStorage.setItem(SESSION_KEY, '1');
  }

  // Exit intent: trigger when mouse leaves toward the top
  let popupTriggered = false;

  if (overlay && !sessionStorage.getItem(SESSION_KEY)) {
    document.addEventListener('mouseleave', (e) => {
      if (popupTriggered) return;
      if (e.clientY <= 0) {
        popupTriggered = true;
        showPopup();
      }
    });

    // Fallback: show after 45s of inactivity for mobile / no mouse devices
    let idleTimer = setTimeout(() => {
      if (!popupTriggered && !sessionStorage.getItem(SESSION_KEY)) {
        popupTriggered = true;
        showPopup();
      }
    }, 45000);

    // Reset idle timer on interaction
    ['scroll', 'click', 'keypress', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          if (!popupTriggered && !sessionStorage.getItem(SESSION_KEY)) {
            popupTriggered = true;
            showPopup();
          }
        }, 45000);
      }, { passive: true });
    });
  }

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', hidePopup);
  }

  // Click outside modal
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hidePopup();
    });
  }

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hidePopup();
  });

  // Newsletter form submission
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (!emailInput || !emailInput.value.trim()) return;

      newsletterForm.style.display = 'none';
      if (newsletterThanks) newsletterThanks.style.display = 'block';
      sessionStorage.setItem(SESSION_KEY, '1');

      // Auto-close after 3 seconds
      setTimeout(hidePopup, 3000);
    });
  }

});

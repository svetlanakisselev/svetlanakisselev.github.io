/* ================================================================
   SVETLANA KISSELEV — WEARABLE STRUCTURAL ART
   Shared script — used by every page.
   No framework, no external library.

   Split in two:
   - DOMContentLoaded: features that don't depend on the header/
     footer/newsletter components (threshold transition, scroll
     reveal, contact form) — these elements exist directly in each
     page's own HTML, so there's no need to wait for anything.
   - includes:loaded (dispatched by js/include.js once every
     data-include element has been injected): nav toggle, active
     nav link, waitlist forms — these only exist once the header
     and newsletter components have loaded.
   ================================================================ */

document.addEventListener("DOMContentLoaded", function () {
  initThreshold();
  initScrollReveal();
  initContactForm();
});

document.addEventListener("includes:loaded", function () {
  initNav();
  initWaitlistForms();
});

/* --------------------------------------------------------------
   1. THRESHOLD CINEMA TRANSITION
   Only runs on index.html (elements simply won't exist elsewhere).
   -------------------------------------------------------------- */
function initThreshold() {
  var enterBtn  = document.getElementById("enter-btn");
  var threshold = document.getElementById("threshold");
  var overlay   = document.getElementById("black-overlay");
  var home      = document.getElementById("home");

  if (!(enterBtn && threshold && overlay && home)) return;

  var rootStyles = getComputedStyle(document.documentElement);
  var FADE_MS = parseInt(rootStyles.getPropertyValue("--duration-fade-fast"), 10) || 400;
  var HOLD_MS = parseInt(rootStyles.getPropertyValue("--duration-fade-hold"), 10) || 180;

  function enterSite() {
    enterBtn.disabled = true;

    // Threshold fades out while the black overlay fades in — both reach
    // their extreme (invisible / fully black) at the same instant.
    threshold.classList.add("fade-out");
    overlay.classList.add("visible");

    setTimeout(function () {
      threshold.style.display = "none";
      home.style.display = "flex";

      // Wait a frame so the browser registers display:flex before fading in
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          home.classList.add("visible");
          overlay.classList.remove("visible");
        });
      });

      setTimeout(function () {
        overlay.style.pointerEvents = "none";
        document.body.classList.remove("locked");
      }, FADE_MS);

    }, FADE_MS + HOLD_MS);
  }

  enterBtn.addEventListener("click", enterSite);
}

/* --------------------------------------------------------------
   2. MOBILE NAV TOGGLE + ACTIVE NAV LINK
   Runs after the header component has been injected.
   -------------------------------------------------------------- */
function initNav() {
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Pages that all belong under the "Collections" nav item, even
  // though they're separate files (the collections index itself,
  // plus every individual collection page).
  var collectionsPages = [
    "collection.html",
    "queen-swan.html",
    "lacrimae-mundi.html",
    "1001-nights.html"
  ];

  var currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".site-nav a").forEach(function (link) {
    var section = link.getAttribute("data-nav");
    var isActive;

    if (section === "collections") {
      isActive = collectionsPages.indexOf(currentPage) !== -1;
    } else {
      isActive = link.getAttribute("href").split("/").pop() === currentPage;
    }

    if (isActive) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* --------------------------------------------------------------
   3. SCROLL REVEAL  (slow fade-up, used on collection pieces)
   -------------------------------------------------------------- */
function initScrollReveal() {
  var revealTargets = document.querySelectorAll(".piece");
  if (!revealTargets.length) return;

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: just show everything immediately
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }
}

/* --------------------------------------------------------------
   4. WAITLIST FORMS  (Collection + Contact, loaded via
      components/newsletter.html)
   No backend is wired up yet. This only gives visual confirmation.
   To collect real emails, connect the form to Brevo (or another
   provider), then remove this preventDefault so it submits normally.
   -------------------------------------------------------------- */
function initWaitlistForms() {
  document.querySelectorAll(".waitlist form").forEach(function (form) {

    // Skip forms already handled by another script (e.g. js/newsletter.js),
    // explicitly marked with data-managed-by="newsletter" in the HTML.
    if (form.hasAttribute("data-managed-by")) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.parentElement.querySelector(".form-note");
      if (note) {
        note.textContent = "Thank you — you will be the first to know.";
        note.classList.add("visible");
      }
      form.reset();
    });
  });
}

/* --------------------------------------------------------------
   5. CONTACT FORM
   Same placeholder behaviour as the waitlist forms above.
   -------------------------------------------------------------- */
function initContactForm() {
  var contactForm = document.querySelector(".contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var note = contactForm.parentElement.querySelector(".form-note");
    if (note) {
      note.textContent = "Thank you — your message has been received.";
      note.classList.add("visible");
    }
    contactForm.reset();
  });
}

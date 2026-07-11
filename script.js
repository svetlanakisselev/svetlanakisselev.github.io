/* ================================================================
   SVETLANA KISSELEV — WEARABLE STRUCTURAL ART
   Shared script — used by every page.
   No framework, no external library.
   ================================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* --------------------------------------------------------------
     1. THRESHOLD CINEMA TRANSITION
     Only runs on index.html (elements simply won't exist elsewhere).
     -------------------------------------------------------------- */
  var enterBtn  = document.getElementById("enter-btn");
  var threshold = document.getElementById("threshold");
  var overlay   = document.getElementById("black-overlay");
  var home      = document.getElementById("home");

  if (enterBtn && threshold && overlay && home) {
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
     2. MOBILE NAV TOGGLE
     -------------------------------------------------------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  /* --------------------------------------------------------------
     3. ACTIVE NAV LINK
     Compares each link's page name to the current URL.
     -------------------------------------------------------------- */
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach(function (link) {
    var linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* --------------------------------------------------------------
     4. SCROLL REVEAL  (slow fade-up, used on Collection pieces)
     -------------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(".piece");

  if (revealTargets.length && "IntersectionObserver" in window) {
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

  /* --------------------------------------------------------------
     5. WAITLIST FORMS  (Collection + Contact)
     No backend is wired up yet. This only gives visual confirmation.
     To collect real emails, connect the form action to a service
     such as Formspree, Getform, or a Cloudflare Worker, then remove
     this preventDefault so the form submits normally.
     -------------------------------------------------------------- */
  document.querySelectorAll(".waitlist form").forEach(function (form) {
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

  /* --------------------------------------------------------------
     6. CONTACT FORM
     Same placeholder behaviour as the waitlist forms above.
     -------------------------------------------------------------- */
  var contactForm = document.querySelector(".contact-form");
  if (contactForm) {
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

});

/* ================================================================
   SVETLANA KISSELEV — CONTACT FORM
   Intercepts the contact form submission and sends it to the
   Cloudflare Worker, which relays it as a real email via Brevo.
   ================================================================ */

function initContactFormWorker() {
  var form = document.querySelector('.contact-form[data-managed-by="contact-worker"]');
  if (!form) return;

  var nameField = form.querySelector('input[name="name"]');
  var emailField = form.querySelector('input[name="email"]');
  var messageField = form.querySelector('textarea[name="message"]');
  var status = form.parentElement.querySelector(".form-note");
  var button = form.querySelector('button[type="submit"]');

  var WORKER_URL = "https://contact-form-handler.s-uniculus.workers.dev/";

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    button.disabled = true;
    status.textContent = "";
    status.classList.remove("visible");

    try {
      var response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameField.value.trim(),
          email: emailField.value.trim(),
          message: messageField.value.trim(),
        }),
      });

      var data = await response.json();

      status.textContent = data.message || "Something went wrong. Please try again.";
      status.classList.add("visible");

      if (response.ok) {
        form.reset();
      }
    } catch (error) {
      console.error(error);
      status.textContent = "Connection error. Please try again, or email me directly.";
      status.classList.add("visible");
    } finally {
      button.disabled = false;
    }
  });
}

document.addEventListener("DOMContentLoaded", initContactFormWorker);

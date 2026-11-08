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


/* ================================================================
   ENQUIRY PRE-FILL
   The "Enquire about this piece" links on the piece pages point to
   /contact.html?piece=<short title of the piece>. When that parameter
   is present, the Message field is pre-filled, so the visitor does not
   have to say which piece she is writing about. Name and email stay empty.
   - the text is written with .value (never as HTML)
   - nothing is overwritten if the field already contains text
   - without JavaScript the link still opens the contact page
   ================================================================ */

function prefillEnquiry() {
  var messageField = document.querySelector('.contact-form textarea[name="message"]');
  if (!messageField || messageField.value.trim() !== "") return;

  var piece = new URLSearchParams(window.location.search).get("piece");
  if (!piece) return;

  // plain text only, on one line, with a reasonable length
  piece = piece.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, 150);
  if (!piece) return;

  messageField.value = "I would like to enquire about: " + piece;
}

document.addEventListener("DOMContentLoaded", prefillEnquiry);

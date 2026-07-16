function initNewsletter() {
    const form = document.querySelector('.waitlist form[data-managed-by="newsletter"]');
    if (!form) {
        console.warn("Newsletter form not found.");
        return;
    }

    const email = form.querySelector('input[type="email"]');
    const status = form.parentElement.querySelector('.form-note');
    const button = form.querySelector('button[type="submit"]');

    const WORKER_URL = "https://morning-bread-4717.s-uniculus.workers.dev/";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        button.disabled = true;
        status.textContent = "";

        try {
            const response = await fetch(WORKER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.value.trim()
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Success confirmed by the Worker — send the visitor to
                // a dedicated page rather than just showing an inline note.
                window.location.href = "subscription-pending.html";
                return;
            }

            status.textContent =
                data.message || "Something went wrong. Please try again.";

        } catch (error) {
            console.error(error);
            status.textContent =
                "Connection error. Please try again.";
        } finally {
            button.disabled = false;
        }
    });
}

document.addEventListener("includes:loaded", initNewsletter);
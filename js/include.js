/* ================================================================
   SVETLANA KISSELEV — WEARABLE STRUCTURAL ART
   Include loader — no framework, no build step.

   Any element with a data-include="components/xxx.html" attribute
   gets replaced by the content of that file, fetched at runtime.
   Once every include on the page has finished loading (or failed),
   an "includes:loaded" event is dispatched on the document — this is
   what js/script.js listens for to safely wire up the header nav and
   the newsletter forms, since those only exist after this step runs.
   ================================================================ */
(function () {
  function loadIncludes() {
    var nodes = document.querySelectorAll("[data-include]");

    if (!nodes.length) {
      document.dispatchEvent(new Event("includes:loaded"));
      return;
    }

    var pending = nodes.length;

    function done() {
      pending -= 1;
      if (pending === 0) {
        document.dispatchEvent(new Event("includes:loaded"));
      }
    }

    nodes.forEach(function (node) {
      var path = node.getAttribute("data-include");

      fetch(path)
        .then(function (res) { return res.text(); })
        .then(function (html) {
          node.outerHTML = html;
        })
        .catch(function (err) {
          console.error("Include failed for", path, err);
        })
        .finally(done);
    });
  }

  document.addEventListener("DOMContentLoaded", loadIncludes);
})();

// SustainWater hub: Fluoride in UK water. PLACEHOLDER until the full hub is built.
// Tag name: sw-hub-fluoride  |  Source: public/custom-elements/sw-hub-fluoride.js
// The Editor box for this file stays as it is; the full hub replaces this file's contents later.
(function () {
  'use strict';
  const TITLE = "Fluoride in UK water";
  const LIVE = "/fluoride-in-uk-water";
  const CSS = ':host{display:block;width:100%}.ph{font-family:Montserrat,system-ui,-apple-system,"Segoe UI",sans-serif;background:#F1FCFE;border:1px dashed #0057E1;color:#0046B8;padding:48px 24px;text-align:center}.ph b{display:block;font-size:22px;color:#140A07;margin-bottom:8px}.ph span{font-size:14px}.ph a{color:#0057E1;font-weight:600}';
  class Hub extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = '<style>' + CSS + '</style><div class="ph"><b>' + TITLE + '</b><span>New hub in progress. This private preview box fills in when the hub code is pushed. The live page is still <a href="' + LIVE + '">' + LIVE + '</a>.</span></div>';
    }
  }
  if (!customElements.get("sw-hub-fluoride")) customElements.define("sw-hub-fluoride", Hub);
})();

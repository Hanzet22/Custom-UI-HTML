// ==PCAPdroid==
// @name         infurnity-injector
// @version      1.0
// @author       Farhan (海鹏 鸟神 / Hanzet22)
// @description  Custom UI Injector — Fetch HTML from GitHub raw and inject into infurnity.com
// @match        *://*.infurnity.com/*
// ==/PCAPdroid==

(function () {
  'use strict';

  const RAW_URL = 'https://raw.githubusercontent.com/Hanzet22/Custom-UI-HTML/main/Infurnity/Infurnity-Custom-UI.html';
  const TARGET_HOST = 'infurnity.com';

  // Cek domain dulu
  if (!window.location.hostname.includes(TARGET_HOST)) return;

  // Jangan inject dua kali
  if (document.getElementById('__infurnity_custom_ui__')) return;

  console.log('[Infurnity Injector] v1.0 - Fetching custom UI...');

  fetch(RAW_URL)
    .then(res => {
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      return res.text();
    })
    .then(html => {
      // Bikin wrapper overlay
      const wrapper = document.createElement('div');
      wrapper.id = '__infurnity_custom_ui__';
      wrapper.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        width: 100%;
        height: 100%;
        border: none;
        background: #0a0a0a;
      `;

      // Inject via iframe srcdoc biar isolated
      const iframe = document.createElement('iframe');
      iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: transparent;
      `;
      iframe.srcdoc = html;
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('scrolling', 'yes');

      wrapper.appendChild(iframe);
      document.body.appendChild(wrapper);

      console.log('[Infurnity Injector] Custom UI injected successfully ✅');
    })
    .catch(err => {
      console.error('[Infurnity Injector] Failed to load UI:', err);
    });

})();

// ==PCAPdroid==
// @name         infurnity-injector
// @version      2.0
// @author       Farhan (海鹏 鸟神 / Hanzet22)
// @description  Custom UI Injector — Fetch HTML from GitHub raw + Eruda Debug Console
// @match        *://*.infurnity.com/*
// ==/PCAPdroid==

(function () {
  'use strict';

  const RAW_URL = 'https://raw.githubusercontent.com/Hanzet22/Custom-UI-HTML/main/Infurnity/Infurnity-Custom-UI.html';
  const TARGET_HOST = 'infurnity.com';
  const ERUDA_URL = '//cdn.jsdelivr.net/npm/eruda';

  // Cek domain dulu
  if (!window.location.hostname.includes(TARGET_HOST)) return;

  // Jangan inject dua kali
  if (document.getElementById('__infurnity_custom_ui__')) return;

  // ==================== LOAD ERUDA DULU ====================
  function loadEruda(callback) {
    if (window.eruda) {
      eruda.init();
      console.log('[Injector] Eruda already loaded ✅');
      callback();
      return;
    }

    const script = document.createElement('script');
    script.src = ERUDA_URL;
    script.onload = function () {
      eruda.init();
      console.log('[Injector] Eruda loaded ✅');
      callback();
    };
    script.onerror = function () {
      console.warn('[Injector] Eruda failed to load — continuing without debug console');
      callback();
    };
    document.body
      ? document.body.appendChild(script)
      : document.documentElement.appendChild(script);
  }

  // ==================== INJECT CUSTOM UI ====================
  function injectUI() {
    console.log('[Infurnity Injector] v2.0 - Fetching custom UI from GitHub...');
    console.log('[Infurnity Injector] URL:', RAW_URL);

    fetch(RAW_URL, { cache: 'no-cache' })
      .then(res => {
        console.log('[Infurnity Injector] Fetch status:', res.status);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
        return res.text();
      })
      .then(html => {
        if (!html || html.trim().length === 0) {
          throw new Error('HTML content is empty — check GitHub raw URL');
        }

        console.log('[Infurnity Injector] HTML fetched, length:', html.length, 'chars');

        // Bikin wrapper overlay
        const wrapper = document.createElement('div');
        wrapper.id = '__infurnity_custom_ui__';
        wrapper.style.cssText = [
          'position:fixed',
          'inset:0',
          'z-index:2147483647',
          'width:100%',
          'height:100%',
          'background:#0a0a0a',
          'overflow:hidden'
        ].join(';');

        // Inject via iframe srcdoc biar CSS isolated
        const iframe = document.createElement('iframe');
        iframe.style.cssText = [
          'width:100%',
          'height:100%',
          'border:none',
          'background:transparent',
          'display:block'
        ].join(';');

        iframe.srcdoc = html;
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('scrolling', 'yes');
        iframe.setAttribute('sandbox', [
          'allow-scripts',
          'allow-same-origin',
          'allow-popups',
          'allow-forms',
          'allow-top-navigation'
        ].join(' '));

        iframe.onload = function () {
          console.log('[Infurnity Injector] iframe loaded ✅');
        };

        iframe.onerror = function (e) {
          console.error('[Infurnity Injector] iframe error:', e);
        };

        wrapper.appendChild(iframe);

        // Append ke body — fallback ke documentElement
        const target = document.body || document.documentElement;
        target.appendChild(wrapper);

        console.log('[Infurnity Injector] Custom UI injected successfully ✅');
      })
      .catch(err => {
        console.error('[Infurnity Injector] FAILED:', err.message);
        console.error('[Infurnity Injector] Stack:', err.stack);
      });
  }

  // ==================== MAIN ====================
  function main() {
    loadEruda(function () {
      injectUI();
    });
  }

  // Tunggu DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }

})();

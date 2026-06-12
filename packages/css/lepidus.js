/**
 * lepidus.js — Lepidus Design System, vanilla behavior layer
 *
 * Companion to @lepidus/css for HTML/CSS/JS apps (no framework, no build
 * tool). Bootstrap-style: write the documented markup with data attributes
 * and include this script — components initialize themselves on
 * DOMContentLoaded. Everything is also callable manually via window.Lepidus
 * (e.g. after injecting markup dynamically, call Lepidus.init(container)).
 *
 * Components:
 *   Tabs   — <div class="lp-tabs" role="tablist" data-lp-tabs> with
 *            role="tab" buttons; panels referenced by aria-controls.
 *            Click + ArrowLeft/Right/Home/End, roving tabindex.
 *   Modal  — <div class="lp-modal" id="…" hidden> opened by
 *            [data-lp-modal-open="id"], closed by [data-lp-modal-close],
 *            Escape, or a backdrop click. Focus is trapped while open and
 *            restored on close.
 */
(function () {
  'use strict';

  var FOCUSABLE =
    'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), ' +
    'textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

  /* === TABS === */

  function activateTab(tablist, tab) {
    var tabs = tablist.querySelectorAll('[role="tab"]');
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.classList.toggle('lp-tabs__tab--active', selected);
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      var panel = t.getAttribute('aria-controls');
      var el = panel && document.getElementById(panel);
      if (el) el.hidden = !selected;
    });
  }

  function initTabs(tablist) {
    if (tablist.dataset.lpReady) return;
    tablist.dataset.lpReady = 'true';
    var current =
      tablist.querySelector('[role="tab"][aria-selected="true"]') ||
      tablist.querySelector('[role="tab"]');
    if (current) activateTab(tablist, current);

    tablist.addEventListener('click', function (e) {
      var tab = e.target.closest('[role="tab"]');
      if (tab && !tab.disabled) activateTab(tablist, tab);
    });

    tablist.addEventListener('keydown', function (e) {
      var keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (keys.indexOf(e.key) === -1) return;
      var tabs = Array.prototype.filter.call(
        tablist.querySelectorAll('[role="tab"]'),
        function (t) { return !t.disabled; }
      );
      var i = tabs.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      var rtl = getComputedStyle(tablist).direction === 'rtl';
      var next = e.key === 'Home' ? 0
        : e.key === 'End' ? tabs.length - 1
        : (e.key === 'ArrowRight') !== rtl
          ? (i + 1) % tabs.length
          : (i - 1 + tabs.length) % tabs.length;
      tabs[next].focus();
      activateTab(tablist, tabs[next]);
    });
  }

  /* === MODAL === */

  var openModalEl = null;
  var lastFocused = null;

  function openModal(idOrEl) {
    var modal = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
    if (!modal || !modal.hidden) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    openModalEl = modal;
    var target =
      modal.querySelector('[data-lp-autofocus]') || modal.querySelector(FOCUSABLE);
    if (target) target.focus();
  }

  function closeModal() {
    if (!openModalEl) return;
    openModalEl.hidden = true;
    openModalEl = null;
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
    lastFocused = null;
  }

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-lp-modal-open]');
    if (opener) {
      openModal(opener.getAttribute('data-lp-modal-open'));
      return;
    }
    if (!openModalEl) return;
    if (e.target.closest('[data-lp-modal-close]')) {
      closeModal();
    } else if (e.target === openModalEl) {
      // click landed on the backdrop itself, not the shell
      closeModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!openModalEl) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key !== 'Tab') return;
    // Focus trap — cycle within the open modal.
    var focusables = openModalEl.querySelectorAll(FOCUSABLE);
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (!openModalEl.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    }
  });

  /* === INIT === */

  function init(root) {
    (root || document)
      .querySelectorAll('[data-lp-tabs]')
      .forEach(initTabs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    init();
  }

  window.Lepidus = {
    init: init,
    initTabs: initTabs,
    openModal: openModal,
    closeModal: closeModal,
  };
})();

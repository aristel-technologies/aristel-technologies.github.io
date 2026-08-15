/* ============================================================
   ARISTEL TECHNOLOGIES — Interactions
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Theme toggle (dark / light) ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "light" ? "Activer le mode sombre" : "Activer le mode clair"
      );
    }
  }

  var stored = null;
  try {
    stored = localStorage.getItem("aristel-theme");
  } catch (e) {
    stored = null;
  }

  if (stored === "light" || stored === "dark") {
    applyTheme(stored);
  } else {
    var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLight ? "light" : "dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem("aristel-theme", next);
      } catch (e) {
        /* ignore */
      }
    });
  }

  /* ---------- Language switch (FR default / EN) ---------- */
  var dict = window.ARISTEL_I18N || { fr: {}, en: {} };
  var langToggle = document.getElementById("lang-toggle");
  var langLabel = document.getElementById("lang-label");

  function applyLanguage(lang) {
    if (lang !== "fr" && lang !== "en") lang = "fr";
    var table = dict[lang] || {};

    root.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = table[el.getAttribute("data-i18n")];
      if (typeof value === "string") el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var value = table[el.getAttribute("data-i18n-html")];
      if (typeof value === "string") el.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var value = table[el.getAttribute("data-i18n-aria")];
      if (typeof value === "string") el.setAttribute("aria-label", value);
    });

    if (langLabel) langLabel.textContent = lang === "fr" ? "EN" : "FR";
    if (langToggle) {
      langToggle.setAttribute(
        "aria-label",
        lang === "fr" ? "Switch to English" : "Passer en français"
      );
    }
  }

  var storedLang = null;
  try {
    storedLang = localStorage.getItem("aristel-lang");
  } catch (e) {
    storedLang = null;
  }

  applyLanguage(storedLang === "en" ? "en" : "fr");

  if (langToggle) {
    langToggle.addEventListener("click", function () {
      var next = root.getAttribute("lang") === "fr" ? "en" : "fr";
      applyLanguage(next);
      try {
        localStorage.setItem("aristel-lang", next);
      } catch (e) {
        /* ignore */
      }
    });
  }

  /* ---------- Mobile navigation ---------- */
  var menuButton = document.getElementById("menu-button");
  var navLinks = document.getElementById("nav-links");

  function closeMenu() {
    if (!navLinks || !menuButton) return;
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    /* Close when clicking outside */
    document.addEventListener("click", function (event) {
      if (!navLinks.classList.contains("open")) return;
      if (navLinks.contains(event.target) || menuButton.contains(event.target)) return;
      closeMenu();
    });

    /* Close on Escape */
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  /* ---------- Navbar shadow on scroll ---------- */
  var navbar = document.getElementById("navbar");

  function onScroll() {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 12);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .stagger");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }
})();

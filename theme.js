(() => {
  "use strict";

  // Keep the existing key so the saved theme is shared with the site's
  // previous theme setting and persists across all pages on this origin.
  const THEME_KEY = "physics-theme";
  const DARK_VALUE = "dark";
  const LIGHT_VALUE = "light";

  function readSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY) === DARK_VALUE;
    } catch (error) {
      // The page can still work when browser storage is unavailable.
      return false;
    }
  }

  function saveTheme(isDark) {
    try {
      localStorage.setItem(THEME_KEY, isDark ? DARK_VALUE : LIGHT_VALUE);
    } catch (error) {
      // Keep the current page toggle usable even if storage is blocked.
    }
  }

  function applyTheme(isDark) {
    const body = document.body;
    if (!body) return;

    // cosmic-dark is the state class used by cosmic.css. Keep dark as well
    // for compatibility with the site's existing styles.css variables.
    body.classList.toggle("cosmic-dark", isDark);
    body.classList.toggle("dark", isDark);

    const toggle = document.getElementById("themeToggle");
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
      toggle.title = isDark ? "Switch to light theme" : "Switch to dark theme";
    }
  }

  // A deferred head script runs after HTML parsing, so the body and button
  // are available here. Apply the saved state before wiring the toggle.
  applyTheme(readSavedTheme());

  document.getElementById("themeToggle")?.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("cosmic-dark");
    applyTheme(isDark);
    saveTheme(isDark);
  });

  // Keep already-open tabs synchronized if the theme changes in another tab.
  window.addEventListener("storage", (event) => {
    if (event.key === THEME_KEY) {
      applyTheme(event.newValue === DARK_VALUE);
    }
  });
})();
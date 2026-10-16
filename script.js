/* script.js — full file
   - Theme toggle (localStorage)
   - Review submit behavior
   - Formula toggle
   - Resource search & filtering
   - Account temporary system (sessionStorage)
*/

(() => {
  // ----------------------
  // THEME TOGGLE (existing)
  // ----------------------
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");

  // Apply saved theme from localStorage (persistent across sessions)
  const savedTheme = localStorage.getItem("physics-theme");
  if (savedTheme === "dark") body.classList.add("dark");

  themeToggle?.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark");
    localStorage.setItem("physics-theme", isDark ? "dark" : "light");
  });

  // ----------------------
  // REVIEW SUBMIT (existing)
  // ----------------------
  const reviewInput = document.getElementById("reviewInput");
  const reviewSuccess = document.getElementById("reviewSuccess");
  const submitReview = document.getElementById("submitReview");

  submitReview?.addEventListener("click", () => {
    const value = reviewInput?.value.trim();

    if (!value) {
      reviewSuccess.textContent = "Please enter a suggestion before submitting.";
      reviewSuccess.classList.add("show");
      return;
    }

    // No DB: we just show a success message
    reviewSuccess.textContent = "Thank you! Your review has been submitted.";
    reviewSuccess.classList.add("show");

    if (reviewInput) reviewInput.value = "";

    // Optionally hide the message after a short time
    setTimeout(() => {
      reviewSuccess.classList.remove("show");
      reviewSuccess.textContent = "";
    }, 4000);
  });

  // ----------------------
  // FORMULA TOGGLE (existing)
  // ----------------------
  const formulaCard = document.querySelector(".formula-card");
  const formulaToggle = document.querySelector(".formula-toggle");

  if (formulaCard && formulaToggle) {
    formulaToggle.addEventListener("click", () => {
      formulaCard.classList.toggle("open");
      const expanded = formulaCard.classList.contains("open");
      formulaToggle.setAttribute("aria-expanded", expanded);
    });
  }

  // ----------------------
  // RESOURCE FILTERING (existing)
  // ----------------------
  const resourceSearch = document.getElementById("resourceSearch");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const rows = document.querySelectorAll("#resourceTableBody tr");

  let activeBranch = "all";

  function applyFilters() {
    const searchText = resourceSearch ? resourceSearch.value.trim().toLowerCase() : "";

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      const branchMatch = activeBranch === "all" || row.dataset.branch === activeBranch;
      const searchMatch = text.includes(searchText);

      row.classList.toggle("hidden-row", !(branchMatch && searchMatch));
    });
  }

  resourceSearch?.addEventListener("input", applyFilters);

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeBranch = button.dataset.branch;
      filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
      applyFilters();
    });
  });

  applyFilters();

  // ----------------------
  // TEMPORARY ACCOUNT SYSTEM (sessionStorage)
  // ----------------------
  // Session-only key (cleared when tab closes)
  const ACCOUNT_KEY = "physics-username";

  // DOM refs
  const accountAvatar = document.getElementById("accountAvatar");
  const accountMenu = document.getElementById("accountMenu");
  const accountMenuInner = document.getElementById("accountMenuInner");
  const accountLabel = document.getElementById("accountLabel");
  // ensure account elements exist before proceeding
  const accountElementsPresent = accountAvatar && accountMenu && accountMenuInner;

  // utility: render menu in logged-out state (login form)
  function renderLoginMenu() {
    accountMenuInner.innerHTML = `
      <div style="padding:10px 6px;">
        <div style="font-weight:700; margin-bottom:8px; color:var(--primary-dark)">Temporary Sign In</div>
        <label for="tmp-username" style="display:block; font-size:0.85rem; color:var(--muted); margin-bottom:6px;">Enter a username</label>
        <input id="tmp-username" type="text" placeholder="e.g. Anuj123" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--panel-alt); color:var(--text); margin-bottom:8px;" />
        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button id="accountSaveBtn" class="btn btn-primary" style="padding:8px 12px; font-weight:700;">Save</button>
        </div>
        <p style="font-size:0.8rem; color:var(--muted); margin-top:8px;">Session-only username stored in this tab. No account required.</p>
      </div>
    `;

    // Attach save handler
    const saveBtn = document.getElementById("accountSaveBtn");
    const input = document.getElementById("tmp-username");
    saveBtn?.addEventListener("click", () => {
      const username = input?.value.trim();
      if (!username) {
        // small inline validation (no UI library)
        input?.focus();
        input?.classList.add("invalid");
        setTimeout(() => input?.classList.remove("invalid"), 900);
        return;
      }
      sessionStorage.setItem(ACCOUNT_KEY, username);
      closeAccountMenu();
      updateAccountUI(username);
    });

    // allow Enter to save
    input?.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        document.getElementById("accountSaveBtn")?.click();
      }
    });
  }

  // utility: render menu in logged-in state (welcome + logout)
  function renderLoggedInMenu(username) {
    accountMenuInner.innerHTML = `
      <div style="padding:10px 6px;">
        <div style="font-weight:800; margin-bottom:8px; color:var(--primary-dark)">Welcome</div>
        <div style="font-size:1.05rem; font-weight:700; margin-bottom:10px; color:var(--text);">${escapeHtml(username)}</div>
        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button id="accountLogoutBtn" class="btn" style="padding:8px 12px; background:transparent; border:1px solid var(--border);">Log Out</button>
        </div>
        <p style="font-size:0.8rem; color:var(--muted); margin-top:8px;">This is a temporary session username. It will clear when the tab is closed or when you log out.</p>
      </div>
    `;

    const logoutBtn = document.getElementById("accountLogoutBtn");
    logoutBtn?.addEventListener("click", () => {
      sessionStorage.removeItem(ACCOUNT_KEY);
      closeAccountMenu();
      updateAccountUI(null);
    });
  }

  // open / close helpers
  function openAccountMenu() {
    accountMenu.classList.add("open");
    accountMenu.setAttribute("aria-hidden", "false");
    accountAvatar.setAttribute("aria-expanded", "true");
    // add document click handler to close when clicking outside
    document.addEventListener("click", docClickHandler);
  }

  function closeAccountMenu() {
    accountMenu.classList.remove("open");
    accountMenu.setAttribute("aria-hidden", "true");
    accountAvatar.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", docClickHandler);
  }

  function toggleAccountMenu() {
    if (accountMenu.classList.contains("open")) {
      closeAccountMenu();
    } else {
      const stored = sessionStorage.getItem(ACCOUNT_KEY);
      if (stored) renderLoggedInMenu(stored);
      else renderLoginMenu();
      openAccountMenu();
      // focus first input if present
      setTimeout(() => {
        const input = document.getElementById("tmp-username");
        input?.focus();
      }, 40);
    }
  }

  function docClickHandler(e) {
    const target = e.target;
    if (!accountAvatar.contains(target) && !accountMenu.contains(target)) {
      closeAccountMenu();
    }
  }

  // update header label and avatar title based on username
  function updateAccountUI(username) {
    if (!accountElementsPresent) return;

    if (username) {
      accountLabel.textContent = `Hi, ${username}`;
      accountAvatar.title = `Signed in as ${username}`;
      accountAvatar.classList.add("signed-in");
      // small accessible label
      accountAvatar.setAttribute("aria-label", `Account — signed in as ${username}`);
    } else {
      accountLabel.textContent = "";
      accountAvatar.title = "No account signed in";
      accountAvatar.classList.remove("signed-in");
      accountAvatar.setAttribute("aria-label", "No account signed in");
    }
  }

  // helper to escape HTML in username display
  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  // init account UI
  if (accountElementsPresent) {
    accountAvatar.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleAccountMenu();
    });

    // on load, set UI if username exists
    const existing = sessionStorage.getItem(ACCOUNT_KEY);
    if (existing) {
      updateAccountUI(existing);
    } else {
      updateAccountUI(null);
    }

    // ensure menu closes on Esc
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAccountMenu();
    });
  }

  // expose function for other scripts if needed
  window.PhysicsHubAccount = {
    getUsername: () => sessionStorage.getItem(ACCOUNT_KEY),
    clear: () => {
      sessionStorage.removeItem(ACCOUNT_KEY);
      if (accountElementsPresent) updateAccountUI(null);
    }
  };
})();

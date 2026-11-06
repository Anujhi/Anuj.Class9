(() => {
  const search = document.getElementById("resourceSearch");
  const table = document.querySelector(".table-wrap");

  if (!search || !table) return;

  const ACCESS_KEY = "038d570f-cc2e-4c71-935f-d5c24509203f";

  const overlay = document.createElement("div");
  overlay.className = "resource-secret";
  overlay.hidden = true;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Hidden experience");
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <button class="resource-secret__close" type="button" aria-label="Exit hidden experience">×</button>
    <div class="resource-secret__content">
      <div class="resource-secret__mark" aria-live="polite"></div>
      <div class="resource-secret__choices" hidden>
        <button class="resource-secret__choice" type="button" data-choice="YES">YES</button>
        <button class="resource-secret__choice" type="button" data-choice="NO">NO</button>
      </div>
      <p class="resource-secret__status" aria-live="polite"></p>
    </div>
  `;
  document.body.append(overlay);

  const closeButton = overlay.querySelector(".resource-secret__close");
  const mark = overlay.querySelector(".resource-secret__mark");
  const choices = overlay.querySelector(".resource-secret__choices");
  const status = overlay.querySelector(".resource-secret__status");
  const choiceButtons = overlay.querySelectorAll("[data-choice]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let isOpen = false;
  let selectionMade = false;
  let revealTimer;

  function openExperience() {
    if (isOpen) return;

    isOpen = true;
    selectionMade = false;
    table.hidden = true;
    overlay.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    mark.textContent = "";
    mark.classList.remove("is-shown");
    choices.hidden = true;
    choices.classList.remove("is-shown");
    status.textContent = "";
    overlay.removeAttribute("data-selection");

    requestAnimationFrame(() => overlay.classList.add("is-visible"));

    revealTimer = setTimeout(() => {
      mark.textContent = "::";
      mark.classList.add("is-shown");

      setTimeout(() => {
        if (!isOpen) return;
        choices.hidden = false;
        requestAnimationFrame(() => choices.classList.add("is-shown"));
        choiceButtons[0].focus();
      }, reduceMotion.matches ? 50 : 850);
    }, reduceMotion.matches ? 20 : 350);

    document.addEventListener("keydown", handleKeydown);
  }

  function closeExperience() {
    if (!isOpen) return;

    isOpen = false;
    clearTimeout(revealTimer);
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", handleKeydown);

    setTimeout(() => {
      if (isOpen) return;
      overlay.hidden = true;
      table.hidden = false;
      search.value = "";
      search.dispatchEvent(new Event("input", { bubbles: true }));
      search.focus();
    }, reduceMotion.matches ? 0 : 720);
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeExperience();
    }
  }

  async function sendInteraction(selection) {
    const timestamp = new Date().toISOString();
    const payload = {
      access_key: ACCESS_KEY,
      subject: "Website Easter Egg Interaction",
      name: `Selection: ${selection}`,
      message: [
        `User's selection: ${selection}`,
        "Page: Resources",
        "Trigger: ##",
        `Timestamp: ${timestamp}`
      ].join("\n")
    };

    status.textContent = "Sending…";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success !== true) {
        throw new Error("Submission was not accepted");
      }

      status.textContent = "Sent";
    } catch (error) {
      console.error("Easter egg submission failed:", error);
      status.textContent = "Not sent — please check your connection.";
    }
  }

  choiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!isOpen || selectionMade) return;

      selectionMade = true;
      const selection = button.dataset.choice;
      const finalText = selection === "YES" ? "anuj" : "juna";

      overlay.dataset.selection = selection.toLowerCase();
      choices.hidden = true;
      choices.classList.remove("is-shown");
      mark.classList.remove("is-shown");
      void mark.offsetWidth;
      mark.textContent = finalText;
      mark.classList.add("is-shown");

      sendInteraction(selection);
    });
  });

  closeButton.addEventListener("click", closeExperience);

  search.addEventListener("input", () => {
    if (search.value === "##") openExperience();
  });
})();
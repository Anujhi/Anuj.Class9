const body = document.body;
const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("physics-theme");
if (savedTheme === "dark") {
  body.classList.add("dark");
}

themeToggle?.addEventListener("click", () => {
  const isDark = body.classList.toggle("dark");
  localStorage.setItem("physics-theme", isDark ? "dark" : "light");
});

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

  reviewSuccess.textContent = "Thank you! Your review has been submitted.";
  reviewSuccess.classList.add("show");

  if (reviewInput) reviewInput.value = "";
});

const formulaCard = document.querySelector(".formula-card");
const formulaToggle = document.querySelector(".formula-toggle");

if (formulaCard && formulaToggle) {
  formulaToggle.addEventListener("click", () => {
    formulaCard.classList.toggle("open");
    const expanded = formulaCard.classList.contains("open");
    formulaToggle.setAttribute("aria-expanded", expanded);
  });
}

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
// Theme toggle: remember preference in localStorage
(function () {
  const body = document.body;
  const toggle = document.getElementById('themeToggle');

  // Apply saved theme
  const saved = localStorage.getItem('physics-theme');
  if (saved === 'dark') body.classList.add('dark');

  toggle?.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    localStorage.setItem('physics-theme', isDark ? 'dark' : 'light');
  });
})();

// Account avatar placeholder behavior (optional): small toast or alert
(function () {
  const avatar = document.getElementById('accountAvatar');
  avatar?.addEventListener('click', () => {
    // Keep this minimal — replace with modal or real auth later
    alert('No account is signed in. This is a placeholder avatar.');
  });
})();

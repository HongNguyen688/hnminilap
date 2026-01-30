/* ============================
   loadfiles.js
   Loads header + footer
   Initializes global search + theme
============================ */

/* ----------------------------
   Project Map
   Add any new project here
---------------------------- */
const projects = [
  { name: "Calculator", url: "/projects/calculator/calculator.html" },
  { name: "Coin", url: "/projects/coinflip/coin.html" },
  { name: "Dice Roller", url: "/projects/dice-roller/dice.html" },
  { name: "Habit Tracker", url: "/projects/habit-tracker/habit.html" },
  { name: "Memory Cards", url: "/projects/memory-card/memorycard.html" },
  { name: "Pomodoro & Task", url: "/projects/pomodoro/pomodoro.html" },
  { name: "Quote", url: "/projects/quote-generator/quote.html" },
  {
    name: "Rock-Paper-Scissors",
    url: "/projects/rock-paper-scissors/rockpaperscissors.html",
  },
  { name: "Tic Tac Toe", url: "/projects/tic-tac-toe/tictactoe.html" },
];

/* ----------------------------
   Utility: normalize string
---------------------------- */
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[\s-]/g, "") // remove spaces + dashes
    .replace(/[^a-z0-9]/g, ""); // remove symbols
}

/* ----------------------------
   Load header,footer & main container
----------------------------------------- */
async function loadComponent(selector, file) {
  const element = document.querySelector(selector);
  if (!element) return;

  // Hide until loaded
  element.style.visibility = "hidden";

  try {
    const response = await fetch(file);
    const htmlText = await response.text();
    element.innerHTML = htmlText;
    element.style.visibility = "visible";

    // If header loaded → init theme + search
    if (file.includes("header")) {
      initThemeToggle();
      initSearchFeature();
    }

    //Show main content when header is ready
    const mainContent = document.getElementById("main__content");
    if (mainContent) mainContent.style.display = "block";
  } catch (error) {
    console.error("Failed to load this file: ", file);
    console.error("Error details: ", error);
  }
}

// Load header & footer
loadComponent("#main__header", "/static/components/header.html");
loadComponent("#main__footer", "/static/components/footer.html");
loadComponent("#app__layout-left", "/static/components/applayout-left.html");
loadComponent("#app__layout-right", "/static/components/applayout-right.html");

/* ----------------------------
   Theme Toggle
---------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById("themeToggle");

  // If the button doesn't exist on the page, stop the function
  if (!toggleBtn) {
    return; // exit early
  }

  toggleBtn.addEventListener("click", function () {
    document.documentElement.classList.toggle("dark-mode");

    // Check if dark mode is now active
    const isDarkMode = document.documentElement.classList.contains("dark-mode");

    if (isDarkMode) {
      localStorage.setItem("theme", "dark"); // save "dark"
    } else {
      localStorage.setItem("theme", "light"); // save "light"
    }
  });

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark-mode");
  }
}

/* ----------------------------
   Global Search Feature
---------------------------- */
function initSearchFeature() {
  const searchBar = document.getElementById("js__searchBar");
  const clearX = document.getElementById("js__clearSearch");

  if (!searchBar) return;

  // Initially hide clear X
  if (clearX) clearX.style.display = "none";

  /* Live Search & show/hide X */
  searchBar.addEventListener("input", () => {
    const query = searchBar.value;
    filterProjects(query);
    if (clearX) clearX.style.display = query ? "block" : "none";
  });

  /* Clear X */
  if (clearX) {
    clearX.addEventListener("click", () => {
      searchBar.value = "";
      filterProjects("");
      clearX.style.display = "none";
      searchBar.focus();
    });
  }

  /* Enter key → open first matching project */
  searchBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const query = searchBar.value;
      const normalizedQuery = normalize(query);

      for (const project of projects) {
        if (normalize(project.name).includes(normalizedQuery)) {
          window.location.href = project.url; // navigate to project
          break;
        }
      }
    }
  });
}

/* ----------------------------
   Filter Projects on current page
---------------------------- */
function filterProjects(query) {
  const cards = document.querySelectorAll(".card__content");
  const normalizedQuery = normalize(query);

  cards.forEach((card) => {
    const title = card.querySelector("h3")?.innerText || "";
    card.style.display = normalize(title).includes(normalizedQuery)
      ? ""
      : "none";
  });
}

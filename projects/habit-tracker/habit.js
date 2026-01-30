/* ===== GET ELEMENTS FROM HTML ===== */
const habitsList = document.getElementById("js__habitsList");
const monthYear = document.getElementById("js__month-year");
const calendar = document.getElementById("js__calendar");
const prevMonthBtn = document.getElementById("js__prev-month");
const nextMonthBtn = document.getElementById("js__next-month");

/* ===== LOAD DATA ===== */
// Get habits from localStorage or start with empty array
let habits = JSON.parse(localStorage.getItem("habits-v2")) || [];
let currentDate = new Date();

/* ===== CALENDAR ===== */
function renderCalendar() {
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Show month and year (ex: January 2026)
  monthYear.textContent = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Weekday names
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  weekDays.forEach((day) => {
    const dayNameEl = document.createElement("div");
    dayNameEl.className = "day-name";
    dayNameEl.textContent = day;
    calendar.appendChild(dayNameEl);
  });

  // Get first weekday and total days in month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Empty cells before day 1
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "day empty";
    calendar.appendChild(emptyCell);
  }

  // Create day cells
  for (let day = 1; day <= totalDays; day++) {
    const dayEl = document.createElement("div");
    dayEl.className = "day";
    dayEl.textContent = day;

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;

    const today = new Date().toISOString().split("T")[0];
    if (dateStr === today) {
      dayEl.classList.add("today");
    }

    // Check if any habit was done on this day
    const hasDoneHabit = habits.some(
      (habit) => habit.dates && habit.dates.includes(dateStr),
    );

    if (hasDoneHabit) {
      dayEl.classList.add("done");
    }

    calendar.appendChild(dayEl);
  }
}

/* ===== STREAK ===== */
function getStreak(habit) {
  if (!habit.dates || habit.dates.length === 0) return 0;

  let streak = 0;
  let dateToCheck = new Date();

  while (true) {
    const dateStr = dateToCheck.toISOString().split("T")[0];

    if (habit.dates.includes(dateStr)) {
      streak++;
      dateToCheck.setDate(dateToCheck.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/* ===== STREAK EMOJI ===== */
function getFireText(streak) {
  if (streak >= 1000) return "🔥 x1000";
  if (streak >= 365) return "🔥 x365";
  if (streak >= 100) return "🔥 x100";
  if (streak >= 30) return "🔥 x30";
  if (streak >= 7) return "🔥 x7";
  if (streak >= 3) return "🔥 x3";
  if (streak >= 1) return "🔥";
  return "";
}

/* ===== HABITS LIST ===== */
function renderHabits() {
  habitsList.innerHTML = "";

  if (habits.length === 0) {
    habitsList.innerHTML =
      '<p style="text-align:center;opacity:0.8;font-size:1.4rem;margin:3rem 0;">No habits yet. Add one to begin!</p>';
    return;
  }

  habits.forEach((habit, index) => {
    const streak = getStreak(habit);

    const habitEl = document.createElement("div");
    habitEl.className = "habit-item";

    habitEl.innerHTML = `
      <div class="habit-name">
        ${habit.name}
        <button class="edit-btn" data-index="${index}">✎</button>
        <button class="delete-btn" data-index="${index}">🗑️</button>
      </div>

      <div class="streak">
        <span>${streak}</span>
        <span>${getFireText(streak)}</span>
        <button class="check-btn" data-index="${index}">Check</button>
      </div>
    `;

    habitsList.appendChild(habitEl);
  });
}

/* ===== ADD HABIT ===== */
function addHabit() {
  const input = document.getElementById("new-habit");
  const habitName = input.value.trim();

  if (!habitName) return;

  habits.push({ name: habitName, dates: [] });
  localStorage.setItem("habits-v2", JSON.stringify(habits));

  input.value = "";
  renderHabits();
  renderCalendar();
}

/* ===== EVENTS ===== */
document.addEventListener("click", (e) => {
  if (e.target.id === "add-btn") {
    addHabit();
  }

  if (e.target.classList.contains("check-btn")) {
    const index = e.target.dataset.index;
    const today = new Date().toISOString().split("T")[0];

    habits[index].dates = habits[index].dates || [];

    if (!habits[index].dates.includes(today)) {
      habits[index].dates.push(today);
      localStorage.setItem("habits-v2", JSON.stringify(habits));

      renderHabits();
      renderCalendar();

      const streak = getStreak(habits[index]);
      if ([3, 7, 30, 100, 365, 1000].includes(streak)) {
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
      }
    }
  }

  if (e.target.classList.contains("edit-btn")) {
    const index = e.target.dataset.index;
    const newName = prompt("Edit habit name:", habits[index].name);

    if (newName) {
      habits[index].name = newName.trim();
      localStorage.setItem("habits-v2", JSON.stringify(habits));
      renderHabits();
    }
  }

  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.dataset.index;
    if (confirm(`Delete "${habits[index].name}"?`)) {
      habits.splice(index, 1);
      localStorage.setItem("habits-v2", JSON.stringify(habits));
      renderHabits();
      renderCalendar();
    }
  }

  if (e.target.id === "prev-month") {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  }

  if (e.target.id === "next-month") {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  }
});

/* ===== ENTER KEY ===== */
document.addEventListener("keydown", (e) => {
  if (e.target.id === "new-habit" && e.key === "Enter") {
    addHabit();
  }
});

/* ===== INIT ===== */
renderHabits();
renderCalendar();

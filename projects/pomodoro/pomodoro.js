/*=========================== 
  1. GET ELEMENTS HTML
 ===========================*/
// Timer & display
const timerEl = document.getElementById("js__timer");
const currentTaskEl = document.getElementById("js__current-task");
const progress = document.getElementById("js__progress");
// Buttons
const startBtn = document.getElementById("js__start");
const pauseBtn = document.getElementById("js__pause");
const skipBtn = document.getElementById("js__skip");
const resetBtn = document.getElementById("js__reset");
// Modes (25, 5, 15)
const modes = document.querySelectorAll(".mode");
// Task area
const taskList = document.getElementById("js__task-list");
const completedEl = document.getElementById("js__completed");
const streakEl = document.getElementById("js__streak");
// Sound
const bell = document.getElementById("js__bell");

// localStorage.removeItem("pomo-completed");
// localStorage.removeItem("pomo-streak");
// localStorage.removeItem("pomo-date");

/*=========================== 
  2. DATA WE USE
 ===========================*/
// Get saved tasks from the browser
let savedTasks = localStorage.getItem("pomo-tasks");

// If there are no saved tasks, start with an empty list
if (savedTasks === null) {
  tasks = [];
} else {
  // Convert text into a JavaScript array
  tasks = JSON.parse(savedTasks);
}

let minutes = 25,
  seconds = 0,
  totalSeconds = 25 * 60;
let timer = null;
let isWork = true;

/*=================================== 
  3. DAILY STATS COMPLETED & STREAK
 ====================================*/
// Get today's date as string
const today = new Date().toDateString();

// Load saved stats
let savedCompleted = parseInt(localStorage.getItem("pomo-completed")) || 0;
let savedStreak = parseInt(localStorage.getItem("pomo-streak")) || 0;
let savedDate = localStorage.getItem("pomo-date");

// Reset completedToday if it's a new day
let completedToday = 0;
let streak = savedStreak;

if (savedDate !== today) {
  // It's a new day
  completedToday = 0;

  // If yesterday was the saved date, continue streak
  let yesterday = new Date(Date.now() - 86400000).toDateString();
  if (savedDate === yesterday) {
    streak++;
  } else {
    streak = 0;
  }

  // Save new date and streak
  localStorage.setItem("pomo-date", today);
  localStorage.setItem("pomo-streak", streak);
} else {
  // Same day → keep previous completed count
  completedToday = savedCompleted;
}

// Update UI
completedEl.textContent = completedToday;
streakEl.textContent = streak;

/*=========================== 
  4. TASK FUNCTIONS
 ===========================*/
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    // li.className = `task-item ${task.done ? "done" : ""}`;

    // Give the list item a base class
    li.className = "task-item";

    // If the task is done, add another class
    if (task.done === true) {
      li.className = "task-item done";
    }

    // Create checkbox HTML
    let checkboxHTML = '<input type="checkbox"';

    // If task is done, check the checkbox
    if (task.done === true) {
      checkboxHTML += " checked";
    }

    // Add data-index and close input tag
    checkboxHTML += ' data-index="' + i + '">';

    // Create task text HTML
    let textHTML =
      '<span class="task-text" data-index="' + i + '">' + task.text + "</span>";

    // Create edit button HTML
    let editBtnHTML =
      '<button class="edit-btn" data-index="' + i + '">Edit</button>';

    // Create delete button HTML
    let deleteBtnHTML =
      '<button class="delete-btn" data-index="' + i + '">Delete</button>';

    // Put everything inside the list item
    li.innerHTML = checkboxHTML + textHTML + editBtnHTML + deleteBtnHTML;

    // Checkbox
    li.querySelector("input").onchange = () => toggleTask(i);
    // Edit button
    li.querySelector(".edit-btn").onclick = (e) => {
      e.stopPropagation();
      editTask(i);
    };
    // Delete button
    li.querySelector(".delete-btn").onclick = (e) => {
      e.stopPropagation();
      if (confirm("Delete this task forever?")) {
        tasks.splice(i, 1);
        localStorage.setItem("pomo-tasks", JSON.stringify(tasks));
        renderTasks();
      }
    };

    taskList.appendChild(li);
  });
  updateCurrentTask();
}

function updateCurrentTask() {
  // This will store the next task that is NOT done
  let nextTask = null;

  // Go through all tasks one by one
  for (let i = 0; i < tasks.length; i++) {
    // If the task is not finished
    if (tasks[i].done === false) {
      nextTask = tasks[i];
      break; // Stop looking after we find the first one
    }
  }

  // If we found a task, show its text
  if (nextTask !== null) {
    currentTaskEl.textContent = nextTask.text;
  } else {
    // If all tasks are done
    currentTaskEl.textContent = "All tasks done! Great job!";
  }
}

function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  if (tasks[i].done) {
    completedToday++;
    localStorage.setItem("pomo-completed", completedToday);
    completedEl.textContent = completedToday;
    bell.play().catch(() => {});
  }
  localStorage.setItem("pomo-tasks", JSON.stringify(tasks));
  renderTasks();
}

function editTask(i) {
  const newText = prompt("Edit task:", tasks[i].text);
  if (newText === null) return; // Cancelled
  const trimmed = newText.trim();
  if (trimmed === "") {
    alert("Task cannot be empty!");
    return;
  }
  tasks[i].text = trimmed;
  localStorage.setItem("pomo-tasks", JSON.stringify(tasks));
  renderTasks();
}

function addTask() {
  const input = document.getElementById("new-task");
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  localStorage.setItem("pomo-tasks", JSON.stringify(tasks));
  input.value = "";
  renderTasks();
}

/*=========================== 
  5. TIMER LOGIC
 ===========================*/
function startTimer() {
  if (timer) clearInterval(timer);
  totalSeconds = minutes * 60 + seconds;

  // Start a timer that runs every 1 second (1000 milliseconds)
  timer = setInterval(function () {
    // CASE 1: Seconds are already 0
    if (seconds === 0) {
      // CASE 1A: Minutes are also 0 → time is finished
      if (minutes === 0) {
        // Stop the timer
        clearInterval(timer);

        // Play sound
        bell.play().catch(function () {});

        // If this was a work session, mark the next task as done
        if (isWork === true) {
          // Look for the first task that is NOT done
          let nextTaskIndex = -1;

          for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].done === false) {
              nextTaskIndex = i;
              break;
            }
          }

          // If we found a task, toggle it
          if (nextTaskIndex !== -1) {
            toggleTask(nextTaskIndex);
          }
        }

        // Show message to user
        if (isWork === true) {
          alert("Time for a break!");
        } else {
          alert("Back to work!");
        }

        // Switch between work and break
        autoNextSession();

        // Update buttons
        startBtn.classList.remove("hidden");
        pauseBtn.classList.add("hidden");

        // Stop running this function
        return;
      }

      // CASE 1B: Seconds are 0 but minutes are not
      minutes = minutes - 1;
      seconds = 59;
    } else {
      // CASE 2: Seconds are greater than 0
      seconds = seconds - 1;
    }

    // Update timer text on screen
    timerEl.textContent =
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");

    // Update circular progress bar
    let timeLeft = minutes * 60 + seconds;
    let timePassed = totalSeconds - timeLeft;

    progress.style.strokeDashoffset = 816 - (816 * timePassed) / totalSeconds;
  }, 1000);

  startBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");
}

function autoNextSession(skip = false) {
  // If we are skipping a work session, count it as completed
  if (isWork && skip) {
    completedToday++;
    completedEl.textContent = completedToday;
    localStorage.setItem("pomo-completed", completedToday);
  }

  let nextIsWork = !isWork;

  if (nextIsWork) {
    minutes = 25; // work
  } else {
    // break
    if (completedToday % 2 === 0 && completedToday !== 0) {
      minutes = 15; // long break
    } else {
      minutes = 5; // short break
    }
  }

  isWork = nextIsWork;
  seconds = 0;

  timerEl.textContent = String(minutes).padStart(2, "0") + ":00";
  progress.style.strokeDashoffset = 816;
}

/*=========================== 
  6. CONTROL BUTTON EVENTS
 ===========================*/
startBtn.onclick = () => {
  startTimer();
  bell.play().catch(() => {});
};

pauseBtn.onclick = () => {
  clearInterval(timer);
  timer = null;
  startBtn.classList.remove("hidden");
  pauseBtn.classList.add("hidden");
};

// skipBtn.onclick = autoNextSession;
// When skip button is clicked, tell autoNextSession it's a skip
skipBtn.onclick = function () {
  autoNextSession(true);
};

resetBtn.onclick = () => {
  clearInterval(timer);
  timer = null;
  minutes = 25;
  seconds = 0;
  timerEl.textContent = "25:00";
  progress.style.strokeDashoffset = 816;
  startBtn.classList.remove("hidden");
  pauseBtn.classList.add("hidden");
};

// Go through each mode button (25, 5, 15, etc.)
for (let i = 0; i < modes.length; i++) {
  let modeButton = modes[i];

  // When this mode button is clicked
  modeButton.onclick = function () {
    // Remove "active" class from ALL mode buttons
    for (let j = 0; j < modes.length; j++) {
      modes[j].classList.remove("active");
    }

    // Add "active" class to the clicked button
    modeButton.classList.add("active");

    // Get minutes from data-min attribute
    // Example: data-min="25" → "25"
    minutes = parseInt(modeButton.dataset.min);

    // Reset seconds
    seconds = 0;

    // Update timer display
    let minuteText = String(minutes);

    if (minuteText.length === 1) {
      minuteText = "0" + minuteText;
    }

    timerEl.textContent = minuteText + ":00";

    // Reset progress circle
    progress.style.strokeDashoffset = 816;
  };
}

/*=========================== 
  7. PAGE EVENTS
 ===========================*/

// When user clicks anywhere
document.addEventListener("click", function (event) {
  let clickedElement = event.target;
  if (clickedElement && clickedElement.id === "add-task") {
    addTask();
  }
});

// When user presses a key
document.addEventListener("keydown", function (event) {
  let focusedElement = event.target;
  if (
    focusedElement &&
    focusedElement.id === "new-task" &&
    event.key === "Enter"
  ) {
    event.preventDefault();
    addTask();
  }
});

// Auto focus input
setTimeout(() => {
  const input = document.getElementById("new-task");
  if (input) {
    input.focus();
    input.style.caretColor = "black";
  }
}, 150); //waiting a tiny bit ensures the element(page or tasks) is ready

// Start app
renderTasks();

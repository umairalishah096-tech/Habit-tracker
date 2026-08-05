/**
 * Pro Habit Tracker - Core Application Logic
 * Standard Vanilla JS Architecture (State -> DOM Sync -> Storage)
 */

// Global App State
let habits = [];
let selectedYear = new Date().getFullYear();
let selectedMonth = new Date().getMonth(); // 0-indexed (0 = Jan)

// DOM Elements Reference Cache
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
const dateRangeText = document.getElementById("dateRangeText");
const totalDaysText = document.getElementById("totalDaysText");
const headerSuccessRate = document.getElementById("headerSuccessRate");
const habitTableBody = document.getElementById("habitTableBody");
const tableHeaderRow = document.getElementById("tableHeaderRow");

// Summary & Metric Elements
const monthlyProgressBar = document.getElementById("monthlyProgressBar");
const monthlyProgressText = document.getElementById("monthlyProgressText");
const completedHabitsCount = document.getElementById("completedHabitsCount");
const circlePathMonthly = document.getElementById("circlePathMonthly");
const circleTextMonthly = document.getElementById("circleTextMonthly");
const circlePathConsistency = document.getElementById("circlePathConsistency");
const circleTextConsistency = document.getElementById("circleTextConsistency");
const circlePathMomentum = document.getElementById("circlePathMomentum");
const circleTextMomentum = document.getElementById("circleTextMomentum");

// Modal Elements
const addHabitBtn = document.getElementById("addHabitBtn");
const habitModal = document.getElementById("habitModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const habitForm = document.getElementById("habitForm");
const modalTitle = document.getElementById("modalTitle");
const habitIdInput = document.getElementById("habitIdInput");
const habitTitleInput = document.getElementById("habitTitleInput");
const habitGoalInput = document.getElementById("habitGoalInput");
const habitCategoryInput = document.getElementById("habitCategoryInput");
const habitIconInput = document.getElementById("habitIconInput");
const habitColorInput = document.getElementById("habitColorInput");

// Canvas Element for Line Chart
const canvas = document.getElementById("monthlyTrendChart");
const ctx = canvas ? canvas.getContext("2d") : null;

/* ==========================================================================
   INITIALIZATION & SETUP
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initSelectors();

  // Pehle localStorage check karo, agar data hai toh wahi load karo
  // Sirf pehli baar (ya empty hone par) seed data lagao
  const stored = localStorage.getItem("pro_habit_tracker_data");
  if (stored) {
    loadStateFromStorage();
  } else {
    loadSeedData();
  }

  setupEventListeners();
  renderApp();
});

// Setup Month/Year Selector options
function initSelectors() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  monthSelect.innerHTML = months
    .map(
      (m, idx) =>
        `<option value="${idx}" ${idx === selectedMonth ? "selected" : ""}>${m}</option>`,
    )
    .join("");

  const currentYr = new Date().getFullYear();
  let yearOptions = "";
  for (let y = currentYr - 2; y <= currentYr + 2; y++) {
    yearOptions += `<option value="${y}" ${y === selectedYear ? "selected" : ""}>${y}</option>`;
  }
  yearSelect.innerHTML = yearOptions;
}

// Seed initial sample habits if LocalStorage is empty
// Seed initial sample habits from schedule image if LocalStorage is empty
function loadSeedData() {
  habits = [
    {
      id: "habit_1",
      title: "Fajr Namaz",
      time: "5:15 AM",
      goal: 30,
      category: "Mindset",
      color: "#10b981",
      icon: "🕌",
      logs: {},
    },
    {
      id: "habit_2",
      title: "Tilawat Quran",
      time: "5:30 – 5:50 AM",
      goal: 30,
      category: "Mindset",
      color: "#10b981",
      icon: "📖",
      logs: {},
    },
    {
      id: "habit_3",
      title: "Walk / Stretching / Exercise",
      time: "5:50 – 6:30 AM",
      goal: 25,
      category: "Fitness",
      color: "#10b981",
      icon: "🏃",
      logs: {},
    },
    {
      id: "habit_4",
      title: "Shower & Fresh",
      time: "6:30 – 7:00 AM",
      goal: 30,
      category: "Health",
      color: "#3b82f6",
      icon: "🚿",
      logs: {},
    },
    {
      id: "habit_5",
      title: "Breakfast",
      time: "7:00 – 7:30 AM",
      goal: 30,
      category: "Health",
      color: "#f59e0b",
      icon: "🍳",
      logs: {},
    },
    {
      id: "habit_6",
      title: "Power BI Revision & Practice",
      time: "7:30 – 9:00 AM",
      goal: 22,
      category: "Learning",
      color: "#8b5cf6",
      icon: "📊",
      logs: {},
    },
    {
      id: "habit_7",
      title: "Tea Break",
      time: "9:00 – 9:20 AM",
      goal: 30,
      category: "Health",
      color: "#f59e0b",
      icon: "☕",
      logs: {},
    },
    {
      id: "habit_8",
      title: "Assignment / Practice",
      time: "9:20 – 10:20 AM",
      goal: 22,
      category: "Productivity",
      color: "#3b82f6",
      icon: "📝",
      logs: {},
    },
    {
      id: "habit_9",
      title: "JavaScript Practice (Hostel)",
      time: "10:20 – 10:40 AM",
      goal: 22,
      category: "Learning",
      color: "#f59e0b",
      icon: "💻",
      logs: {},
    },
    {
      id: "habit_10",
      title: "Lunch",
      time: "12:20 – 12:50 PM",
      goal: 30,
      category: "Health",
      color: "#10b981",
      icon: "🍱",
      logs: {},
    },
    {
      id: "habit_11",
      title: "Zuhr Namaz",
      time: "1:15 PM",
      goal: 30,
      category: "Mindset",
      color: "#10b981",
      icon: "🕌",
      logs: {},
    },
    {
      id: "habit_12",
      title: "Full Stack Web Development",
      time: "1:30 – 4:00 PM",
      goal: 22,
      category: "Learning",
      color: "#3b82f6",
      icon: "⚙️",
      logs: {},
    },
    {
      id: "habit_13",
      title: "Asr Namaz",
      time: "4:45 PM",
      goal: 30,
      category: "Mindset",
      color: "#10b981",
      icon: "🕌",
      logs: {},
    },
    {
      id: "habit_14",
      title: "Relax / Break",
      time: "6:00 – 6:20 PM",
      goal: 30,
      category: "Health",
      color: "#ec4899",
      icon: "🛋️",
      logs: {},
    },
    {
      id: "habit_15",
      title: "Maghrib Namaz",
      time: "6:30 PM",
      goal: 30,
      category: "Mindset",
      color: "#10b981",
      icon: "🕌",
      logs: {},
    },
    {
      id: "habit_16",
      title: "English Speaking & Vocabulary",
      time: "7:00 – 7:45 PM",
      goal: 25,
      category: "Learning",
      color: "#8b5cf6",
      icon: "🗣️",
      logs: {},
    },
    {
      id: "habit_17",
      title: "Dinner",
      time: "7:45 – 8:15 PM",
      goal: 30,
      category: "Health",
      color: "#f59e0b",
      icon: "🍽️",
      logs: {},
    },
    {
      id: "habit_18",
      title: "Isha Namaz",
      time: "8:30 PM",
      goal: 30,
      category: "Mindset",
      color: "#10b981",
      icon: "🕌",
      logs: {},
    },
    {
      id: "habit_19",
      title: "Today's Full Stack Revision",
      time: "9:00 – 10:00 PM",
      goal: 22,
      category: "Learning",
      color: "#3b82f6",
      icon: "📚",
      logs: {},
    },
    {
      id: "habit_20",
      title: "Entertainment / Family Time",
      time: "10:00 – 10:30 PM",
      goal: 30,
      category: "Health",
      color: "#ec4899",
      icon: "👨‍👩‍👧‍👦",
      logs: {},
    },
    {
      id: "habit_21",
      title: "Plan Tomorrow & Prepare for Next Day",
      time: "10:30 – 10:45 PM",
      goal: 30,
      category: "Productivity",
      color: "#8b5cf6",
      icon: "📋",
      logs: {},
    },
    {
      id: "habit_22",
      title: "Sleep",
      time: "11:00 PM",
      goal: 30,
      category: "Health",
      color: "#6366f1",
      icon: "😴",
      logs: {},
    },
  ];
  saveStateToStorage();
}

/* ==========================================================================
   LOCALSTORAGE HANDLERS
   ========================================================================== */
function saveStateToStorage() {
  localStorage.setItem("pro_habit_tracker_data", JSON.stringify(habits));
}

function loadStateFromStorage() {
  const stored = localStorage.getItem("pro_habit_tracker_data");
  if (stored) {
    try {
      habits = JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse local storage data:", e);
      habits = [];
    }
  }
}

/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */
function setupEventListeners() {
  monthSelect.addEventListener("change", (e) => {
    selectedMonth = parseInt(e.target.value, 10);
    renderApp();
  });

  yearSelect.addEventListener("change", (e) => {
    selectedYear = parseInt(e.target.value, 10);
    renderApp();
  });

  addHabitBtn.addEventListener("click", () => openModal());
  closeModalBtn.addEventListener("click", closeModal);
  cancelModalBtn.addEventListener("click", closeModal);

  habitModal.addEventListener("click", (e) => {
    if (e.target === habitModal) closeModal();
  });

  habitForm.addEventListener("submit", handleFormSubmit);
}

/* ==========================================================================
   MAIN RENDER PIPELINE
   ========================================================================== */
function renderApp() {
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  renderHeaderMetrics(daysInMonth);
  renderTableHeader(daysInMonth);
  renderTableBody(daysInMonth);
  renderDashboardCards(daysInMonth);
  renderTrendChart(daysInMonth);
}

// Helpers for date calculations
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDateKey(year, month, day) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/* ==========================================================================
   HEADER METRICS RENDER
   ========================================================================== */
function renderHeaderMetrics(daysInMonth) {
  const monthName = monthSelect.options[monthSelect.selectedIndex].text;
  dateRangeText.textContent = `${monthName} 1, ${selectedYear} - ${monthName} ${daysInMonth}, ${selectedYear}`;
  totalDaysText.textContent = `Total Days: ${daysInMonth}`;

  // Calculate global overall success rate across all habits for this month
  let totalCompletions = 0;
  let totalOpportunities = habits.length * daysInMonth;

  habits.forEach((habit) => {
    for (let day = 1; day <= daysInMonth; day++) {
      const key = formatDateKey(selectedYear, selectedMonth, day);
      if (habit.logs[key] === "completed") {
        totalCompletions++;
      }
    }
  });

  const rate =
    totalOpportunities > 0
      ? Math.round((totalCompletions / totalOpportunities) * 100)
      : 0;
  headerSuccessRate.textContent = `${rate}%`;
}

/* ==========================================================================
   DYNAMIC TABLE RENDER
   ========================================================================== */
function renderTableHeader(daysInMonth) {
  // Clear day columns while keeping static headers (Habit Name, Goal)
  let headerHTML = `
    <th class="col-habit">Habit Name</th>
    <th class="col-time">Time</th>
    <th class="col-goal">Goal</th>
  `;

  for (let day = 1; day <= daysInMonth; day++) {
    headerHTML += `<th>${day}</th>`;
  }

  headerHTML += `
    <th class="col-progress">Progress</th>
    <th class="col-actions">Actions</th>
  `;

  tableHeaderRow.innerHTML = headerHTML;
}

function renderTableBody(daysInMonth) {
  if (habits.length === 0) {
    tableHeaderRow.parentElement.parentElement.classList.add("empty");
    habitTableBody.innerHTML = `
      <tr>
        <td colspan="${daysInMonth + 4}" style="padding: 30px; text-align: center; color: var(--text-muted);">
          No habits added yet. Click "+ Add Habit" to start tracking!
        </td>
      </tr>
    `;
    return;
  }

  habitTableBody.innerHTML = "";

  habits.forEach((habit) => {
    const tr = document.createElement("tr");

    // Count completions for current month
    let completedCount = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = formatDateKey(selectedYear, selectedMonth, d);
      if (habit.logs[key] === "completed") completedCount++;
    }

    const progressPercent = Math.min(
      100,
      Math.round((completedCount / habit.goal) * 100),
    );

    // Habit Info Cell
    let rowHTML = `
      <td class="col-habit">
        <div class="habit-cell-title">
          <span style="font-size: 1.2rem;">${habit.icon || "🎯"}</span>
          <div>
            <strong style="color: ${habit.color || "var(--text-primary)"}">${escapeHTML(habit.title)}</strong>
            <span class="habit-category-badge">${escapeHTML(habit.category)}</span>
          </div>
        </div>
      </td>
      <td class="col-time">${escapeHTML(habit.time || "—")}</td>
      <td class="col-goal">${habit.goal}d</td>
    `;

    // Dynamic Day Cells
    for (let day = 1; day <= daysInMonth; day++) {
      const key = formatDateKey(selectedYear, selectedMonth, day);
      const status = habit.logs[key] || "pending";

      let symbol = "⏳";
      if (status === "completed") symbol = "✔";
      if (status === "missed") symbol = "❌";

      rowHTML += `
        <td class="day-cell ${status}" 
            data-habit-id="${habit.id}" 
            data-date-key="${key}"
            title="${key}: ${status.toUpperCase()} (Click to toggle)">
            ${symbol}
        </td>
      `;
    }

    // Progress Cell
    rowHTML += `
      <td class="col-progress">
        <div class="mini-progress-bg">
          <div class="mini-progress-fill" style="width: ${progressPercent}%; background-color: ${habit.color || "var(--accent-green)"}"></div>
        </div>
        <span style="font-size: 0.75rem; color: var(--text-muted);">${completedCount}/${habit.goal}</span>
      </td>
    `;

    // Action Buttons Cell
    rowHTML += `
      <td class="col-actions">
        <div class="action-btn-group">
          <button class="icon-btn edit-btn" onclick="openModal('${habit.id}')" title="Edit Habit">✏️</button>
          <button class="icon-btn delete-btn" onclick="deleteHabit('${habit.id}')" title="Delete Habit">🗑️</button>
        </div>
      </td>
    `;

    tr.innerHTML = rowHTML;
    habitTableBody.appendChild(tr);
  });

  // Attach click listener for day cell state toggling
  document.querySelectorAll(".day-cell").forEach((cell) => {
    cell.addEventListener("click", handleDayClick);
  });
}

// State transition order: Pending -> Complete -> Missed -> Pending
function handleDayClick(e) {
  const habitId = e.currentTarget.getAttribute("data-habit-id");
  const dateKey = e.currentTarget.getAttribute("data-date-key");

  const habit = habits.find((h) => h.id === habitId);
  if (!habit) return;

  const currentStatus = habit.logs[dateKey] || "pending";
  let nextStatus = "completed";

  if (currentStatus === "completed") {
    nextStatus = "missed";
  } else if (currentStatus === "missed") {
    nextStatus = "pending";
  } else {
    nextStatus = "completed";
  }

  if (nextStatus === "pending") {
    delete habit.logs[dateKey];
  } else {
    habit.logs[dateKey] = nextStatus;
  }

  saveStateToStorage();
  renderApp();
}

/* ==========================================================================
   MID-PAGE METRICS & CIRCULAR CARDS
   ========================================================================== */
function renderDashboardCards(daysInMonth) {
  if (habits.length === 0) {
    updateSummaryViews(0, 0, 0, 0, 0);
    return;
  }

  let totalGoals = 0;
  let totalCompletions = 0;
  let habitsMetGoal = 0;
  let totalActiveDaysRecorded = 0;

  habits.forEach((habit) => {
    totalGoals += parseInt(habit.goal, 10);
    let habitMonthCompletions = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const key = formatDateKey(selectedYear, selectedMonth, day);
      if (habit.logs[key] === "completed") {
        habitMonthCompletions++;
        totalActiveDaysRecorded++;
      }
    }

    if (habitMonthCompletions >= habit.goal) {
      habitsMetGoal++;
    }
  });

  // Monthly Progress (Completions vs Goals)
  const monthlyCompletionPct =
    totalGoals > 0
      ? Math.min(100, Math.round((totalCompletions / totalGoals) * 100))
      : 0;

  // Consistency Ratio: Actual completions vs total days evaluated across habits
  const totalPossibleDays = habits.length * daysInMonth;
  const consistencyPct =
    totalPossibleDays > 0
      ? Math.round((totalActiveDaysRecorded / totalPossibleDays) * 100)
      : 0;

  // Momentum: Goal Met Ratio
  const momentumPct = Math.round((habitsMetGoal / habits.length) * 100);

  updateSummaryViews(
    monthlyCompletionPct,
    habitsMetGoal,
    habits.length,
    consistencyPct,
    momentumPct,
  );
}

function updateSummaryViews(
  monthlyPct,
  habitsMetGoal,
  totalHabits,
  consistencyPct,
  momentumPct,
) {
  monthlyProgressBar.style.width = `${monthlyPct}%`;
  monthlyProgressText.textContent = `${monthlyPct}% Goal Target Reached`;

  completedHabitsCount.textContent = `${habitsMetGoal} / ${totalHabits}`;

  // Update SVG Circles (stroke-dasharray = "value, 100")
  circlePathMonthly.setAttribute("stroke-dasharray", `${monthlyPct}, 100`);
  circleTextMonthly.textContent = `${monthlyPct}%`;

  circlePathConsistency.setAttribute(
    "stroke-dasharray",
    `${consistencyPct}, 100`,
  );
  circleTextConsistency.textContent = `${consistencyPct}%`;

  circlePathMomentum.setAttribute("stroke-dasharray", `${momentumPct}, 100`);
  circleTextMomentum.textContent = `${momentumPct}%`;
}

/* ==========================================================================
   CANVAS LINE CHART (MONTHLY TREND)
   ========================================================================== */
function renderTrendChart(daysInMonth) {
  if (!ctx) return;

  // Setup Canvas scaling for high DPR displays
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const width = rect.width;
  const height = rect.height;

  ctx.clearRect(0, 0, width, height);

  if (habits.length === 0) return;

  // Compute total completions for each day of the month
  const dailyCounts = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const key = formatDateKey(selectedYear, selectedMonth, day);
    let count = 0;
    habits.forEach((h) => {
      if (h.logs[key] === "completed") count++;
    });
    dailyCounts.push(count);
  }

  const maxCount = Math.max(...dailyCounts, habits.length);
  const padding = 10;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  // Build points array
  const points = dailyCounts.map((val, idx) => {
    const x = padding + (idx / (daysInMonth - 1)) * graphWidth;
    const y =
      height - padding - (maxCount > 0 ? (val / maxCount) * graphHeight : 0);
    return { x, y };
  });

  // Draw smooth line
  ctx.beginPath();
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";

  points.forEach((pt, idx) => {
    if (idx === 0) {
      ctx.moveTo(pt.x, pt.y);
    } else {
      ctx.lineTo(pt.x, pt.y);
    }
  });
  ctx.stroke();

  // Draw gradient fill beneath trend line
  if (points.length > 0) {
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.lineTo(points[0].x, height - padding);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.3)");
    gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)");
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

/* ==========================================================================
   MODAL & CRUD OPERATIONS
   ========================================================================== */
function openModal(habitId = null) {
  habitForm.reset();

  if (habitId) {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    modalTitle.textContent = "Edit Habit";
    habitIdInput.value = habit.id;
    habitTitleInput.value = habit.title;
    habitGoalInput.value = habit.goal;
    habitCategoryInput.value = habit.category;
    habitIconInput.value = habit.icon || "🎯";
    habitColorInput.value = habit.color || "#10b981";
  } else {
    modalTitle.textContent = "Add New Habit";
    habitIdInput.value = "";
  }

  habitModal.classList.add("active");
  habitModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  habitModal.classList.remove("active");
  habitModal.setAttribute("aria-hidden", "true");
}

function handleFormSubmit(e) {
  e.preventDefault();

  const id = habitIdInput.value;
  const title = habitTitleInput.value.trim();
  const goal = parseInt(habitGoalInput.value, 10);
  const category = habitCategoryInput.value;
  const icon = habitIconInput.value.trim() || "🎯";
  const color = habitColorInput.value;

  if (!title || isNaN(goal)) return;

  if (id) {
    // Update Existing Habit
    const habit = habits.find((h) => h.id === id);
    if (habit) {
      habit.title = title;
      habit.goal = goal;
      habit.category = category;
      habit.icon = icon;
      habit.color = color;
    }
  } else {
    // Create New Habit
    const newHabit = {
      id: "habit_" + Date.now(),
      title,
      goal,
      category,
      icon,
      color,
      logs: {},
    };
    habits.push(newHabit);
  }

  saveStateToStorage();
  closeModal();
  renderApp();
}

function deleteHabit(habitId) {
  if (confirm("Are you sure you want to delete this habit?")) {
    habits = habits.filter((h) => h.id !== habitId);
    saveStateToStorage();
    renderApp();
  }
}

// Utility: Prevent XSS when injecting user strings into innerHTML
function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[tag] || tag,
  );
}

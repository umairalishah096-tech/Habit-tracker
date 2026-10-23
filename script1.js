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
const habitTableFoot = document.getElementById("habitTableFoot");

// New Elements
const resetAllBtn = document.getElementById("resetAllBtn");
const printBtn = document.getElementById("printBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const currentStreakText = document.getElementById("currentStreakText");
const highestStreakText = document.getElementById("highestStreakText");
const badgesContainer = document.getElementById("badgesContainer");
const githubGraphContainer = document.getElementById("githubGraphContainer");

// Print Modal Elements
const printModal = document.getElementById("printModal");
const closePrintBtn = document.getElementById("closePrintBtn");
const cancelPrintBtn = document.getElementById("cancelPrintBtn");
const executePrintBtn = document.getElementById("executePrintBtn");
const printModeSelect = document.getElementById("printModeSelect");
const printMonthSelect = document.getElementById("printMonthSelect");
const printYearSelect = document.getElementById("printYearSelect");
const printPreviewContent = document.getElementById("printPreviewContent");
const printableArea = document.getElementById("printableArea");

// Calendar Modal Elements
const calendarModal = document.getElementById("calendarModal");
const closeCalendarBtn = document.getElementById("closeCalendarBtn");
const calendarModalTitle = document.getElementById("calendarModalTitle");
const calendarMonthYear = document.getElementById("calendarMonthYear");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const calendarGrid = document.getElementById("calendarGrid");
let currentCalendarHabitId = null;
let currentCalendarDate = new Date();

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
const habitTimeInput = document.getElementById("habitTimeInput");
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
  initTheme();
  setupEventListeners();
  loadDataFromBackend();
});

async function loadDataFromBackend() {
  try {
    const res = await fetch('/api/data');
    if(res.ok) {
      const data = await res.json();
      if(data.length > 0) {
        habits = data;
      } else {
        loadSeedData();
        saveStateToStorage();
      }
    } else {
      loadSeedData();
    }
  } catch(e) {
    console.error("Error loading data", e);
    loadSeedData();
  }
  renderApp();
}

function initTheme() {
  const savedTheme = localStorage.getItem("habit_pulse_theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }
}


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
   LOCALSTORAGE HANDLERS / API SAVE
   ========================================================================== */
async function saveStateToStorage() {
  try {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habits)
    });
  } catch(e) {
    console.error("Failed to save to backend", e);
  }
}

function loadStateFromStorage() {
  // Not used anymore, replaced by loadDataFromBackend
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

  resetAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all habits and progress? This cannot be undone.")) {
      habits = [];
      saveStateToStorage();
      renderApp();
    }
  });

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    localStorage.setItem("habit_pulse_theme", isLight ? "light" : "dark");
  });

  closeCalendarBtn.addEventListener("click", closeCalendarModal);
  calendarModal.addEventListener("click", (e) => {
    if (e.target === calendarModal) closeCalendarModal();
  });

  prevMonthBtn.addEventListener("click", () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendarGrid();
  });

  nextMonthBtn.addEventListener("click", () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendarGrid();
  });

  // Print Sheet Event Listeners
  printBtn.addEventListener("click", openPrintModal);
  closePrintBtn.addEventListener("click", closePrintModal);
  cancelPrintBtn.addEventListener("click", closePrintModal);
  printModal.addEventListener("click", (e) => {
    if (e.target === printModal) closePrintModal();
  });
  printModeSelect.addEventListener("change", renderPrintPreview);
  printMonthSelect.addEventListener("change", renderPrintPreview);
  printYearSelect.addEventListener("change", renderPrintPreview);
  executePrintBtn.addEventListener("click", executePrint);

  // Auto-sync printable area on native print (Ctrl+P)
  window.addEventListener("beforeprint", () => {
    preparePrintableArea();
  });
}

/* ==========================================================================
   MAIN RENDER PIPELINE
   ========================================================================== */
function renderApp() {
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  renderHeaderMetrics(daysInMonth);
  renderTableHeader(daysInMonth);
  renderTableBody(daysInMonth);
  renderTableFooter(daysInMonth);
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
          <button class="icon-btn calendar-btn" onclick="openCalendarModal('${habit.id}')" title="Calendar View">📅</button>
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
   DONE & NOT DONE MATRIX SUMMARY ROWS
   ========================================================================== */
function renderTableFooter(daysInMonth) {
  if (!habitTableFoot) return;
  if (habits.length === 0) {
    habitTableFoot.innerHTML = "";
    return;
  }

  let doneCellsHTML = "";
  let notDoneCellsHTML = "";
  let monthTotalDone = 0;
  let monthTotalOpportunities = habits.length * daysInMonth;

  for (let day = 1; day <= daysInMonth; day++) {
    const key = formatDateKey(selectedYear, selectedMonth, day);
    let doneCount = 0;
    let hasActivity = false;

    habits.forEach((habit) => {
      const status = habit.logs ? habit.logs[key] : null;
      if (status === "completed") {
        doneCount++;
        hasActivity = true;
      } else if (status === "missed") {
        hasActivity = true;
      }
    });

    monthTotalDone += doneCount;
    const notDoneCount = habits.length - doneCount;

    if (hasActivity) {
      doneCellsHTML += `<td class="summary-cell done-val" title="Day ${day}: ${doneCount} Completed">${doneCount}</td>`;
      notDoneCellsHTML += `<td class="summary-cell not-done-val" title="Day ${day}: ${notDoneCount} Not Done">${notDoneCount}</td>`;
    } else {
      doneCellsHTML += `<td class="summary-cell done-val empty"></td>`;
      notDoneCellsHTML += `<td class="summary-cell not-done-val empty"></td>`;
    }
  }

  const monthTotalNotDone = monthTotalOpportunities - monthTotalDone;

  habitTableFoot.innerHTML = `
    <tr class="summary-row done-row">
      <td colspan="3" class="summary-title done-title">Done</td>
      ${doneCellsHTML}
      <td class="col-progress summary-total done-val" title="Total Completed This Month">${monthTotalDone}</td>
      <td class="col-actions"></td>
    </tr>
    <tr class="summary-row not-done-row">
      <td colspan="3" class="summary-title not-done-title">Not Done</td>
      ${notDoneCellsHTML}
      <td class="col-progress summary-total not-done-val" title="Total Not Done This Month">${monthTotalNotDone}</td>
      <td class="col-actions"></td>
    </tr>
  `;
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
    habitTimeInput.value = habit.time || "";
    habitGoalInput.value = habit.goal;
    habitCategoryInput.value = habit.category;
    habitIconInput.value = habit.icon || "🎯";
    habitColorInput.value = habit.color || "#10b981";
  } else {
    modalTitle.textContent = "Add New Habit";
    habitIdInput.value = "";
    habitTimeInput.value = "";
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
  const time = habitTimeInput.value.trim();
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
      habit.time = time;
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
      time,
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

/* ==========================================================================
   NEW FEATURES LOGIC
   ========================================================================== */

function calculateStreaksAndGraph() {
  if (habits.length === 0) return;

  // Aggregate all completed habits by date
  const completionsByDate = {};
  habits.forEach(habit => {
    Object.keys(habit.logs).forEach(date => {
      if (habit.logs[date] === 'completed') {
        completionsByDate[date] = (completionsByDate[date] || 0) + 1;
      }
    });
  });

  const sortedDates = Object.keys(completionsByDate).sort();
  
  // Calculate Streaks
  let currentStreak = 0;
  let highestStreak = 0;
  let tempStreak = 0;
  let today = new Date();
  
  if (sortedDates.length > 0) {
      let prevDate = new Date(sortedDates[0]);
      tempStreak = 1;
      highestStreak = 1;

      for (let i = 1; i < sortedDates.length; i++) {
        const currDate = new Date(sortedDates[i]);
        const diffTime = Math.abs(currDate - prevDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
            tempStreak++;
            if (tempStreak > highestStreak) highestStreak = tempStreak;
        } else if (diffDays > 1) {
            tempStreak = 1;
        }
        prevDate = currDate;
      }
      
      const lastDate = new Date(sortedDates[sortedDates.length - 1]);
      const diffFromToday = Math.ceil(Math.abs(today - lastDate) / (1000 * 60 * 60 * 24));
      
      if (diffFromToday <= 1) {
          currentStreak = tempStreak;
      } else {
          currentStreak = 0;
      }
  }

  currentStreakText.textContent = currentStreak;
  highestStreakText.textContent = highestStreak;

  // Badges logic
  badgesContainer.innerHTML = '';
  if (highestStreak >= 7) {
      badgesContainer.innerHTML += '<div class="badge"><span class="badge-icon">🔥</span><span class="badge-label">7-Day Streak</span></div>';
  }
  if (highestStreak >= 30) {
      badgesContainer.innerHTML += '<div class="badge"><span class="badge-icon">🏆</span><span class="badge-label">30-Day Streak</span></div>';
  }
  if (highestStreak < 7) {
      badgesContainer.innerHTML += '<div style="font-size: 1rem; color: var(--text-muted);">Reach a 7-day streak to earn a badge!</div>';
  }

  // Github Graph Logic
  githubGraphContainer.innerHTML = '';
  const graphEndDate = new Date();
  const graphStartDate = new Date();
  graphStartDate.setDate(graphStartDate.getDate() - 364);

  let currentGraphDate = new Date(graphStartDate);
  while (currentGraphDate <= graphEndDate) {
      const dateKey = formatDateKey(currentGraphDate.getFullYear(), currentGraphDate.getMonth(), currentGraphDate.getDate());
      const completions = completionsByDate[dateKey] || 0;
      
      let level = 0;
      if (completions > 0 && completions <= 2) level = 1;
      else if (completions > 2 && completions <= 4) level = 2;
      else if (completions > 4 && completions <= 6) level = 3;
      else if (completions > 6) level = 4;

      const dayDiv = document.createElement('div');
      dayDiv.className = 'github-day';
      dayDiv.setAttribute('data-level', level);
      dayDiv.title = dateKey + ': ' + completions + ' completions';
      
      githubGraphContainer.appendChild(dayDiv);
      currentGraphDate.setDate(currentGraphDate.getDate() + 1);
  }
  
  // Scroll to right end (latest dates)
  githubGraphContainer.scrollLeft = githubGraphContainer.scrollWidth;
}

// Hook into renderApp to run streaks
const originalRenderApp = renderApp;
renderApp = function() {
    originalRenderApp();
    calculateStreaksAndGraph();
};

/* ==========================================================================
   CALENDAR VIEW LOGIC
   ========================================================================== */
function openCalendarModal(habitId) {
    currentCalendarHabitId = habitId;
    currentCalendarDate = new Date(selectedYear, selectedMonth, 1);
    const habit = habits.find((h) => h.id === habitId);
    if(habit) {
        calendarModalTitle.innerHTML = habit.icon + ' ' + escapeHTML(habit.title) + ' Calendar';
    }
    renderCalendarGrid();
    calendarModal.classList.add('active');
    calendarModal.setAttribute('aria-hidden', 'false');
}

function closeCalendarModal() {
    calendarModal.classList.remove('active');
    calendarModal.setAttribute('aria-hidden', 'true');
    currentCalendarHabitId = null;
}

function renderCalendarGrid() {
    if (!currentCalendarHabitId) return;
    const habit = habits.find((h) => h.id === currentCalendarHabitId);
    if (!habit) return;

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    calendarMonthYear.textContent = months[month] + ' ' + year;

    calendarGrid.innerHTML = '';
    
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = getDaysInMonth(year, month);

    // Empty slots before first day
    for (let i = 0; i < firstDay; i++) {
        const emptySlot = document.createElement('div');
        emptySlot.className = 'calendar-day empty';
        calendarGrid.appendChild(emptySlot);
    }

    // Days slots
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = formatDateKey(year, month, day);
        const status = habit.logs[dateKey] || 'pending';
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day ' + status;
        dayDiv.textContent = day;
        dayDiv.title = dateKey + ': ' + status.toUpperCase();
        
        dayDiv.addEventListener('click', () => {
            let nextStatus = 'completed';
            if (status === 'completed') nextStatus = 'missed';
            else if (status === 'missed') nextStatus = 'pending';

            if (nextStatus === 'pending') {
                delete habit.logs[dateKey];
            } else {
                habit.logs[dateKey] = nextStatus;
            }
            saveStateToStorage();
            renderCalendarGrid(); // re-render grid
            renderApp(); // re-render main app
        });

        calendarGrid.appendChild(dayDiv);
    }
}


/* ==========================================================================
   PRINT TRACKER SHEET LOGIC (A4 LANDSCAPE MANUAL / DIGITAL SHEET)
   ========================================================================== */
const PRINT_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function initPrintSelectors() {
  printMonthSelect.innerHTML = PRINT_MONTH_NAMES
    .map((m, idx) => `<option value="${idx}" ${idx === selectedMonth ? "selected" : ""}>${m}</option>`)
    .join("");

  const currentYr = new Date().getFullYear();
  let yearOptions = "";
  for (let y = currentYr - 2; y <= currentYr + 2; y++) {
    yearOptions += `<option value="${y}" ${y === selectedYear ? "selected" : ""}>${y}</option>`;
  }
  printYearSelect.innerHTML = yearOptions;
}

function openPrintModal() {
  initPrintSelectors();
  renderPrintPreview();
  printModal.classList.add("active");
  printModal.setAttribute("aria-hidden", "false");
}

function closePrintModal() {
  printModal.classList.remove("active");
  printModal.setAttribute("aria-hidden", "true");
}

function generatePrintableSheetHTML(mode, yr, mo) {
  const year = parseInt(yr, 10);
  const month = parseInt(mo, 10);
  const monthName = PRINT_MONTH_NAMES[month] || "Month";
  const daysInMonth = getDaysInMonth(year, month);

  // Day header columns
  let daysHeaderHTML = "";
  for (let d = 1; d <= daysInMonth; d++) {
    daysHeaderHTML += `<th class="p-day-th">${d}</th>`;
  }

  // Summary rows Done & Not Done calculation
  let printDoneCells = "";
  let printNotDoneCells = "";
  let printTotalDone = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const key = formatDateKey(year, month, day);
    let doneCount = 0;
    let hasActivity = false;

    habits.forEach((habit) => {
      const status = habit.logs ? habit.logs[key] : null;
      if (status === "completed") {
        doneCount++;
        hasActivity = true;
      } else if (status === "missed") {
        hasActivity = true;
      }
    });

    printTotalDone += doneCount;
    const notDoneCount = habits.length - doneCount;

    if (mode === "progress") {
      if (hasActivity) {
        printDoneCells += `<td class="p-day-cell" style="font-weight:700; color:#047857;">${doneCount}</td>`;
        printNotDoneCells += `<td class="p-day-cell" style="font-weight:700; color:#be123c;">${notDoneCount}</td>`;
      } else {
        printDoneCells += `<td class="p-day-cell"></td>`;
        printNotDoneCells += `<td class="p-day-cell"></td>`;
      }
    } else {
      // Blank mode: clean empty square boxes for pen/pencil ticking/crossing
      printDoneCells += `<td class="p-day-cell"><span class="p-box" style="border-color:#047857;"></span></td>`;
      printNotDoneCells += `<td class="p-day-cell"><span class="p-box" style="border-color:#be123c;"></span></td>`;
    }
  }

  const printScoreDone = mode === "progress" ? `<strong>${printTotalDone}</strong>` : `___`;
  const printScoreNotDone = mode === "progress" ? `<strong>${(habits.length * daysInMonth) - printTotalDone}</strong>` : `___`;

  // Habits rows
  let rowsHTML = "";
  if (habits.length === 0) {
    rowsHTML = `<tr><td colspan="${daysInMonth + 6}" style="padding: 20px; text-align: center; color: #6b7280;">No habits available to print. Add habits first!</td></tr>`;
  } else {
    habits.forEach((habit, idx) => {
      let completedCount = 0;
      let dayCellsHTML = "";

      for (let day = 1; day <= daysInMonth; day++) {
        const key = formatDateKey(year, month, day);
        const status = habit.logs ? habit.logs[key] : null;

        if (status === "completed") completedCount++;

        if (mode === "progress" && status) {
          if (status === "completed") {
            dayCellsHTML += `<td class="p-day-cell"><span class="p-mark completed">✔</span></td>`;
          } else if (status === "missed") {
            dayCellsHTML += `<td class="p-day-cell"><span class="p-mark missed">✕</span></td>`;
          } else {
            dayCellsHTML += `<td class="p-day-cell"><span class="p-box"></span></td>`;
          }
        } else {
          // Blank mode: clean empty square boxes for pen/pencil ticking/crossing
          dayCellsHTML += `<td class="p-day-cell"><span class="p-box"></span></td>`;
        }
      }

      const scoreText = mode === "progress" 
        ? `<strong>${completedCount}</strong>/${habit.goal}` 
        : `___/${habit.goal}`;

      rowsHTML += `
        <tr>
          <td class="p-col-num">${idx + 1}</td>
          <td class="p-col-time">${escapeHTML(habit.time || "—")}</td>
          <td class="p-col-habit">${habit.icon || "🎯"} ${escapeHTML(habit.title)}</td>
          <td class="p-col-cat">${escapeHTML(habit.category || "General")}</td>
          <td class="p-col-goal">${habit.goal}d</td>
          ${dayCellsHTML}
          <td class="p-col-score">${scoreText}</td>
        </tr>
      `;
    });
  }

  return `
    <div class="printable-sheet">
      <div class="print-sheet-header">
        <div class="print-header-left">
          <div class="print-title-group">
            <h1 class="print-main-title">⚡ HABIT PULSE — DAILY ROUTINE & HABIT TRACKER</h1>
            <div class="print-subtitle">Daily Routine Matrix for Manual Pen / Pencil Tracking</div>
          </div>
        </div>
        <div class="print-header-right">
          <div class="print-month-badge">${monthName.toUpperCase()} ${year}</div>
        </div>
      </div>

      <div class="print-meta-grid">
        <div class="print-meta-item"><strong>Name / Routine:</strong> ____________________________</div>
        <div class="print-meta-item"><strong>Target Consistency:</strong> ________ %</div>
        <div class="print-meta-item"><strong>Total Routines:</strong> ${habits.length} Habits</div>
        <div class="print-meta-item"><strong>Pen Legend:</strong> [ ✔ ] Done &nbsp;&nbsp; [ ✕ ] Missed &nbsp;&nbsp; [ — ] Rest</div>
      </div>

      <table class="print-habit-table">
        <thead>
          <tr>
            <th class="p-col-num">#</th>
            <th class="p-col-time">Time</th>
            <th class="p-col-habit">Habit / Activity</th>
            <th class="p-col-cat">Category</th>
            <th class="p-col-goal">Goal</th>
            ${daysHeaderHTML}
            <th class="p-col-score">Score</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
        <tfoot>
          <tr class="p-summary-row p-done-row">
            <td colspan="5" class="p-summary-title">Done</td>
            ${printDoneCells}
            <td class="p-col-score">${printScoreDone}</td>
          </tr>
          <tr class="p-summary-row p-not-done-row">
            <td colspan="5" class="p-summary-title">Not Done</td>
            ${printNotDoneCells}
            <td class="p-col-score">${printScoreNotDone}</td>
          </tr>
        </tfoot>
      </table>

      <div class="print-footer-grid">
        <div class="print-notes-box">
          <strong>Monthly Reflections, Key Wins & Adjustments:</strong>
          <div class="print-notes-lines">
            <div class="print-line"></div>
            <div class="print-line"></div>
          </div>
        </div>
        <div class="print-summary-box" style="display: flex; flex-direction: column; justify-content: space-between; font-size: 7.8pt;">
          <div><strong>Monthly Target Met:</strong> &nbsp; [ &nbsp; ] Yes &nbsp;&nbsp; [ &nbsp; ] Partial &nbsp;&nbsp; [ &nbsp; ] No</div>
          <div><strong>Signed / Reviewed:</strong> ________________________</div>
        </div>
      </div>
    </div>
  `;
}

function renderPrintPreview() {
  const mode = printModeSelect.value;
  const mo = printMonthSelect.value;
  const yr = printYearSelect.value;
  printPreviewContent.innerHTML = generatePrintableSheetHTML(mode, yr, mo);
}

function preparePrintableArea() {
  const mode = printModeSelect ? printModeSelect.value : "blank";
  const mo = printMonthSelect ? printMonthSelect.value : selectedMonth;
  const yr = printYearSelect ? printYearSelect.value : selectedYear;
  printableArea.innerHTML = generatePrintableSheetHTML(mode, yr, mo);
}

function executePrint() {
  preparePrintableArea();
  window.print();
}

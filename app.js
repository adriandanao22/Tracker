/**
 * Fitness Tracker Application
 * Manages workout and meal tracking with localStorage persistence
 */

// Calendar state
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

/**
 * Get entries for a specific date
 */
function getEntriesForDate(dateString) {
  const entries = JSON.parse(localStorage.getItem("fitnessEntries") || "[]");
  return entries.filter((e) => e.date === dateString);
}

/**
 * Render calendar for current month/year
 */
function renderCalendar() {
  const entries = JSON.parse(localStorage.getItem("fitnessEntries") || "[]");
  const calendarGrid = document.getElementById("calendarGrid");
  const monthYear = document.getElementById("monthYear");

  // Month/year display
  const monthNames = [
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
  monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  // Clear grid
  calendarGrid.innerHTML = "";

  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day empty";
    calendarGrid.appendChild(emptyCell);
  }

  // Track today's entries for auto-opening
  const today = new Date();
  const todayString = today.toLocaleDateString();
  let todayEntries = null;

  // Add day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateString = date.toLocaleDateString();
    const dayEntries = entries.filter((e) => e.date === dateString);

    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";

    // Highlight today
    if (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    ) {
      dayCell.classList.add("today");
      // Store today's entries if they exist
      if (dayEntries.length > 0) {
        todayEntries = { dateString, dayEntries };
      }
    }

    // Add entry indicator
    if (dayEntries.length > 0) {
      dayCell.classList.add("has-entry");
    }

    dayCell.innerHTML = `
      <div class="day-number">${day}</div>
      ${
        dayEntries.length > 0
          ? `<div class="entry-indicator">${dayEntries.length}</div>`
          : ""
      }
    `;

    // Click to view details
    if (dayEntries.length > 0) {
      dayCell.style.cursor = "pointer";
      dayCell.onclick = () => showDayDetails(dateString, dayEntries);
    }

    calendarGrid.appendChild(dayCell);
  }

  // Auto-open today's entries if they exist and we're viewing current month
  if (
    todayEntries &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear()
  ) {
    showDayDetails(todayEntries.dateString, todayEntries.dayEntries);
  }
}

/**
 * Show details for a specific day
 */
function showDayDetails(dateString, dayEntries) {
  const detailsDiv = document.getElementById("dayDetails");
  detailsDiv.innerHTML = `
    <div class="details-header">
      <strong>${dateString}</strong>
      <button onclick="closeDayDetails()" class="close-btn">×</button>
    </div>
    ${dayEntries
      .map(
        (e) => `
      <div class="detail-entry">
        🏋️‍♂️ ${e.workout || "No workout"}<br/>
        🍎 ${e.meals || "No meals"}
      </div>
    `
      )
      .join("")}
  `;
  detailsDiv.style.display = "block";
}

/**
 * Close day details
 */
function closeDayDetails() {
  document.getElementById("dayDetails").style.display = "none";
}

/**
 * Navigate to previous month
 */
function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
}

/**
 * Navigate to next month
 */
function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
}

/**
 * Go to today
 */
function goToToday() {
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  renderCalendar();
}

/**
 * Load and display all saved entries (legacy list view - kept for reference)
 */
function loadEntries() {
  renderCalendar();
}

/**
 * Save a new entry with selected workout and meals
 * Clears the form after saving
 */
function saveEntry() {
  const workoutEl = document.querySelector('input[name="workout"]:checked');
  const workout = workoutEl ? workoutEl.value.trim() : "";
  const meals = document.getElementById("meals").value.trim();
  const entries = JSON.parse(localStorage.getItem("fitnessEntries") || "[]");

  entries.unshift({
    date: new Date().toLocaleDateString(),
    workout,
    meals,
  });

  localStorage.setItem("fitnessEntries", JSON.stringify(entries));

  // Clear the form
  if (workoutEl) workoutEl.checked = false;
  document.getElementById("meals").value = "";

  // Refresh the history display
  loadEntries();
}

/**
 * Highlights the current day in the schedule table
 */
function highlightCurrentDay() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = days[new Date().getDay()];
  console.log("Today is:", today);

  const scheduleRows = document.querySelectorAll("#scheduleBody tr");
  scheduleRows.forEach((row) => {
    const dayCell = row.querySelector("td:first-child");
    if (dayCell && dayCell.textContent.trim() === today) {
      row.classList.add("current-day");
    }
  });
}

// Load entries when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadEntries();
  highlightCurrentDay();
});

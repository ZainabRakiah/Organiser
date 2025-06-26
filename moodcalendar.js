const calendarEl = document.getElementById("calendar");
const historyEl = document.getElementById("history-view");
const monthLabel = document.getElementById("monthLabel");

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function generateCalendar(month, year, targetEl = calendarEl, moodData = null) {
  const firstDay = new Date(year, month).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  targetEl.innerHTML = "";
  monthLabel.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;

  const data = moodData || JSON.parse(localStorage.getItem("moodData") || '{}');

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    targetEl.appendChild(blank);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateBox = document.createElement("div");
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    dateBox.setAttribute("data-date", dateStr);
    dateBox.textContent = day;

    if (data[dateStr]) {
      dateBox.classList.add(`mood-${data[dateStr].mood}`);
      if (data[dateStr].note) {
        dateBox.setAttribute("data-note", data[dateStr].note);
      }
    }

    targetEl.appendChild(dateBox);
  }
}

function markMood() {
  const dateInput = document.getElementById("date").value;
  const mood = parseInt(document.getElementById("mood").value);
  const note = document.getElementById("note").value.trim();

  if (!dateInput || isNaN(mood) || mood < 1 || mood > 10) {
    alert("Please enter a valid date and mood between 1 and 10");
    return;
  }

  const moodData = JSON.parse(localStorage.getItem("moodData") || '{}');
  moodData[dateInput] = { mood, note };
  localStorage.setItem("moodData", JSON.stringify(moodData));

  generateCalendar(currentMonth, currentYear);
  alert("✅ Mood successfully marked!");
}

function showHistory() {
  document.getElementById("calendar").classList.add("hidden");
  document.querySelector(".input-section").classList.add("hidden");
  document.querySelector(".legend").classList.add("hidden");
  document.querySelector(".calendar-nav").classList.add("hidden");
  document.getElementById("nav-bar").innerHTML = `
    <a href="#" onclick="backToCalendar()">🔙 Back to Calendar</a> |
    <a href="#" onclick="deleteAllHistory()">🗑️ Delete All History</a>
  `;
  historyEl.classList.remove("hidden");

  const moodData = JSON.parse(localStorage.getItem("moodData") || '{}');
  const dates = Object.keys(moodData).sort();
  const monthMap = {};

  dates.forEach(date => {
    const [y, m] = date.split("-");
    const key = `${y}-${m}`;
    if (!monthMap[key]) monthMap[key] = [];
    monthMap[key].push({ date, ...moodData[date] });
  });

  historyEl.innerHTML = "<h2>📜 Mood History</h2>";
  for (const month in monthMap) {
    const [year, monthIndex] = month.split("-").map(Number);
    const container = document.createElement("div");
    const title = document.createElement("h3");
    title.innerHTML = `${year}-${String(monthIndex).padStart(2, '0')} 
      <button onclick="deleteMonth('${year}-${String(monthIndex).padStart(2, '0')}')" style="margin-left: 10px; padding: 4px 10px; font-size: 12px;">🗑️ Delete This Month</button>`;
    container.appendChild(title);

    const tempEl = document.createElement("div");
    tempEl.className = "calendar";
    const tempData = {};
    monthMap[month].forEach(entry => {
      tempData[entry.date] = { mood: entry.mood, note: entry.note };
    });

    generateCalendar(monthIndex - 1, year, tempEl, tempData);
    container.appendChild(tempEl);
    historyEl.appendChild(container);
  }
}

function nextMonth() {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  generateCalendar(currentMonth, currentYear);
}

generateCalendar(currentMonth, currentYear);

function deleteAllHistory() {
  const confirmDelete = confirm("⚠️ Are you sure you want to delete ALL mood history?");
  if (!confirmDelete) return;

  localStorage.removeItem("moodData");
  alert("✅ All mood history deleted.");
  backToCalendar();
}
function deleteMonth(monthKey) {
  const confirmDelete = confirm(`⚠️ Delete all mood data for ${monthKey}?`);
  if (!confirmDelete) return;

  const moodData = JSON.parse(localStorage.getItem("moodData") || '{}');
  for (const date in moodData) {
    if (date.startsWith(monthKey)) {
      delete moodData[date];
    }
  }

  localStorage.setItem("moodData", JSON.stringify(moodData));
  alert(`✅ Mood history for ${monthKey} deleted.`);
  showHistory(); // Refresh view
}


let currentMonthOffset = 0;
let periods = JSON.parse(localStorage.getItem("periods")) || [];

function saveCycle() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const cycleLength = parseInt(document.getElementById("cycleLength").value);

  if (!startDate || !endDate || isNaN(cycleLength)) {
    alert("Please fill all fields");
    return;
  }

  const period = {
    start: startDate,
    end: endDate,
    cycleLength: cycleLength
  };

  periods.push(period);
  localStorage.setItem("periods", JSON.stringify(periods));
  showNextCycle(period);
  renderCalendar();
  renderHistory();
}

function showNextCycle(period) {
  const lastStart = new Date(period.start);
  lastStart.setDate(lastStart.getDate() + period.cycleLength);
  const nextStart = lastStart.toDateString();
  document.getElementById("nextCycleInfo").innerText = `Next period expected around: ${nextStart}`;
}

function renderCalendar() {
  const container = document.getElementById("calendarContainer");
  container.innerHTML = "";

  const now = new Date();
  now.setMonth(now.getMonth() + currentMonthOffset);
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthLabel = document.getElementById("monthLabel");
  monthLabel.innerText = now.toLocaleString("default", { month: "long", year: "numeric" });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const calendar = document.createElement("div");
  calendar.className = "calendar";

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekDays.forEach(day => {
    const div = document.createElement("div");
    div.className = "header";
    div.innerText = day;
    calendar.appendChild(div);
  });

  for (let i = 0; i < firstDayIndex; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let date = 1; date <= daysInMonth; date++) {
    const cell = document.createElement("div");
    const fullDate = new Date(year, month, date);

    const isPeriodDay = periods.some(p => {
      const start = new Date(p.start);
      const end = new Date(p.end);
      return fullDate >= start && fullDate <= end;
    });

    cell.innerText = date;
    if (isPeriodDay) {
      cell.classList.add("period-day");
    }

    calendar.appendChild(cell);
  }

  container.appendChild(calendar);
}

function changeMonth(offset) {
  currentMonthOffset += offset;
  renderCalendar();
}

function renderHistory() {
  const container = document.getElementById("historyContainer");
  container.innerHTML = "";

  if (periods.length === 0) {
    container.innerText = "No history available.";
    return;
  }

  periods.forEach((p, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      🩸 <strong>From:</strong> ${p.start} <strong>To:</strong> ${p.end} | <strong>Cycle:</strong> ${p.cycleLength} days
      <br>
      <button onclick="editCycle(${index})">✏️ Edit</button>
      <button onclick="deleteCycle(${index})">🗑️ Delete</button>
    `;
    container.appendChild(div);
  });
}

function editCycle(index) {
  const p = periods[index];
  const newStart = prompt("Enter new start date (yyyy-mm-dd):", p.start);
  const newEnd = prompt("Enter new end date (yyyy-mm-dd):", p.end);
  const newLength = parseInt(prompt("Enter new cycle length:", p.cycleLength));

  if (!newStart || !newEnd || isNaN(newLength)) {
    alert("Invalid input.");
    return;
  }

  periods[index] = { start: newStart, end: newEnd, cycleLength: newLength };
  localStorage.setItem("periods", JSON.stringify(periods));
  renderCalendar();
  renderHistory();
  showNextCycle(periods[periods.length - 1]);
}

function deleteCycle(index) {
  if (confirm("Are you sure you want to delete this cycle?")) {
    periods.splice(index, 1);
    localStorage.setItem("periods", JSON.stringify(periods));
    renderCalendar();
    renderHistory();
    if (periods.length > 0) showNextCycle(periods[periods.length - 1]);
    else document.getElementById("nextCycleInfo").innerText = "";
  }
}

// Run on load
renderCalendar();
renderHistory();

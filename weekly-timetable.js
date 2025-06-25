// weekly-timetable.js

const timetable = document.getElementById("timetable");
const editBtn = document.getElementById("editTable");
const deleteBtn = document.getElementById("deleteTable");

const days = ["Time Slot", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = [
  "Morning Session",
  "Midday Session",
  "Afternoon Session",
  "Evening Session",
  "Night Session"
];

let timetableData = JSON.parse(localStorage.getItem("weeklyTimetable")) || generateEmptyTable();

function generateEmptyTable() {
  return timeSlots.map(slot => {
    let row = { slot };
    days.slice(1).forEach(day => row[day] = "");
    return row;
  });
}

function renderTable() {
  timetable.innerHTML = "";

  // Header
  const header = document.createElement("tr");
  days.forEach(day => {
    const th = document.createElement("th");
    th.textContent = day;
    header.appendChild(th);
  });
  timetable.appendChild(header);

  // Rows
  timetableData.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");

    const timeCell = document.createElement("td");
    timeCell.textContent = row.slot;
    timeCell.setAttribute("contenteditable", true);
    timeCell.style.backgroundColor = "#e7f5ff";
    timeCell.addEventListener("blur", () => {
      const rowIndex = parseInt(tr.rowIndex) - 1; // adjust for header row
      timetableData[rowIndex].slot = timeCell.textContent.trim();
      localStorage.setItem("weeklyTimetable", JSON.stringify(timetableData));
    });
    tr.appendChild(timeCell);


    // Editable cells
    days.slice(1).forEach(day => {
      const td = document.createElement("td");
      td.textContent = row[day];
      td.setAttribute("data-row", rowIndex);
      td.setAttribute("data-day", day);
      tr.appendChild(td);
    });

    timetable.appendChild(tr);
  });
}

function enableEditing() {
  const cells = timetable.querySelectorAll("td[data-day]");
  cells.forEach(cell => {
    cell.setAttribute("contenteditable", true);
    cell.style.backgroundColor = "#e7f5ff";

    cell.addEventListener("blur", () => {
      const row = parseInt(cell.getAttribute("data-row"));
      const day = cell.getAttribute("data-day");
      timetableData[row][day] = cell.textContent.trim();
      localStorage.setItem("weeklyTimetable", JSON.stringify(timetableData));
    });
  });
}

function clearTable() {
  if (confirm("Are you sure you want to delete the entire timetable?")) {
    timetableData = generateEmptyTable();
    localStorage.removeItem("weeklyTimetable");
    renderTable();
  }
}

editBtn.addEventListener("click", enableEditing);
deleteBtn.addEventListener("click", clearTable);

renderTable();

const addRowBtn = document.getElementById("addRow");

addRowBtn.addEventListener("click", () => {
  const newRow = { slot: "New Slot" };
  days.slice(1).forEach(day => newRow[day] = "");
  timetableData.push(newRow);
  localStorage.setItem("weeklyTimetable", JSON.stringify(timetableData));
  renderTable();
  enableEditing(); // keep editable state if already in editing mode
});

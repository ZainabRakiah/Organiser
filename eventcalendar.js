// script.js
let events = JSON.parse(localStorage.getItem("events")) || [];
let timetable = JSON.parse(localStorage.getItem("timetable")) || [];

function submitEvent() {
  const title = document.getElementById("eventTitle").value;
  const date = document.getElementById("eventDate").value;
  const startTime = document.getElementById("eventStartTime").value;
  const duration = parseInt(document.getElementById("eventDuration").value);
  const repeat = document.getElementById("eventRepeat").value;
  const remindBefore = parseInt(document.getElementById("eventReminder").value);
  const remindDays = parseInt(document.getElementById("eventReminderDays").value);

  if (!title || !date || !startTime || isNaN(duration)) {
    return alert("Please fill all event fields");
  }

  const start = new Date(`${date}T${startTime}`);
  const end = new Date(start.getTime() + duration * 60000);

  const newEvent = {
    id: Date.now(),
    title,
    date,
    start: start.toISOString(),
    end: end.toISOString(),
    repeat,
    remindBefore,
    remindDays
  };

  events.push(newEvent);
  localStorage.setItem("events", JSON.stringify(events));
  alert("Event added!");
  clearEventForm();
}

function submitTimetable() {
  const title = document.getElementById("ttTitle").value;
  const startTime = document.getElementById("ttStartTime").value;
  const endTime = document.getElementById("ttEndTime").value;
  const remindBefore = parseInt(document.getElementById("ttReminder").value);
  const days = Array.from(document.querySelectorAll("input[name='ttDays']:checked")).map(e => e.value);

  if (!title || !startTime || !endTime || isNaN(remindBefore) || days.length === 0) {
    return alert("Please fill all timetable fields");
  }

  const newEntry = {
    id: Date.now(),
    title,
    startTime,
    endTime,
    remindBefore,
    days
  };

  // Save to flat timetable (for compatibility)
  let timetable = JSON.parse(localStorage.getItem("timetable")) || [];
  timetable.push(newEntry);
  localStorage.setItem("timetable", JSON.stringify(timetable));

  // Update structured weeklyTimetable
  const slotLabel = `${startTime} - ${endTime}`;
  let weeklyData = JSON.parse(localStorage.getItem("weeklyTimetable")) || [];

  // Check if slot already exists, else create new
  let existingSlot = weeklyData.find(row => row.slot === slotLabel);
  if (!existingSlot) {
    existingSlot = { slot: slotLabel };
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].forEach(day => {
      existingSlot[day] = "";
    });
    weeklyData.push(existingSlot);
  }

  // Add title to selected days in that slot
  days.forEach(day => {
    if (existingSlot[day]) {
      existingSlot[day] += `, ${title}`; // Append if already exists
    } else {
      existingSlot[day] = title;
    }
  });

  localStorage.setItem("weeklyTimetable", JSON.stringify(weeklyData));
  alert("Timetable entry saved!");
  clearTimetableForm();
}


function clearEventForm() {
  document.getElementById("eventTitle").value = "";
  document.getElementById("eventDate").value = "";
  document.getElementById("eventStartTime").value = "";
  document.getElementById("eventDuration").value = "";
  document.getElementById("eventRepeat").value = "None";
  document.getElementById("eventReminder").value = "";
  document.getElementById("eventReminderDays").value = "";
}

function clearTimetableForm() {
  document.getElementById("ttTitle").value = "";
  document.getElementById("ttStartTime").value = "";
  document.getElementById("ttEndTime").value = "";
  document.getElementById("ttReminder").value = "";
  document.querySelectorAll("input[name='ttDays']").forEach(e => e.checked = false);
}
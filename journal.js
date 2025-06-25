function saveEntry() {
  const date = document.getElementById("journalDate").value;
  const text = document.getElementById("journalEntry").value;
  if (!date || !text) return alert("Please enter a date and journal entry.");

  const entry = { date, text };
  const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
  const existingIndex = entries.findIndex(e => e.date === date);
  if (existingIndex >= 0) entries[existingIndex] = entry;
  else entries.push(entry);
  localStorage.setItem("journalEntries", JSON.stringify(entries));
  displayEntries();
}

function displayEntries() {
  const container = document.getElementById("entries");
  const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
  container.innerHTML = "";
  entries.forEach(entry => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <h3>${entry.date}</h3>
      <textarea id="text-${entry.date}" disabled>${entry.text}</textarea>
      <button onclick="enableEdit('${entry.date}')">Edit</button>
      <button onclick="deleteEntry('${entry.date}')">Delete</button>
    `;
    container.appendChild(div);
  });
}

function enableEdit(date) {
  const textarea = document.getElementById(`text-${date}`);
  textarea.disabled = false;
  textarea.focus();
  textarea.addEventListener("blur", () => saveEditedText(date, textarea.value));
}

function saveEditedText(date, newText) {
  const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
  const index = entries.findIndex(e => e.date === date);
  if (index >= 0) {
    entries[index].text = newText;
    localStorage.setItem("journalEntries", JSON.stringify(entries));
    displayEntries();
  }
}

function deleteEntry(date) {
  const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
  const updated = entries.filter(e => e.date !== date);
  localStorage.setItem("journalEntries", JSON.stringify(updated));
  displayEntries();
}


displayEntries();

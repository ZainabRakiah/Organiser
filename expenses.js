// Enhanced Expense Tracker JavaScript with Goal Editing/Deletion

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let salary = parseFloat(localStorage.getItem("salary")) || 0;
let bonusIncluded = localStorage.getItem("bonusIncluded") === "true";
let bonusIncludedTotal = parseFloat(localStorage.getItem("bonusIncludedTotal")) || 0;
let bonusExcludedTotal = parseFloat(localStorage.getItem("bonusExcludedTotal")) || 0;
let goals = JSON.parse(localStorage.getItem("goals")) || [];

function setSalary() {
  salary = parseFloat(document.getElementById("salaryInput").value) || 0;
  localStorage.setItem("salary", salary);
  alert("Salary added successfully!");
  displayBalance();
}

function setBonus() {
  const newBonus = parseFloat(document.getElementById("bonusInput").value) || 0;
  const include = document.getElementById("includeBonus").checked;

  if (include) {
    bonusIncludedTotal += newBonus;
    localStorage.setItem("bonusIncludedTotal", bonusIncludedTotal);
  } else {
    bonusExcludedTotal += newBonus;
    localStorage.setItem("bonusExcludedTotal", bonusExcludedTotal);
  }

  alert("Bonus added successfully!");
  displayBalance();
}

function addExpense() {
  const category = document.getElementById("category").value;
  const amount = parseFloat(document.getElementById("amount").value);
  if (!category || isNaN(amount)) return alert("Please enter valid data");

  expenses.push({ category, amount });
  localStorage.setItem("expenses", JSON.stringify(expenses));
  alert("Expense added successfully!");
  displayExpenses();
  displayBalance();
}

function editExpense(index) {
  const newCategory = prompt("Edit category:", expenses[index].category);
  const newAmount = parseFloat(prompt("Edit amount:", expenses[index].amount));
  if (newCategory && !isNaN(newAmount)) {
    expenses[index].category = newCategory;
    expenses[index].amount = newAmount;
    localStorage.setItem("expenses", JSON.stringify(expenses));
    displayExpenses();
    displayBalance();
  }
}

function deleteExpense(index) {
  if (confirm("Are you sure you want to delete this expense?")) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    displayExpenses();
    displayBalance();
  }
}

function displayExpenses() {
  const container = document.getElementById("expenseList");
  container.innerHTML = "";
  expenses.forEach((exp, i) => {
    const item = document.createElement("div");
    item.innerHTML = `
      ${exp.category}: ₹${exp.amount}
      <button onclick="editExpense(${i})">Edit</button>
      <button onclick="deleteExpense(${i})">Delete</button>
    `;
    container.appendChild(item);
  });
}

function displayBalance() {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = salary + bonusIncludedTotal;
  const balance = totalIncome - totalSpent;

  document.getElementById("balance").innerText = `Balance: ₹${balance}`;

  const bonusNote = document.getElementById("bonusNote");
  if (bonusExcludedTotal > 0) {
    bonusNote.innerText = `Bonus not included: ₹${bonusExcludedTotal}`;
  } else {
    bonusNote.innerText = ``;
  }

  checkGoalReminder(balance);
}

function saveGoal() {
  const item = document.getElementById("goalItem").value;
  const target = parseFloat(document.getElementById("goalAmount").value);
  const days = parseInt(document.getElementById("goalDuration").value);
  const startDateInput = document.getElementById("goalStartDate").value;
  const startDate = startDateInput ? new Date(startDateInput) : new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);

  if (!item || isNaN(target) || isNaN(days)) return alert("Please fill all goal fields");

  const newGoal = { item, target, days, startDate: startDate.toISOString(), endDate: endDate.toISOString() };

  // Check for overlaps
  const overlaps = goals.filter(g => {
    const gStart = new Date(g.startDate);
    const gEnd = new Date(g.endDate);
    return (startDate <= gEnd && endDate >= gStart);
  });

  if (overlaps.length > 0) {
    const overlapItems = overlaps.map(g => g.item).join(", ");
    const proceed = confirm(`This goal overlaps with: ${overlapItems}. Add anyway?`);
    if (!proceed) return;
  }

  goals.push(newGoal);
  localStorage.setItem("goals", JSON.stringify(goals));
  alert("Goal saved successfully!");
  checkGoalReminder();
}

function deleteGoal(index) {
  if (confirm("Are you sure you want to delete this goal?")) {
    goals.splice(index, 1);
    localStorage.setItem("goals", JSON.stringify(goals));
    checkGoalReminder();
  }
}

function editGoal(index) {
  const goal = goals[index];
  const newItem = prompt("Edit goal item:", goal.item);
  const newTarget = parseFloat(prompt("Edit goal target:", goal.target));
  const newDays = parseInt(prompt("Edit goal duration (in days):", goal.days));

  if (newItem && !isNaN(newTarget) && !isNaN(newDays)) {
    const newStart = new Date(goal.startDate);
    const newEnd = new Date(newStart);
    newEnd.setDate(newEnd.getDate() + newDays);
    goals[index] = { item: newItem, target: newTarget, days: newDays, startDate: newStart.toISOString(), endDate: newEnd.toISOString() };
    localStorage.setItem("goals", JSON.stringify(goals));
    checkGoalReminder();
  }
}

function checkGoalReminder(currentBalance = null) {
  const infoDiv = document.getElementById("goalInfo");
  const now = new Date();
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const includedBonus = bonusIncludedTotal;
  const totalIncome = salary + includedBonus;
  const balance = totalIncome - totalSpent;
  const balanceWithoutBonus = salary - totalSpent;

  infoDiv.innerHTML = "";

  if (goals.length === 0) return;

  let affordable = [];

  goals.forEach((goal, i) => {
    const { item, target, days, startDate, endDate } = goal;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

    const canAfford = balance >= target;
    if (canAfford) affordable.push(item);

    const block = document.createElement("div");
    block.innerHTML = `
      <p>🎯 Goal: ${item}</p>
      <p>📅 Target Date: ${end.toDateString()}</p>
      <p>🕒 Days Left: ${timeRemaining > 0 ? timeRemaining : 0}</p>
      <p>💰 Savings (with bonus): ₹${balance}</p>
      <p>💰 Savings (without bonus): ₹${balanceWithoutBonus}</p>
      <button onclick="editGoal(${i})">Edit</button>
      <button onclick="deleteGoal(${i})">Delete</button>
      <hr>
    `;
    infoDiv.appendChild(block);

    if (timeRemaining <= 0 && canAfford) {
      if ("Notification" in window) {
        Notification.requestPermission().then(p => {
          if (p === "granted") {
            new Notification("Goal Reminder", {
              body: `You can now buy ${item}. You've saved enough!`
            });
          }
        });
      }
    }
  });

  const summary = document.createElement("div");
  if (affordable.length > 0) {
    summary.innerHTML = `<strong>✅ You can afford: ${affordable.join(", ")}</strong>`;
  } else {
    summary.innerHTML = `<strong>⚠️ You cannot afford any goals yet.</strong>`;
  }
  infoDiv.appendChild(summary);
}

displayExpenses();
displayBalance();
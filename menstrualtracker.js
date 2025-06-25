const vaultList = document.getElementById("vaultList");
const defaultMasterPassword = "abc123";

// Load or set default master password
if (!localStorage.getItem("masterPassword")) {
  localStorage.setItem("masterPassword", defaultMasterPassword);
}

let storedPasswords = JSON.parse(localStorage.getItem("passwordVault")) || [];

function unlockVault() {
  const input = document.getElementById("masterPassInput").value;
  const savedPassword = localStorage.getItem("masterPassword");

  if (input === savedPassword) {
    document.getElementById("lockScreen").style.display = "none";
    document.getElementById("vault").style.display = "block";
    displayPasswords();
  } else {
    alert("Incorrect Password!");
  }
}

function addPassword() {
  const site = document.getElementById("site").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!site || !username || !password) {
    alert("Please fill all fields");
    return;
  }

  const entry = { site, username, password };
  storedPasswords.push(entry);
  localStorage.setItem("passwordVault", JSON.stringify(storedPasswords));
  displayPasswords();

  // Clear input fields
  document.getElementById("site").value = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

function displayPasswords() {
  vaultList.innerHTML = "";
  storedPasswords.forEach((entry, index) => {
    const div = document.createElement("div");
    div.className = "password-entry";
    div.innerHTML = `
      <span><strong>${entry.site}</strong> | ${entry.username} | ${entry.password}</span>
      <button onclick="deletePassword(${index})">❌</button>
    `;
    vaultList.appendChild(div);
  });
}

function deletePassword(index) {
  if (confirm("Delete this entry?")) {
    storedPasswords.splice(index, 1);
    localStorage.setItem("passwordVault", JSON.stringify(storedPasswords));
    displayPasswords();
  }
}

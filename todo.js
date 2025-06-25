const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    const tick = document.createElement("span");
    tick.textContent = todo.done ? "✔️" : "⬜";
    tick.className = "tick";
    tick.onclick = () => toggleTodo(index);
    const text = document.createElement("span");
    text.textContent = todo.text;
    if (todo.done) text.style.textDecoration = "line-through";
    const del = document.createElement("span");
    del.textContent = "❌";
    del.className = "delete-btn";
    del.onclick = () => deleteTodo(index);
    li.appendChild(tick);
    li.appendChild(text);
    li.appendChild(del);
    todoList.appendChild(li);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (text) {
    todos.push({ text, done: false });
    todoInput.value = "";
    updateTodos();
  }
}

function toggleTodo(index) {
  todos[index].done = !todos[index].done;
  updateTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  updateTodos();
}

function updateTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
}

renderTodos();

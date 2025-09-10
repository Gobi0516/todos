// Shared script for login, register, and todos pages
const SERVER_URL = "http://localhost:8080";
const token = localStorage.getItem("token");

// Login page logic
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(msg => { throw new Error(msg || "Login failed"); });
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem("token", data.token); // backend should return {token:"..."}
        window.location.href = "todos.html";
    })
    .catch(error => {
        alert(error.message);
    });
}

// Register page logic
function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${SERVER_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(msg => { throw new Error(msg || "Registration failed"); });
        }
        alert("Registration successful! Please log in.");
        window.location.href = "login.html";
    })
    .catch(error => {
        alert(error.message);
    });
}

// Todos page logic
function createTodoCard(todo) {
    const card = document.createElement("div");
    card.className = "todo-card";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => updateTodoStatus(todo));

    const span = document.createElement("span");
    span.textContent = todo.title;

    if (todo.completed) {
        span.style.textDecoration = "line-through";
        span.style.color = "gray";
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    card.appendChild(checkbox);
    card.appendChild(span);
    card.appendChild(deleteBtn);
    return card;
}

function loadTodos() {
    if (!token) {
        alert("Please log in first.");
        window.location.href = "login.html";
        return;
    }

    fetch(`${SERVER_URL}/api/v1/todo`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(msg => { throw new Error(msg || "Failed to get todos"); });
        }
        return response.json();
    })
    .then(todos => {
        const todoList = document.getElementById("todo-list");
        todoList.innerHTML = "";

        if (!todos || todos.length === 0) {
            todoList.innerHTML = "<p id='empty-message'>No todos yet. Add one!</p>";
        } else {
            todos.forEach(todo => {
                const card = createTodoCard(todo);
                todoList.appendChild(card);
            });
        }
    })
    .catch(error => {
        alert(error.message);
        document.getElementById("todo-list").innerHTML =
            "<p style='color: red;' id='empty-message'>Failed to load todos.</p>";
    });
}

function addTodo() {
    const input = document.getElementById("new-todo");
    const todoText = input.value.trim();

    if (todoText === "") {
        alert("Please enter a todo title.");
        return;
    }

    fetch(`${SERVER_URL}/api/v1/todo`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: todoText, completed: false })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(msg => { throw new Error(msg || "Failed to add todo"); });
        }
        return response.json();
    })
    .then(() => {
        input.value = "";
        loadTodos();
    })
    .catch(error => {
        alert(error.message);
    });
}

function updateTodoStatus(todo) {
    fetch(`${SERVER_URL}/api/v1/todo/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(todo)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(msg => { throw new Error(msg || "Failed to update todo"); });
        }
        return response.json();
    })
    .then(() => {
        loadTodos();
    })
    .catch(error => {
        alert(error.message);
    });
}

function deleteTodo(id) {
    fetch(`${SERVER_URL}/api/v1/todo/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(msg => { throw new Error(msg || "Failed to delete todo"); });
        }
        return response.text();
    })
    .then(() => {
        loadTodos();
    })
    .catch(error => {
        alert(error.message);
    });
}

// Page-specific initializations
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("todo-list")) {
        loadTodos();
    }
});

// ===== State =====

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// ===== DOM Elements =====

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

// ===== Utilities =====

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTask(text) {
    return {
        id: Date.now(),
        text,
        completed: false
    };
}

// ===== CRUD =====

// Create
function addTask() {
    const text = taskInput.value.trim();

    if (!text) return;

    tasks.push(createTask(text));

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

// Read + Render
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = `task ${task.completed ? "completed" : ""}`;

        li.dataset.id = task.id;

        li.innerHTML = `
            <span class="task-text">${task.text}</span>

            <div class="actions">
                <button class="toggle-btn">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// Update (Edit)
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const updatedText = prompt("Edit task:", task.text);

    if (updatedText === null) return;

    task.text = updatedText.trim();

    saveTasks();
    renderTasks();
}

// Update (Toggle Complete)
function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    task.completed = !task.completed;

    saveTasks();
    renderTasks();
}

// Delete
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

// ===== Event Listeners =====

// Add Task
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// Event Delegation
taskList.addEventListener("click", (e) => {

    const taskElement = e.target.closest(".task");

    if (!taskElement) return;

    const id = Number(taskElement.dataset.id);

    if (e.target.classList.contains("delete-btn")) {
        deleteTask(id);
    }

    if (e.target.classList.contains("edit-btn")) {
        editTask(id);
    }

    if (e.target.classList.contains("toggle-btn")) {
        toggleTask(id);
    }
});

// Filters
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

// ===== Initial Render =====

renderTasks();
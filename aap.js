const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("category");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");

const themeBtn = document.getElementById("themeBtn");

const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");

let tasks = [];
let currentFilter = "all";

/* =====================
   Load Data
===================== */

window.addEventListener("load", () => {

    tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    const savedTheme =
        localStorage.getItem("theme");

    if(savedTheme === "dark"){
        document.body.classList.add("dark-mode");
        themeBtn.innerHTML = "☀️ Light Mode";
    }

    renderTasks();
});

/* =====================
   Add Task
===================== */

addBtn.addEventListener("click", addTask);

function addTask(){

    const taskName = taskInput.value.trim();

    if(taskName === ""){
        showToast("Enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        category: categoryInput.value,
        priority: priorityInput.value,
        dueDate: dueDateInput.value,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    taskInput.value = "";
    dueDateInput.value = "";

    showToast("Task Added");
}

/* =====================
   Render Tasks
===================== */

function renderTasks(){

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    if(currentFilter === "completed"){
        filteredTasks =
            filteredTasks.filter(task =>
                task.completed
            );
    }

    if(currentFilter === "pending"){
        filteredTasks =
            filteredTasks.filter(task =>
                !task.completed
            );
    }

    const searchValue =
        searchInput.value.toLowerCase();

    filteredTasks =
        filteredTasks.filter(task =>
            task.name
            .toLowerCase()
            .includes(searchValue)
        );

    filteredTasks.forEach(task => {

        const li =
            document.createElement("li");

        li.className = "task-item";

        li.innerHTML = `
            <div class="task-top">

                <span class="task-name ${
                    task.completed
                    ? "completed"
                    : ""
                }">

                    ${task.name}

                </span>

                <span class="priority ${
                    task.priority.toLowerCase()
                }">

                    ${task.priority}

                </span>

            </div>

            <div>
                <p>📂 ${task.category}</p>
                <p>📅 Due: ${
                    task.dueDate || "Not Set"
                }</p>
                <p>⏰ ${
                    task.createdAt
                }</p>
            </div>

            <div class="task-bottom">

                <div class="task-actions">

                    <button
                        class="complete-btn"
                        onclick="toggleComplete(${task.id})">

                        ${
                            task.completed
                            ? "Undo"
                            : "Complete"
                        }

                    </button>

                    <button
                        class="edit-btn"
                        onclick="editTask(${task.id})">

                        Edit

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTask(${task.id})">

                        Delete

                    </button>

                </div>

            </div>
        `;

        taskList.appendChild(li);

    });

    updateDashboard();
    updateProgress();
}

/* =====================
   Complete Task
===================== */

function toggleComplete(id){

    tasks = tasks.map(task => {

        if(task.id === id){
            task.completed =
                !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();

    showToast("Task Updated");
}

/* =====================
   Delete Task
===================== */

function deleteTask(id){

    tasks =
        tasks.filter(task =>
            task.id !== id
        );

    saveTasks();
    renderTasks();

    showToast("Task Deleted");
}

/* =====================
   Edit Task
===================== */

function editTask(id){

    const task =
        tasks.find(task =>
            task.id === id
        );

    const newName =
        prompt(
            "Edit Task",
            task.name
        );

    if(
        newName === null ||
        newName.trim() === ""
    ){
        return;
    }

    task.name = newName.trim();

    saveTasks();
    renderTasks();

    showToast("Task Edited");
}

/* =====================
   Search
===================== */

searchInput.addEventListener(
    "input",
    renderTasks
);

/* =====================
   Filters
===================== */

const filterBtns =
    document.querySelectorAll(
        ".filter-btn"
    );

filterBtns.forEach(btn => {

    btn.addEventListener(
        "click",
        () => {

            filterBtns.forEach(b =>
                b.classList.remove(
                    "active"
                )
            );

            btn.classList.add(
                "active"
            );

            currentFilter =
                btn.dataset.filter;

            renderTasks();

        }
    );

});

/* =====================
   Dashboard
===================== */

function updateDashboard(){

    totalTasks.textContent =
        tasks.length;

    const completed =
        tasks.filter(task =>
            task.completed
        ).length;

    completedTasks.textContent =
        completed;

    pendingTasks.textContent =
        tasks.length - completed;
}

/* =====================
   Progress Bar
===================== */

function updateProgress(){

    const completed =
        tasks.filter(task =>
            task.completed
        ).length;

    const percent =
        tasks.length === 0
        ? 0
        : Math.round(
            (completed /
            tasks.length) * 100
        );

    progress.style.width =
        percent + "%";

    progressText.innerText =
        percent + "%";
}

/* =====================
   Save Tasks
===================== */

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

/* =====================
   Export JSON
===================== */

exportBtn.addEventListener(
    "click",
    () => {

        const data =
            JSON.stringify(
                tasks,
                null,
                2
            );

        const blob =
            new Blob(
                [data],
                {
                    type:
                    "application/json"
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const a =
            document.createElement("a");

        a.href = url;
        a.download =
            "tasks.json";

        a.click();

        showToast(
            "Tasks Exported"
        );

    }
);

/* =====================
   Import JSON
===================== */

importFile.addEventListener(
    "change",
    (e) => {

        const file =
            e.target.files[0];

        if(!file) return;

        const reader =
            new FileReader();

        reader.onload =
        function(event){

            tasks =
                JSON.parse(
                    event.target.result
                );

            saveTasks();
            renderTasks();

            showToast(
                "Tasks Imported"
            );
        };

        reader.readAsText(file);

    }
);

/* =====================
   Toast
===================== */

function showToast(message){

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        "toast";

    toast.innerText =
        message;

    document
        .getElementById(
            "toastContainer"
        )
        .appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}

/* =====================
   Enter Key
===================== */

taskInput.addEventListener(
    "keypress",
    (e) => {

        if(e.key === "Enter"){
            addTask();
        }

    }
);

/* =====================
   Dark Mode
===================== */

themeBtn.addEventListener(
    "click",
    () => {

        document.body
            .classList
            .toggle(
                "dark-mode"
            );

        const isDark =
            document.body
            .classList
            .contains(
                "dark-mode"
            );

        localStorage.setItem(
            "theme",
            isDark
            ? "dark"
            : "light"
        );

        themeBtn.innerHTML =
            isDark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";

    }
);
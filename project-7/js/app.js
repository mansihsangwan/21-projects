let tasks = [];
let currentView = "list";
let timerInterval = null;
let timeLeft = 25 * 60;
let initialTime = 25 * 60;
let focusedTaskId = null;
let currentChart = null;

// DOM ELEMENTS
const taskForm = document.getElementById("taskForm");
const tasksContainer = document.getElementById("tasks");
const subtaskList = document.getElementById("subtaskList");
const viewButtons = document.querySelectorAll(".nav-btn[data-view]");
const viewSections = document.querySelectorAll(".view-section");

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  setupEventListeners();
  setupTheme();
  renderApp();
});

// LOAD & SAVE TASKS
function loadTasks() {
  const data = localStorage.getItem("taskmate_data");
  if (data) {
    tasks = JSON.parse(data);
  }
}

function saveTasks() {
  localStorage.setItem("taskmate_data", JSON.stringify(tasks));
  renderApp();
}

function renderApp() {
  updateSidebarCount();

  viewSections.forEach((el) => el.classList.remove("active"));
  const activeSection = document.getElementById(`view-${currentView}`);
  if (activeSection) activeSection.classList.add("active");

  viewButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === currentView);
  });

  if (currentView === "list") renderListView();
  if (currentView === "board") renderKanbanBoard();
  if (currentView === "timer") updateTimerUI();
  if (currentView === "analytics") renderCharts();

  if (window.lucide) lucide.createIcons();
}

// LIST VIEW RENDERING
function renderListView() {
  tasksContainer.innerHTML = "";

  const searchTerm = document.getElementById("search").value.toLowerCase();
  const filterStatus = document.getElementById("filterStatus").value;
  const sortBy = document.getElementById("sortBy").value;

  let filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm);
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && task.status !== "done") ||
      (filterStatus === "completed" && task.status === "done");
    return matchesSearch && matchesFilter;
  });

  // SORTING LOGIC
  if (sortBy === "createdAsc") {
    filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sortBy === "createdDesc") {
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === "dueAsc") {
    filteredTasks.sort((a, b) => new Date(a.dueDate || "9999") - new Date(b.dueDate || "9999"));
  } else if (sortBy === "priorityHigh") {
    const priorityMap = { high: 1, medium: 2, low: 3 };
    filteredTasks.sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority]);
  }

  if (filteredTasks.length === 0) {
    tasksContainer.innerHTML = `<div style="text-align:center; padding: 2rem; opacity: 0.6;">No tasks found.</div>`;
    return;
  }

  filteredTasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    tasksContainer.appendChild(taskElement);
  });
}

function createTaskElement(task) {
  const div = document.createElement("div");
  div.className = `task ${task.status === "done" ? "completed" : ""}`;

  const totalSteps = task.subtasks ? task.subtasks.length : 0;
  const doneSteps = task.subtasks
    ? task.subtasks.filter((s) => s.done).length
    : 0;
  const progressPercent = totalSteps > 0 ? (doneSteps / totalSteps) * 100 : 0;

  div.innerHTML = `
    <div style="flex:1">
      <div class="title">${task.title}</div>
      <div class="meta">${task.notes || ""}</div>
      
      ${
        totalSteps > 0
          ? `
      <div class="subtask-progress">
        <div class="progress-track">
          <div class="progress-bar" style="width: ${progressPercent}%"></div>
        </div>
        <small>${doneSteps}/${totalSteps} steps</small>
      </div>`
          : ""
      }

      <div class="actions" style="margin-top: 8px;">
        <span class="chip">${task.priority}</span>
        <button class="btn ghost sm" onclick="fillEditForm('${task.id}')">Edit</button>
        <button class="btn ghost sm" onclick="deleteTask('${task.id}')">Delete</button>
      </div>
    </div>
    <input type="checkbox" ${task.status === "done" ? "checked" : ""} 
           onchange="toggleTaskStatus('${task.id}')">
  `;
  return div;
}

// KANBAN BOARD
function renderKanbanBoard() {
  const columns = {
    todo: document.querySelector("#col-todo .kanban-list"),
    doing: document.querySelector("#col-doing .kanban-list"),
    done: document.querySelector("#col-done .kanban-list"),
  };

  Object.values(columns).forEach((col) => (col.innerHTML = ""));

  tasks.forEach((task) => {
    const card = document.createElement("div");
    card.className = "task";
    card.draggable = true;
    card.innerHTML = `<div class="title">${task.title}</div> <small>${task.priority}</small>`;

    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", task.id);
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));

    if (columns[task.status]) {
      columns[task.status].appendChild(card);
    }
  });

  Object.values(columns).forEach((col) => {
    col.addEventListener("dragover", (e) => {
      e.preventDefault();
      col.classList.add("drag-over");
    });
    col.addEventListener("dragleave", () => col.classList.remove("drag-over"));
    col.addEventListener("drop", (e) => {
      e.preventDefault();
      col.classList.remove("drag-over");
      const taskId = e.dataTransfer.getData("text/plain");
      const newStatus = col.dataset.status;
      updateTaskStatus(taskId, newStatus);
    });
  });
}

// FOCUS TIMER
function setupFocusListeners() {
  const select = document.getElementById("timerTaskSelect");
  const changeBtn = document.getElementById("changeTaskBtn");

  if (select) {
    select.addEventListener("change", (e) => {
      if (e.target.value) startFocusSession(e.target.value);
    });
  }

  if (changeBtn) {
    changeBtn.addEventListener("click", () => {
      focusedTaskId = null;
      document.getElementById("timerTaskSelect").parentElement.style.display = "block";
      document.getElementById("activeTaskDisplay").style.display = "none";
      document.getElementById("timerTaskSelect").value = "";
    });
  }
}

function refreshFocusDropdown() {
  const select = document.getElementById("timerTaskSelect");
  if (!select) return;

  const currentVal = select.value;
  let html = '<option value="">Select a task to focus on...</option>';
  tasks
    .filter((t) => t.status !== "done")
    .forEach((t) => {
      html += `<option value="${t.id}">${t.title}</option>`;
    });
  select.innerHTML = html;
  select.value = currentVal;
}

function startFocusSession(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    focusedTaskId = taskId;
    document.getElementById("focusTaskTitle").innerText = task.title;
    document.getElementById("timerTaskSelect").parentElement.style.display = "none";
    document.getElementById("activeTaskDisplay").style.display = "block";
  }
}

function updateTimerUI() {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  document.getElementById("timerDisplay").textContent =
    `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const circle = document.querySelector(".ring-progress");
  const totalCircumference = 848;
  const progress = (initialTime - timeLeft) / initialTime;
  circle.style.strokeDashoffset = totalCircumference * (1 - progress);

  refreshFocusDropdown();
}

function startTimer() {
  if (timerInterval) return;

  if (!focusedTaskId) {
    const first = tasks.find((t) => t.status !== "done");
    if (first) startFocusSession(first.id);
  }

  document.getElementById("timerToggle").innerHTML =
    `<i data-lucide="pause"></i> Pause`;
  if (window.lucide) lucide.createIcons();

  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerUI();
    } else {
      stopTimer("Focus Session Complete! Take a break.");
    }
  }, 1000);
}

function stopTimer(message) {
  clearInterval(timerInterval);
  timerInterval = null;
  document.getElementById("timerToggle").innerHTML =
    `<i data-lucide="play"></i> Start Focus`;
  if (window.lucide) lucide.createIcons();

  if (message) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("TaskMate", { body: message });
    } else {
      alert(message);
    }

    if (focusedTaskId && confirm("Mark focused task as done?")) {
      updateTaskStatus(focusedTaskId, "done");
    }
  }
}

// EVENT LISTENERS
function setupEventListeners() {
  // Navigation
  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentView = btn.dataset.view;
      renderApp();
    });
  });

  // Add Task Form
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const subtaskItems = [];
    document.querySelectorAll(".subtask-text").forEach((input) => {
      if (input.value) subtaskItems.push({ text: input.value, done: false });
    });

    const newTask = {
      id: document.getElementById("editingId").value || Date.now().toString(),
      title: document.getElementById("title").value,
      priority: document.getElementById("priority").value,
      notes: document.getElementById("notes").value,
      dueDate: document.getElementById("due").value,
      status: "todo",
      subtasks: subtaskItems,
      createdAt: new Date().toISOString(),
    };

    const existingIndex = tasks.findIndex((t) => t.id === newTask.id);
    if (existingIndex >= 0) {
      tasks[existingIndex] = newTask;
    } else {
      tasks.unshift(newTask);
    }

    saveTasks();
    taskForm.reset();
    document.getElementById("subtaskList").innerHTML = "";
    document.getElementById("editingId").value = "";
    
    // Reset button text back to "Add Task"
    const saveBtn = document.getElementById("saveBtn");
    if (saveBtn) {
      saveBtn.textContent = "Add Task";
    }
  });

  // Add Subtask
  document.getElementById("addSubtaskBtn").addEventListener("click", () => {
    const div = document.createElement("div");
    div.className = "subtask-row";
    div.innerHTML = `
      <input type="checkbox" disabled>
      <input type="text" class="subtask-text" placeholder="Step...">
      <button type="button" onclick="this.parentElement.remove()">×</button>
    `;
    subtaskList.appendChild(div);
  });

  // Timer Controls
  document.getElementById("timerToggle").addEventListener("click", () => {
    if (timerInterval) stopTimer();
    else startTimer();
  });

  document.getElementById("timerReset").addEventListener("click", () => {
    stopTimer();
    timeLeft = initialTime;
    updateTimerUI();
  });

  // Timer Presets
  window.setTimer = (mins) => {
    stopTimer();
    timeLeft = mins * 60;
    initialTime = mins * 60;
    updateTimerUI();
  };

  // Export Data
  document.getElementById("exportBtn")?.addEventListener("click", () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(tasks));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "mytasks.json");
    downloadAnchor.click();
  });

  // Search & Filter
  document.getElementById("search").addEventListener("input", () => {
    renderListView();
  });

  document.getElementById("filterStatus").addEventListener("change", () => {
    renderListView();
  });

  document.getElementById("sortBy").addEventListener("change", () => {
    renderListView();
  });

  setupFocusListeners();
}

// THEME
function setupTheme() {
  const savedTheme = localStorage.getItem("taskmate_theme") || "dark";
  applyTheme(savedTheme);

  document.getElementById("themeBtn").addEventListener("click", () => {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("taskmate_theme", newTheme);
  });
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  const btn = document.getElementById("themeBtn");
  if (btn) {
    const icon = theme === "light" ? "moon" : "sun";
    btn.innerHTML = `<i data-lucide="${icon}"></i> Theme`;
    if (window.lucide) lucide.createIcons();
  }
}

// HELPERS
function updateSidebarCount() {
  document.getElementById("count").textContent = tasks.length;
}

// Global Functions
window.toggleTaskStatus = (id) => {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.status = task.status === "done" ? "todo" : "done";
    saveTasks();
  }
};

window.deleteTask = (id) => {
  if (confirm("Are you sure?")) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
  }
};

window.fillEditForm = (id) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  document.getElementById("title").value = task.title;
  document.getElementById("notes").value = task.notes;
  document.getElementById("priority").value = task.priority;
  document.getElementById("due").value = task.dueDate;
  document.getElementById("editingId").value = task.id;

  // Populate subtasks
  const subtaskList = document.getElementById("subtaskList");
  subtaskList.innerHTML = "";
  
  if (task.subtasks && task.subtasks.length > 0) {
    task.subtasks.forEach((subtask) => {
      const div = document.createElement("div");
      div.className = "subtask-row";
      div.innerHTML = `
        <input type="checkbox" ${subtask.done ? "checked" : ""} disabled>
        <input type="text" class="subtask-text" value="${subtask.text}" placeholder="Step...">
        <button type="button" onclick="this.parentElement.remove()">×</button>
      `;
      subtaskList.appendChild(div);
    });
  }
  
  // Change button text to "Update Task"
  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) {
    saveBtn.textContent = "Update Task";
  }

  viewButtons[0].click();
};

window.updateTaskStatus = (id, newStatus) => {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.status = newStatus;
    saveTasks();
  }
};

// ANALYTICS CHARTS
function renderCharts() {
  const ctx = document.getElementById("chartWeekly");
  if (!window.Chart || !ctx) return;

  const counts = { todo: 0, doing: 0, done: 0 };
  tasks.forEach((t) => counts[t.status]++);

  if (currentChart) {
    currentChart.destroy();
  }

  currentChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["To Do", "In Progress", "Done"],
      datasets: [
        {
          label: "Tasks",
          data: [counts.todo, counts.doing, counts.done],
          backgroundColor: ["#f4c95d", "#43b39b", "#f28f7b"],
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      animation: { duration: 300 },
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
    },
  });
}
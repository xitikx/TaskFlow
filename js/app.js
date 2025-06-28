document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    window.location.href = "index.html";
    return;
  }

  // Set user name and avatar
  document.getElementById("user-name").textContent = userData.name;
  document.getElementById("user-avatar").src = 
    `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(userData.name)}`;

  // Sign out
  document.getElementById("signout-btn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });

  const taskInput = document.getElementById("new-task");
  const addBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const stageTabs = document.querySelectorAll(".tab");

  let currentStage = "todo";

  // Load existing tasks
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks();

  addBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
      id: Date.now(),
      text,
      stage: "todo",
      timestamp: new Date().toLocaleString()
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
  });

  stageTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      stageTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentStage = tab.dataset.stage;
      renderTasks();
    });
  });

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.filter(t => t.stage === currentStage).forEach(task => renderTask(task));
    updateCounters();
  }

  function renderTask(task) {
    const div = document.createElement("div");
    div.className = "task-item";

    const title = document.createElement("h3");
    title.textContent = task.text;

    const btnGroup = document.createElement("div");
    btnGroup.className = "task-buttons";

    if (task.stage === "todo") {
      const completeBtn = createBtn("✔ Mark it as Completed", "complete-btn", () => moveTask(task.id, "completed"));
      const archiveBtn = createBtn("📥 Archive", "archive-btn", () => moveTask(task.id, "archived"));
      btnGroup.append(completeBtn, archiveBtn);
    } else if (task.stage === "completed") {
      const archiveBtn = createBtn("📥 Archive", "archive-btn", () => moveTask(task.id, "archived"));
      btnGroup.append(archiveBtn);
    } else if (task.stage === "archived") {
      const archivedNote = document.createElement("p");
      archivedNote.textContent = "Archived";
      archivedNote.style.fontSize = "0.8rem";
      archivedNote.style.color = "#aaa";
      btnGroup.appendChild(archivedNote);
    }

    const time = document.createElement("div");
    time.className = "timestamp";
    time.innerHTML = `Last modified at:<br><span>${task.timestamp}</span>`;

    div.append(title, btnGroup, time);
    taskList.appendChild(div);
  }

  function createBtn(label, className, onClick) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = className;
    btn.addEventListener("click", onClick);
    return btn;
  }

  function moveTask(id, newStage) {
    tasks = tasks.map(t => t.id === id ? { ...t, stage: newStage, timestamp: new Date().toLocaleString() } : t);
    saveTasks();
    renderTasks();
  }

  function updateCounters() {
    const todo = tasks.filter(t => t.stage === "todo").length;
    const comp = tasks.filter(t => t.stage === "completed").length;
    const arch = tasks.filter(t => t.stage === "archived").length;

    document.getElementById("count-todo").textContent = todo;
    document.getElementById("count-completed").textContent = comp;
    document.getElementById("count-archived").textContent = arch;
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});

// api.js - handles mock API calls (fetch, add, edit, delete tasks)

const STORAGE_KEY = "tasks";
const SIMULATED_DELAY = 600; //ms
const FAIL_RATE = 0.1; // 10%

const SEED_TASKS = [
  {
    id: "1",
    title: "Setup project structure",
    status: "done",
    priority: "high",
    dueDate: "2026-07-01",
  },
  {
    id: "2",
    title: "Design database schema",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-07-15",
  },
  {
    id: "3",
    title: "Build login page",
    status: "todo",
    priority: "high",
    dueDate: "2026-07-20",
  },
];

// This function read data from localStorage
function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TASKS));
      return [...SEED_TASKS];
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error("Storage read failed, using fallback:", error);
    return [...SEED_TASKS];
  }
}

// This function will write data to localStorage
function writeToStorage(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// This function will handle random delay + random fail
function simulateNetwork() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < FAIL_RATE) {
        reject(new Error("Network Failed: failed to reach server."));
      } else {
        resolve();
      }
    }, SIMULATED_DELAY);
  });
}

// This function will fetch all tasks
export async function fetchTasks() {
  await simulateNetwork();
  return readFromStorage();
}

//This function will add new task
export async function addTask(task) {
  await simulateNetwork();
  const tasks = readFromStorage();
  const newTask = { ...task, id: Date.now().toString() };
  tasks.push(newTask);
  writeToStorage(tasks);
  return newTask;
}

// This function will update task
export async function updateTask(id, updates) {
  await simulateNetwork();
  const tasks = readFromStorage();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Task not found.");
  tasks[index] = { ...tasks[index], ...updates };
  writeToStorage(tasks);
  return tasks[index];
}

// This function will delete task
export async function deleteTask(id) {
  await simulateNetwork();
  const tasks = readFromStorage();
  const filtered = tasks.filter((t) => t.id !== id);
  writeToStorage(filtered);
  return true;
}

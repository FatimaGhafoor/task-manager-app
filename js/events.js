// events.js - event delegation, handlers

// 1- Imports
import {
  getVisibleTasks,
  setCurrentPage,
  removeTaskFromState,
  addTaskToState,
  getState,
  updateTaskInState,
  setSearchQuery,
  setStatusFilter,
  setSort,
  getAllTasks,
} from "./state.js";
import { renderTable, showSpinner, hideSpinner, renderBoard } from "./dom.js";
import { deleteTask, addTask, updateTask } from "./api.js";
import { debounce } from "./utils.js";
import { showToast } from "./toast.js";
import { login, logout, isLoggedIn } from "./auth.js";


let editingTaskId = null;

// 2- DOM elements selection
const tableBody = document.getElementById("tasks-table-body");
const paginationControls = document.getElementById("pagination-controls");
const taskForm = document.getElementById("task-form");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");
const sortHeaders = document.querySelectorAll(".sortable");
const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout-btn");
const loginSection = document.getElementById("login-section");
const appSection = document.getElementById("app-section");
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const toggleViewBtn = document.getElementById("toggle-view-btn");
const boardView = document.getElementById("board-view");
const tableWrapper = document.getElementById("tasks-table-wrapper");

export function initViewToggleEvents() {
  toggleViewBtn.addEventListener("click", handleViewToggle);
}

function handleViewToggle() {
  const isBoardVisible = !boardView.classList.contains("hidden");

  if (isBoardVisible) {
    boardView.classList.add("hidden");
    tableWrapper.classList.remove("hidden");
    toggleViewBtn.textContent = "Switch to Board View";
  } else {
    boardView.classList.remove("hidden");
    tableWrapper.classList.add("hidden");
    toggleViewBtn.textContent = "Switch to Table View";
    renderBoard(getAllTasks());
  }
}

// 3- Theme toggle events
export function initThemeEvents() {
  applyStoredTheme();
  themeToggleBtn.addEventListener("click", handleThemeToggle);
}

function handleThemeToggle() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateToggleButtonText(isDark);
}

function applyStoredTheme() {
  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  updateToggleButtonText(isDark);
}

function updateToggleButtonText(isDark) {
  themeToggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// 3- Authentication events
export function initAuthEvents() {
  loginForm.addEventListener("submit", handleLogin);
  logoutBtn.addEventListener("click", handleLogout);
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const success = login(username, password);
  if (success) {
    showApp();
    showToast("Login successful!", "success");
  } else {
    showToast("Invalid credentials.", "error");
  }
}

function handleLogout() {
  logout();
  showLoginForm();
  showToast("Logged out successfully.", "success");
}

export function showApp() {
  loginSection.classList.add("hidden");
  appSection.classList.remove("hidden");
}

export function showLoginForm() {
  loginSection.classList.remove("hidden");
  appSection.classList.add("hidden");
}

// 4- Initialize app based on login state
export function initSortEvents() {
  sortHeaders.forEach((header) => {
    header.addEventListener("click", handleSortClick);
  });
}

function handleSortClick(e) {
  const field = e.currentTarget.dataset.field;
  const state = getState();
  const currentSort = state.sort;
  let direction = "asc";
  if (currentSort.field === field && currentSort.direction === "asc") {
    direction = "desc";
  }
  setSort(field, direction);
  renderTable(getVisibleTasks());
  updateSortIcons(field, direction);
}

function updateSortIcons(activeField, direction) {
  sortHeaders.forEach((header) => {
    const icon = header.querySelector(".sort-icon");
    if (header.dataset.field === activeField) {
      icon.textContent = direction === "asc" ? " ↑" : " ↓";
    } else {
      icon.textContent = " ↕";
    }
  });
}

export function initFilterEvents() {
  statusFilter.addEventListener("change", handleStatusFilterChange);
}

function handleStatusFilterChange(e) {
  const status = e.target.value;
  setStatusFilter(status);
  renderTable(getVisibleTasks());
}

export function initSearchEvents() {
  searchInput.addEventListener("input", debounce(handleSearchInput, 300));
}
function handleSearchInput(e) {
  const query = e.target.value.trim();
  setSearchQuery(query);
  renderTable(getVisibleTasks());
}

// 5- Form events
export function initFormEvents() {
  taskForm.addEventListener("submit", handleFormSubmit);
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("task-title").value;
  const status = document.getElementById("task-status").value;
  const priority = document.getElementById("task-priority").value;
  const dueDate = document.getElementById("task-due-date").value;
  if (!title || !status || !priority || !dueDate) {
    alert("Please fill in all fields.");
    return;
  }
  const taskData = { title, status, priority, dueDate };
  const submitBtn = taskForm.querySelector('button[type="submit"]');

  try {
    submitBtn.disabled = true;
    showSpinner();

    if (editingTaskId) {
      const updatedTask = await updateTask(editingTaskId, taskData);
      updateTaskInState(editingTaskId, updatedTask);
      showToast("Task updated successfully!", "success");
    } else {
      const savedTask = await addTask(taskData);
      addTaskToState(savedTask);
      showToast("Task added successfully!", "success");
    }
    renderTable(getVisibleTasks());
    resetForm();
  } catch (error) {
    showToast("Failed to submit task.", "error");
  } finally {
    hideSpinner();
    submitBtn.disabled = false;
  }
}
function resetForm() {
  taskForm.reset();
  editingTaskId = null;
  const submitBtn = taskForm.querySelector('button[type="submit"]');
  submitBtn.textContent = "Add Task";
}
// 6- Table events
export function initTableEvents() {
  tableBody.addEventListener("click", handleTableClick);
}

function handleTableClick(e) {
  const editBtn = e.target.closest(".edit-btn");
  const deleteBtn = e.target.closest(".delete-btn");

  if (editBtn) {
    const taskId = editBtn.dataset.id;
    handleEditTask(taskId);
    return;
  } else if (deleteBtn) {
    const taskId = deleteBtn.dataset.id;
    handleDeleteTask(taskId);
    return;
  }
}

// 7- Edit and Delete handlers
function handleEditTask(taskId) {
  const state = getState();
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task) {
    console.error(`Task with ID ${taskId} not found.`);
    return;
  }
  editingTaskId = taskId;

  document.getElementById("task-title").value = task.title;
  document.getElementById("task-status").value = task.status;
  document.getElementById("task-priority").value = task.priority;
  document.getElementById("task-due-date").value = task.dueDate;

  const submitBtn = taskForm.querySelector('button[type="submit"]');
  submitBtn.textContent = "Update Task";
}

async function handleDeleteTask(taskId) {
  const confirmed = confirm("Are you sure you want to delete this task?");
  if (!confirmed) return;

  try {
    showSpinner();
    await deleteTask(taskId);
    removeTaskFromState(taskId);
    renderTable(getVisibleTasks());
    showToast("Task deleted successfully!", "success");
  } catch (error) {
    showToast("Failed to delete task.", "error");
  } finally {
    hideSpinner();
  }
}

// 8- Pagination events
export function initPaginationEvents() {
  paginationControls.addEventListener("click", handlePaginationClick);
}

function handlePaginationClick(e) {
  const pageBtn = e.target.closest(".page-btn");
  if (!pageBtn) return;
  const page = Number(pageBtn.dataset.page);
  setCurrentPage(page);
  renderTable(getVisibleTasks());
}

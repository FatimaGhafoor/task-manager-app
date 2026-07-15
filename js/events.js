// events.js - event delegation, handlers

// 1- Imports
import {
  getVisibleTasks,
  setCurrentPage,
  removeTaskFromState,
  addTaskToState,
} from "./state.js";
import { renderTable, showSpinner, hideSpinner } from "./dom.js";
import { deleteTask, addTask } from "./api.js";

// 2- DOM elements selection
const tableBody = document.getElementById("tasks-table-body");
const paginationControls = document.getElementById("pagination-controls");
const taskForm = document.getElementById("task-form");

export function initFormEvents() {
  taskForm.addEventListener("submit", handleAddTask);
}

async function handleAddTask(e) {
  e.preventDefault();

  const title = document.getElementById("task-title").value;
  const status = document.getElementById("task-status").value;
  const priority = document.getElementById("task-priority").value;
  const dueDate = document.getElementById("task-due-date").value;
  if (!title || !status || !priority || !dueDate) {
    alert("Please fill in all fields.");
    return;
  }
  const newTask = { title, status, priority, dueDate };
  const submitBtn = taskForm.querySelector('button[type="submit"]');

  try {
    submitBtn.disabled = true;
    showSpinner();
    const savedTask = await addTask(newTask);
    addTaskToState(savedTask);
    renderTable(getVisibleTasks());
    taskForm.reset();
    console.log("Task added successfully:", savedTask);
  } catch (error) {
    console.error("Add task failed:", error.message);
  } finally {
    hideSpinner();
    submitBtn.disabled = false;
  }
}
// 3- Table events
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
// 4- Task actions
function handleEditTask(taskId) {
  console.log(`Edit task with ID: ${taskId}`);
  // Implement edit functionality here
}

async function handleDeleteTask(taskId) {
  const confirmed = confirm("Are you sure you want to delete this task?");
  if (!confirmed) return;

  try {
    // Implement delete functionality here
    showSpinner();
    await deleteTask(taskId);
    removeTaskFromState(taskId);
    renderTable(getVisibleTasks());
    console.log(`Task deleted successfully : ${taskId}`);
  } catch (error) {
    console.error("Delete failed:", error.message);
  } finally {
    // Optionally, you can re-render the table or update the UI after deletion
    hideSpinner();
  }
}

// 5- Pagination events
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

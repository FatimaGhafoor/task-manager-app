// events.js - event delegation, handlers

// 1- Imports
import {
  getVisibleTasks,
  setCurrentPage,
  removeTaskFromState,
  addTaskToState,
  getState,
  updateTaskInState,
} from "./state.js";
import { renderTable, showSpinner, hideSpinner } from "./dom.js";
import { deleteTask, addTask, updateTask } from "./api.js";

// 2- DOM elements selection
const tableBody = document.getElementById("tasks-table-body");
const paginationControls = document.getElementById("pagination-controls");
const taskForm = document.getElementById("task-form");

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
      console.log("Task updated successfully:", updatedTask);
    } else {
      const savedTask = await addTask(taskData);
      addTaskToState(savedTask);
      console.log("Task added successfully:", savedTask);
    }
    renderTable(getVisibleTasks());
    resetForm();
  } catch (error) {
    console.error("Form submit failed:", error.message);
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
let editingTaskId = null;
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

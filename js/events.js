// events.js - event delegation, handlers

// 1- Imports
import { getVisibleTasks, setCurrentPage } from "./state.js";
import { renderTable } from "./dom.js";

// 2- DOM elements selection
const tableBody = document.getElementById("tasks-table-body");
const paginationControls = document.getElementById("pagination-controls");

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

function handleDeleteTask(taskId) {
  console.log(`Delete task with ID: ${taskId}`);
  // Implement delete functionality here
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

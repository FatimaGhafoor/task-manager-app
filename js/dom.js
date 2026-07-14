// dom.js - renders tasks table, pagination, loading state, empty state

// 1- DOM elements selection
const tableBody = document.getElementById("tasks-table-body");
const emptyState = document.getElementById("empty-state");
const paginationControls = document.getElementById("pagination-controls");
const spinner = document.getElementById("loading-spinner");
const taskTable = document.getElementById("tasks-table");

// 2- Loading spinner
export function showSpinner() {
  spinner.classList.remove("hidden");
  taskTable.classList.add("hidden");
}
export function hideSpinner() {
  spinner.classList.add("hidden");
  taskTable.classList.remove("hidden");
}

// 3- Table rendering
export function renderTable(visibleTasksResult) {
  const { tasks, totalItems, totalPages, currentPage } = visibleTasksResult;

  if (tasks.length === 0) {
    tableBody.innerHTML = "";
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    tableBody.innerHTML = tasks.map(taskRowTemplate).join("");
  }

  renderPagination(totalPages, currentPage);
}

// 4- Table row template
function taskRowTemplate(task) {
  return `
    <tr data-id="${task.id}">
      <td>${escapeHtml(task.title)}</td>
      <td>${task.status}</td>
      <td>${task.priority}</td>
      <td>${task.dueDate}</td>
      <td>
        <button class="edit-btn" data-id="${task.id}">Edit</button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      </td>
    </tr>
  `;
}

// 5- Security
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// 6- Pagination rendering
function renderPagination(totalPages, currentPage) {
  if (totalPages <= 1) {
    paginationControls.innerHTML = "";
    return;
  }

  let buttons = "";
  for (let i = 1; i <= totalPages; i++) {
    const activeClass = i === currentPage ? "active" : "";
    buttons += `<button class="page-btn ${activeClass}" data-page="${i}">${i}</button>`;
  }
  paginationControls.innerHTML = buttons;
}

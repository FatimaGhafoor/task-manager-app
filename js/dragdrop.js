// dragdrop.js — handles drag and drop between board columns

import { getState, updateTaskInState } from "./state.js";
import { updateTask } from "./api.js";
import { renderBoard } from "./dom.js";
import { showToast } from "./toast.js";


let draggedTaskId = null;

export function initDragDropEvents() {
  const cardsContainer = document.getElementById("board-view");

  // Event delegation for drag events on task cards
  cardsContainer.addEventListener("dragstart", handleDragStart);
  cardsContainer.addEventListener("dragend", handleDragEnd);

  const columnBodies = document.querySelectorAll(".column-body");
  columnBodies.forEach((col) => {
    col.addEventListener("dragover", handleDragOver);
    col.addEventListener("dragleave", handleDragLeave);
    col.addEventListener("drop", handleDrop);
  });
}

function handleDragStart(e) {
  const card = e.target.closest(".task-card");
  if (!card) return;
  draggedTaskId = card.dataset.id;
  card.classList.add("dragging");
}

function handleDragEnd(e) {
  const card = e.target.closest(".task-card");
  if (card) card.classList.remove("dragging");
}

function handleDragOver(e) {
  e.preventDefault(); // Allow drop
  e.currentTarget.classList.add("drag-over");
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove("drag-over");
}

async function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove("drag-over");

  const newStatus = e.currentTarget.closest(".board-column").dataset.status;
  if (!draggedTaskId) return;

  try {
    const updatedTask = await updateTask(draggedTaskId, { status: newStatus });
    updateTaskInState(draggedTaskId, updatedTask);
    renderBoard(getState().tasks);
    showToast("Task moved successfully!", "success");
  } catch (error) {
    showToast("Failed to move task.", "error");
  }

  draggedTaskId = null;
}

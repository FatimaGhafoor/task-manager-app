// state.js — central store for tasks, filters, sort, and pagination

const state = {
  tasks: [],
  filters: {
    status: "all",
    searchQuery: "",
  },
  sort: {
    field: "dueDate",
    direction: "asc",
  },
  pagination: {
    currentPage: 1,
    pageSize: 5,
  },
};

// Setters

export function setTasks(tasks) {
  state.tasks = tasks;
}

export function setStatusFilter(status) {
  state.filters.status = status;
  state.pagination.currentPage = 1;
}

export function setSearchQuery(query) {
  state.filters.searchQuery = query;
  state.pagination.currentPage = 1;
}

export function setSort(field, direction) {
  state.sort.field = field;
  state.sort.direction = direction;
}

export function setCurrentPage(page) {
  state.pagination.currentPage = page;
}

// Getters

export function getState() {
  return state;
}

// pipeline: filter → search → sort → paginate

export function getVisibleTasks() {
  let result = [...state.tasks];

  // 1. Status filter
  if (state.filters.status !== "all") {
    result = result.filter((task) => task.status === state.filters.status);
  }

  // 2. Search filter
  if (state.filters.searchQuery.trim() !== "") {
    const query = state.filters.searchQuery.toLowerCase();
    result = result.filter((task) => task.title.toLowerCase().includes(query));
  }

  // 3. Sort
  const { field, direction } = state.sort;
  result.sort((a, b) => {
    let valA = a[field];
    let valB = b[field];

    // priority (high > medium > low)
    if (field === "priority") {
      const order = { high: 3, medium: 2, low: 1 };
      valA = order[valA] ?? 0;
      valB = order[valB] ?? 0;
    }

    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  // 4. Pagination
  const totalItems = result.length;
  const { currentPage, pageSize } = state.pagination;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedResult = result.slice(startIndex, endIndex);

  return {
    tasks: paginatedResult,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    currentPage,
  };
}

export function removeTaskFromState(taskId) {
  state.tasks = state.tasks.filter((task) => task.id !== taskId);
}

export function addTaskToState(task) {
  state.tasks.push(task);
}

export function updateTaskInState(id, updatedTask) {
  const index = state.tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    state.tasks[index] = updatedTask;
  }
}

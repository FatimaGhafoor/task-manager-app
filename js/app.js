// app.js - entry point, init

import { fetchTasks } from "./api.js";
import { setTasks, getVisibleTasks } from "./state.js";
import { renderTable } from "./dom.js";
import {
  initTableEvents,
  initPaginationEvents,
  initFormEvents,
  initSearchEvents,
  initFilterEvents,
  initSortEvents,
  initAuthEvents,
  showLoginForm,
  showApp,
} from "./events.js";
import { isLoggedIn } from "./auth.js";

initTableEvents();
initPaginationEvents();
initFormEvents();
initSearchEvents();
initFilterEvents();
initSortEvents();
initAuthEvents();


if (isLoggedIn()) {
  showApp();
  const tasks = await fetchTasks();
  setTasks(tasks);
  renderTable(getVisibleTasks());
} else {
  showLoginForm();
}


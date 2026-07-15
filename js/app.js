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
} from "./events.js";

const tasks = await fetchTasks();
setTasks(tasks);
renderTable(getVisibleTasks());

initTableEvents();
initPaginationEvents();
initFormEvents();
initSearchEvents();
initFilterEvents();

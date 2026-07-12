// app.js - entry point, init

import { fetchTasks } from "./api.js";

fetchTasks().then(console.log);

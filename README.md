# Task Manager App

A Task Management application built entirely with **vanilla JavaScript** (no frameworks) — developed as an interview assignment to demonstrate core JS fundamentals: async/await, closures, state management, event delegation, and DOM manipulation.

## 🚀 Features

- **Mock Login** — session-based authentication (no backend)
- **Mock API** — simulated network requests using Promises + `setTimeout`, with random failure rate for realistic error handling
- **Task Table** — sortable, searchable, filterable, paginated
- **Debounced Search** — search by title with 300ms debounce
- **Filter** — by task status (Todo / In Progress / Done)
- **Sort** — by due date and priority (toggle ascending/descending)
- **Pagination** — client-side, page-based navigation
- **CRUD Operations** — add, edit, delete tasks (shared form for add/edit)
- **Drag & Drop Board View** — Kanban-style board (Todo / In Progress / Done) using native HTML5 Drag & Drop API
- **LocalStorage Persistence** — acts as both the mock "database" and offline fallback
- **Loading Spinner** — during simulated network delay
- **Toast Notifications** — success/error feedback for all operations
- **Dark / Light Mode** — theme toggle with persisted preference
- **Responsive Design** — mobile-friendly layout with dedicated breakpoint

## 🛠️ Tech Stack

- HTML5, CSS3, Vanilla JavaScript (ES Modules)
- No frameworks, no build tools, no external libraries
- `localStorage` / `sessionStorage` for persistence

## 🏗️ Architecture

Modular, single-responsibility file structure:

```
task-manager-app/
├── index.html
├── css/
│   ├── style.css        → imports below
│   ├── variables.css    → design tokens, dark mode overrides
│   ├── base.css         → reset, typography, generic elements
│   ├── components.css   → feature-specific styles (table, board, toast, forms)
│   └── responsive.css   → media queries
└── js/
    ├── app.js       → entry point, initializes app
    ├── api.js       → mock API layer (Promise + setTimeout, localStorage-backed)
    ├── auth.js      → mock login/logout logic
    ├── state.js     → central state (tasks, filters, sort, pagination) + filter/sort/paginate pipeline
    ├── dom.js       → table & board rendering
    ├── events.js    → event delegation and UI wiring
    ├── dragdrop.js  → native HTML5 drag-and-drop logic
    ├── toast.js     → toast notification system
    └── utils.js     → debounce helper
```

## 💡 Key Technical Decisions

- **Mock API via Promises + `setTimeout`** (not `json-server`) — keeps the focus on demonstrating async JS fundamentals rather than external tooling, per the "no framework" requirement.
- **`localStorage` doubles as the mock database and the offline fallback** — since the API _is_ localStorage under the hood, "API unavailable" gracefully degrades to the same data source.
- **Single source of truth (`state.js`)** — both Table and Board views render from the same underlying task list, keeping state predictable and in sync.
- **Error handling separation of concerns** — `api.js` never catches its own errors; it throws and lets them bubble up to `events.js`, which is responsible for user-facing feedback (toasts). This keeps the data layer reusable and decoupled from UI logic.
- **Event delegation throughout** — listeners are attached to stable parent elements (not dynamically-rendered children) since the table/board re-render fully on every state change.

## 📌 Known Trade-offs (given time constraints)

- All UI wiring lives in a single `events.js` file. A future iteration would split this into `auth-events.js`, `form-events.js`, `table-events.js`, etc., for better separation of concerns.
- All work was committed directly to `main` (no feature branches) to prioritize speed for the assignment deadline.

## ▶️ Running the Project

No build step required — open `index.html` via a local server (e.g., VS Code Live Server) since ES Modules require `http://` rather than `file://`.

**Demo login credentials:** `admin` / `password`

## Status

🚧 Work in Progress

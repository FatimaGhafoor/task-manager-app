// auth.js - mock login logic

const SESSION_KEY = "isLoggedIn";
const MOCK_USERNAME = "admin";
const MOCK_PASSWORD = "123456";

export function login(username, password) {
  if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
    localStorage.setItem(SESSION_KEY, "true");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY) === "true";
}

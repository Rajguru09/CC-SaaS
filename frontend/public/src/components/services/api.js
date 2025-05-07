// components/services/api.js

const API_BASE_URL = "http://localhost:8000"; // change this in production

export async function signupUser(userData) {
  return fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  }).then((res) => res.json());
}

export async function loginUser(userData) {
  return fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  }).then((res) => res.json());
}

export async function getUserDashboard(token) {
  return fetch(`${API_BASE_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());
}

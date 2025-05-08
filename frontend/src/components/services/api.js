// frontend/src/components/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Centralized response handler
const handleResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid response from server.");
  }

  if (!res.ok) {
    throw new Error(data?.detail || "Something went wrong");
  }

  return data;
};

// Helper: create headers
const createHeaders = (token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// API Calls

export async function signupUser(userData) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: createHeaders(),
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
}

export async function loginUser(userData) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: createHeaders(),
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
}

export async function getUserDashboard(token) {
  const res = await fetch(`${API_BASE_URL}/users/dashboard`, {
    method: "GET",
    headers: createHeaders(token),
  });
  return handleResponse(res);
}

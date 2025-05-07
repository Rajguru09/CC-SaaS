// frontend/src/components/services/api.js
const API_BASE_URL = "http://localhost:8000"; // change this in production

// Utility to handle response and errors
const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Something went wrong");
  }
  return res.json();
};

export async function signupUser(userData) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
}

export async function loginUser(userData) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
}

export async function getUserDashboard(token) {
  const res = await fetch(`${API_BASE_URL}/users/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

// frontend/src/components/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Centralized response handler with improved error handling
const handleResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("Invalid response from server.");
  }

  if (!res.ok) {
    // Specific error messages
    throw new Error(data?.detail || "Something went wrong");
  }

  return data;
};

// Helper: create headers with optional token
const createHeaders = (token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// Generic fetch API function to reduce redundancy
const fetchAPI = async (url, method, data = null, token = null) => {
  const options = {
    method: method,
    headers: createHeaders(token),
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const res = await fetch(`${API_BASE_URL}${url}`, options);
  return handleResponse(res);
};

// API Calls

export async function signupUser(userData) {
  return fetchAPI('/auth/signup', 'POST', userData);
}

export async function loginUser(userData) {
  return fetchAPI('/auth/login', 'POST', userData);
}

export async function getUserDashboard(token) {
  return fetchAPI('/users/dashboard', 'GET', null, token);
}


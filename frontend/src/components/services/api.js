import jwtDecode from "jwt-decode";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Helpers ---

// Centralized response handler
const handleResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid response from server.");
  }

  if (!res.ok) {
    throw new Error(data?.detail || "Something went wrong.");
  }

  return data;
};

// Create request headers
const createHeaders = (token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Timeout-enabled fetch wrapper
const fetchWithTimeout = (url, options, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Request timed out")), timeout);
    fetch(url, options)
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timer));
  });
};

// Generic API fetch function
const fetchAPI = async (url, method, data = null, token = null) => {
  const options = {
    method,
    headers: createHeaders(token),
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}${url}`, options);
    return await handleResponse(res);
  } catch (err) {
    console.error(`[API] ${method} ${url} failed:`, err.message);
    throw new Error(err.message);
  }
};

// --- Exported API Calls ---

// Signup new user
export async function signupUser(userData) {
  console.log("Signup payload:", userData);
  return fetchAPI("/auth/signup", "POST", userData);
}

// Login user
export async function loginUser(userData) {
  return fetchAPI("/auth/login", "POST", userData);
}

// Fetch user dashboard (protected route)
export async function getUserDashboard(token) {
  return fetchAPI("/users/dashboard", "GET", null, token);
}

// Token expiry check utility
export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

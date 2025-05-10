const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Centralized response handler with improved error handling
const handleResponse = async (res) => {
  let data;
  try {
    // Try parsing the response as JSON
    data = await res.json();
  } catch (err) {
    throw new Error("Invalid response from server.");
  }

  // Handle non-200 status codes by throwing an error with the appropriate message
  if (!res.ok) {
    throw new Error(data?.detail || "Something went wrong with the request.");
  }

  return data;
};

// Helper: Create headers with optional token
const createHeaders = (token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// Timeout helper function for API requests
const fetchWithTimeout = (url, options, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Request timed out")), timeout);
    fetch(url, options)
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timer));
  });
};

// Generic fetch API function to reduce redundancy
const fetchAPI = async (url, method, data = null, token = null) => {
  const options = {
    method: method,
    headers: createHeaders(token), // Attach token if present
  };

  // If there's data (POST or PUT request), stringify it
  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}${url}`, options);
    return await handleResponse(res); // Wait and return the response data
  } catch (err) {
    throw new Error(`Error: ${err.message}`);
  }
};

// API Calls

// User signup
export async function signupUser(userData) {
  console.log("Signup payload:", userData); // For debugging
  return fetchAPI('/auth/signup', 'POST', userData);
}

// User login
export async function loginUser(userData) {
  const response = await fetchAPI('/auth/login', 'POST', userData);
  return response;  // Now returns the full response including user data
}

// Get user dashboard with token
export async function getUserDashboard(token) {
  return fetchAPI('/users/dashboard', 'GET', null, token);
}

// Helper function to check token expiry
export const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 < Date.now(); // JWT expiration time is in seconds, convert to milliseconds
  } catch (error) {
    return true; // If there's any error decoding, consider it expired
  }
};

//#frontend/public/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added error state
  const navigate = useNavigate(); // Using React Router for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    // Simple email validation (you can expand it)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);  // Start loading state
    setError(null);    // Reset previous errors

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);  // End loading state

      if (res.ok) {
        localStorage.setItem("access_token", data.access_token); // Save token correctly
        navigate("/dashboard"); // Use navigate for redirect
      } else {
        setError(data.detail || "Login failed"); // Show error message
      }
    } catch (err) {
      setLoading(false);  // End loading state
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto">
      <h1 className="text-xl font-bold">Login</h1>
      <form onSubmit={handleLogin} className="mt-4 space-y-4">
        {error && <p className="text-red-500">{error}</p>}  {/* Display error */}
        
        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 w-full"
          type="submit"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

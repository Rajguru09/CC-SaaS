// frontend/src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../components/services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await loginUser({ email, password });

      if (response?.access_token) {
        localStorage.setItem("access_token", response.access_token);
        setEmail("");
        setPassword("");
        setLoading(false);
        navigate("/dashboard");
      } else {
        setLoading(false);
        setError(response?.detail || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setLoading(false);
      const errorMessage = err?.response?.data?.detail || "An error occurred. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Login to Tech Solution</h2>

      <div className="bg-white p-6 shadow-md rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-center">Log In</h3>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            className="border p-2 w-full mb-4"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email"
          />

          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            className="border p-2 w-full mb-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 w-full rounded"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

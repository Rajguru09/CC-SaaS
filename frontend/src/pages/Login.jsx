// frontend/src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../components/services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
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
        // Save token to either localStorage or sessionStorage
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("access_token", response.access_token);

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
          />

          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
            <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">
              Forgot Password?
            </Link>
          </div>

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

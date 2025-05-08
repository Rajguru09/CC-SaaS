// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://65.2.148.46:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        navigate("/dashboard");
      } else {
        setError(data.detail || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

      <div className="bg-white p-6 shadow-md rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-center">Login</h3>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            autoComplete="email"
            className="border p-2 w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            autoComplete="current-password"
            className="border p-2 w-full"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}

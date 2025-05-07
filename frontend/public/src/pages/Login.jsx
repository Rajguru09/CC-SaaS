import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Using React Router for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }

    setLoading(true);  // Start loading state

    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);  // End loading state

    if (res.ok) {
      localStorage.setItem("token", data.access_token);
      alert("Login successful!");
      navigate("/dashboard"); // Use navigate for redirect
    } else {
      alert(data.detail || "Login failed");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Login</h1>
      <form onSubmit={handleLogin} className="mt-4 space-y-2">
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
          className="bg-green-600 text-white px-4 py-2"
          type="submit"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

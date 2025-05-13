import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../components/services/api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(null); // State to handle email validation errors
  const [passwordError, setPasswordError] = useState(null); // State to handle password validation errors
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Reset error states on new attempt
    setError(null);
    setEmailError(null);
    setPasswordError(null);

    // Input validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await signupUser({ email, password });

      if (response?.access_token) {
        localStorage.setItem("access_token", response.access_token);
        setLoading(false);
        navigate("/dashboard");
      } else {
        setLoading(false);
        setError(response?.detail || "Signup failed. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.detail || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>

      <div className="bg-white p-6 shadow-md rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-center">Sign Up</h3>

        {error && <p className="text-red-500 text-center mb-4" aria-live="assertive">{error}</p>}

        <form onSubmit={handleSignup}>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            className={`border p-2 w-full mb-4 ${emailError ? "border-red-500" : ""}`}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-describedby="email-error"
          />
          {emailError && <p id="email-error" className="text-red-500 text-sm">{emailError}</p>}

          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            className={`border p-2 w-full mb-4 ${passwordError ? "border-red-500" : ""}`}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-describedby="password-error"
          />
          {passwordError && <p id="password-error" className="text-red-500 text-sm">{passwordError}</p>}

          <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
          <input
            id="confirm-password"
            className={`border p-2 w-full mb-4 ${passwordError ? "border-red-500" : ""}`}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 w-full rounded"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="4" strokeLinecap="round" />
                <path d="M4 12a8 8 0 1 1 16 0a8 8 0 0 1-16 0" fill="none" strokeLinecap="round" />
              </svg>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

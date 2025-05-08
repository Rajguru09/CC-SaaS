// frontend/src/pages/AWSCredentials.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AWSCredentials() {
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || "/dashboard";

  const handleSubmit = (e) => {
    e.preventDefault();

    // Example validation logic (in real-world, send to backend)
    if (accessKey === "demo-access" && secretKey === "demo-secret") {
      localStorage.setItem("aws_access_key", accessKey);
      localStorage.setItem("aws_secret_key", secretKey);
      navigate(redirectTo); // Go to the intended page (IdleResources / CloudAudit)
    } else {
      setError("Please enter correct access");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Enter AWS Credentials</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          className="border p-2 w-full mb-4"
          type="text"
          placeholder="AWS Access Key"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full mb-4"
          type="password"
          placeholder="AWS Secret Key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Connect
        </button>
      </form>
    </div>
  );
}

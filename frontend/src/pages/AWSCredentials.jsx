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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation (You can replace it with actual backend API validation)
    if (!accessKey || !secretKey) {
      setError("Both AWS Access Key and Secret Key are required.");
      return;
    }

    try {
      // Example: Make API request to verify AWS credentials
      const isValidCredentials = await validateAWSCredentials(accessKey, secretKey);
      
      if (isValidCredentials) {
        localStorage.setItem("aws_access_key", accessKey);
        localStorage.setItem("aws_secret_key", secretKey);
        navigate(redirectTo); // Redirect based on previous page
      } else {
        setError("Invalid AWS credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while verifying credentials.");
    }
  };

  const validateAWSCredentials = async (accessKey, secretKey) => {
    // Replace with a real backend API call to validate the AWS credentials
    try {
      const response = await fetch("/api/validate-aws-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKey, secretKey }),
      });
      const data = await response.json();
      return data.isValid; // Assuming the backend returns { isValid: true } or { isValid: false }
    } catch (err) {
      console.error("Error validating credentials:", err);
      return false;
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

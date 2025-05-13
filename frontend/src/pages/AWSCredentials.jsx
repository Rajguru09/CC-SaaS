import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AWSCredentials() {
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);  // Added loading state
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || "/dashboard";

  // Basic AWS Access Key and Secret Key format validation (optional)
  const validateAWSCredentialsFormat = (accessKey, secretKey) => {
    const accessKeyPattern = /^AKIA[0-9A-Z]{16}$/; // Simple regex for AWS Access Key
    const secretKeyPattern = /^[0-9a-zA-Z+/=]{40}$/; // Simple regex for AWS Secret Key
    return accessKeyPattern.test(accessKey) && secretKeyPattern.test(secretKey);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the AWS keys are entered and follow the expected format
    if (!accessKey || !secretKey) {
      setError("Both AWS Access Key and Secret Key are required.");
      return;
    }

    if (!validateAWSCredentialsFormat(accessKey, secretKey)) {
      setError("Invalid AWS Access Key or Secret Key format.");
      return;
    }

    setLoading(true);  // Set loading to true before API call

    try {
      const isValidCredentials = await validateAWSCredentials(accessKey, secretKey);

      if (isValidCredentials) {
        localStorage.setItem("aws_access_key", accessKey);
        localStorage.setItem("aws_secret_key", secretKey);
        navigate(redirectTo);
      } else {
        setError("Invalid AWS credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while verifying credentials. Please try again.");
    } finally {
      setLoading(false);  // Set loading to false after API call
    }
  };

  const validateAWSCredentials = async (accessKey, secretKey) => {
    try {
      const response = await fetch("/api/validate-aws-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKey, secretKey }),
      });
      const data = await response.json();
      return data.isValid;
    } catch (err) {
      console.error("Error validating credentials:", err);
      return false;
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <div className="bg-blue-100 p-6 rounded-lg shadow mb-6 text-center">
        <h1 className="text-2xl font-bold text-blue-800 mb-1">Welcome to Tech Solution</h1>
        <p className="text-gray-700">Securely connect your AWS account</p>
      </div>

      {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 shadow-md">
        <label className="block mb-2 font-medium text-gray-700">AWS Access Key</label>
        <input
          className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="Enter your AWS Access Key"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium text-gray-700">AWS Secret Key</label>
        <input
          className="border p-2 w-full mb-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="password"
          placeholder="Enter your AWS Secret Key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 w-full rounded"
          disabled={loading}  // Disable button while loading
        >
          {loading ? "Connecting..." : "Connect"}
        </button>
      </form>
    </div>
  );
}

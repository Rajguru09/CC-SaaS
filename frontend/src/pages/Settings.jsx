//frontend/src/pages/Settings.jsx
import { useState } from "react";  // Importing useState
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // State to manage errors
  const [successMessage, setSuccessMessage] = useState(null);  // State to manage success messages

  const handleLogout = () => {
    localStorage.removeItem('access_token');  // Make sure token key is consistent across your app
    navigate("/");  // Redirect to the login page
  };

  const handleDownloadReports = () => {
    setLoading(true);  // Start loading
    setError(null);  // Clear previous errors
    setSuccessMessage(null);  // Clear previous success messages

    // Here you can later implement actual report download functionality
    try {
      // Simulate downloading process
      setTimeout(() => {
        setLoading(false);  // End loading
        setSuccessMessage("Reports downloaded successfully!");
      }, 2000);  // Simulated delay for download
    } catch (err) {
      setLoading(false);  // End loading
      setError("An error occurred while downloading reports. Please try again later.");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-4">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 rounded">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded">
            {error}
          </div>
        )}

        {/* Download Reports Button */}
        <button
          onClick={handleDownloadReports}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}  // Disable button while loading
        >
          {loading ? "Downloading..." : "Download Reports"}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

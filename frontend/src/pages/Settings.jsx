//frontend/src/pages/Settings.jsx
import { useState } from "react";  // Importing useState
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove token from local storage
    navigate("/");  // Redirect to the login page
  };

  const handleDownloadReports = () => {
    setLoading(true);  // Start loading
    // Here you can later implement actual report download functionality
    alert("Download Reports functionality coming soon!");
    setLoading(false);  // End loading
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-4">
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

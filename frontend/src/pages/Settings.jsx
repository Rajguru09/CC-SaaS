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

  const handleDownloadReports = async () => {
    setLoading(true);  // Start loading
    setError(null);  // Clear previous errors
    setSuccessMessage(null);  // Clear previous success messages

    try {
      // Replace this URL with the actual endpoint to fetch the report
      const response = await fetch('/api/download-reports', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,  // Add token in headers
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download reports');
      }

      // Convert the response to a Blob (binary data)
      const blob = await response.blob();

      // Create a URL for the Blob and trigger a download
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'reports.zip';  // You can change the filename or format accordingly
      a.click();

      setLoading(false);  // End loading
      setSuccessMessage("Reports downloaded successfully!");  // Show success message
    } catch (err) {
      setLoading(false);  // End loading
      setError("An error occurred while downloading reports. Please try again later.");  // Show error message
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

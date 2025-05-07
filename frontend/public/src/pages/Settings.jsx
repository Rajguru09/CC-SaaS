import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/");  // Use react-router navigate for redirect
  };

  const handleDownloadReports = () => {
    setLoading(true);  // Start loading
    alert("Download Reports functionality coming soon!");
    setLoading(false);  // End loading
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-4">
        <button
          onClick={handleDownloadReports}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}  // Disable the button while loading
        >
          {loading ? "Downloading..." : "Download Reports"}
        </button>
        <br />
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

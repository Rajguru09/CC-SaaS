export default function Settings() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = "/";
  };

  const handleDownloadReports = () => {
    alert("Download Reports functionality coming soon!");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-4">
        <button
          onClick={handleDownloadReports}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download Reports
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

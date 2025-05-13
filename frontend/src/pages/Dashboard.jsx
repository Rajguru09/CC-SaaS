// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDashboard } from "../components/services/api";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const data = await getUserDashboard(token);
        setUserData(data);
      } catch (err) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleServiceClick = (service) => {
    const redirectTo = service === "idle" ? "/idle-resources" : "/cloud-audit";
    navigate("/aws-credentials", { state: { redirectTo } });
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="bg-blue-100 p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-blue-800 text-center mb-2">Welcome to Tech Solution</h1>
        <p className="text-center text-gray-700">Choose your service</p>
      </div>

      {/* Services */}
      <div className="mt-10 grid gap-6">
        {userData?.services?.includes("idle") && (
          <button
            onClick={() => handleServiceClick("idle")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-lg shadow-md w-full"
            aria-label="Manage Cloud Idle Resources"
          >
            Cloud Idle Resources
          </button>
        )}

        {userData?.services?.includes("audit") && (
          <button
            onClick={() => handleServiceClick("audit")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded text-lg shadow-md w-full"
            aria-label="Manage Cloud Audit Accountability"
          >
            Cloud Audit Accountability
          </button>
        )}
      </div>

      {/* User Info (optional) */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">User Info:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {JSON.stringify(userData, null, 2)}
        </pre>
      </div>
    </div>
  );
}

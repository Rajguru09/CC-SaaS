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
      const token = localStorage.getItem("access_token");

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
    const redirectTo =
      service === "idle" ? "/idle-resources" : "/cloud-audit";

    navigate("/aws-credentials", {
      state: { redirectTo },
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to CleanCloud Dashboard</h1>
      <p className="mt-2">Your secure AWS cleanup assistant</p>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">User Data:</h2>
        <pre className="mt-2 bg-gray-100 p-4 rounded">{JSON.stringify(userData, null, 2)}</pre>
      </div>

      {/* AWS Options */}
      <div className="mt-8 space-y-4">
        <button
          onClick={() => handleServiceClick("idle")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
        >
          Cloud Idle Resources
        </button>

        <button
          onClick={() => handleServiceClick("audit")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full"
        >
          Cloud Audit Accountability
        </button>
      </div>
    </div>
  );
}

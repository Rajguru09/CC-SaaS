//#frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { getUserDashboard } from "../components/services/api"; // Ensure this function exists in your api.js

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("access_token"); // Retrieve the correct token key

      if (!token) {
        // Redirect to login if token doesn't exist using navigate()
        navigate("/login");
        return;
      }

      try {
        const data = await getUserDashboard(token);
        setUserData(data); // Assuming this is the structure of the response
      } catch (err) {
        // Handling error and displaying actual message
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]); // Add navigate to dependency array

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to CleanCloud Dashboard</h1>
      <p className="mt-2">Your secure AWS cleanup assistant</p>

      {/* Example of showing user data */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">User Data:</h2>
        <pre className="mt-2 bg-gray-100 p-4 rounded">{JSON.stringify(userData, null, 2)}</pre>
      </div>

      {/* Example of adding some action */}
      <div className="mt-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Clean AWS Resources
        </button>
      </div>
    </div>
  );
}

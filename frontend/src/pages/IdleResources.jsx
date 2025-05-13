import { useState, useEffect } from "react";
import { getIdleResources, deleteResource, retainResource } from "../components/services/api";  // Assume these functions interact with the backend API
import { useNavigate } from "react-router-dom";

export default function IdleResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // Track action-specific loading state
  const navigate = useNavigate();

  // Fetch idle resources on component mount
  useEffect(() => {
    const fetchIdleResources = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const data = await getIdleResources(token); // Call backend API to get idle resources
        setResources(data);
      } catch (err) {
        setError("Failed to fetch idle resources");
      } finally {
        setLoading(false);
      }
    };

    fetchIdleResources();
  }, [navigate]);

  const handleAction = async (resourceId, action) => {
    setActionLoading(resourceId); // Set loading state for this specific resource action

    try {
      if (action === "delete") {
        await deleteResource(resourceId); // Call delete API
        setResources((prevResources) => prevResources.filter((resource) => resource.id !== resourceId));
        alert(`Resource ${resourceId} deleted successfully.`);
      } else if (action === "retain") {
        await retainResource(resourceId); // Call retain API
        alert(`Resource ${resourceId} retained.`);
      }
    } catch (err) {
      alert(`Failed to ${action} resource ${resourceId}: ${err.message}`);
    } finally {
      setActionLoading(null); // Reset loading state after action is complete
    }
  };

  if (loading) return <div>Loading idle resources...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Cloud Idle Resources</h1>
      <p className="text-gray-600 mt-4">Scan and manage your AWS idle resources.</p>

      {/* List Idle Resources */}
      <div className="mt-6 space-y-4">
        {resources.length === 0 ? (
          <p>No idle resources found.</p>
        ) : (
          resources.map((resource) => (
            <div key={resource.id} className="bg-white p-4 rounded shadow-md">
              <h3 className="font-semibold">{resource.name}</h3>
              <p className="text-gray-600">Type: {resource.type}</p>
              <p className="text-gray-600">Status: {resource.status}</p>
              
              {/* Actions */}
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleAction(resource.id, "delete")}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                  disabled={actionLoading === resource.id} // Disable while action is in progress
                >
                  {actionLoading === resource.id ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => handleAction(resource.id, "retain")}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  disabled={actionLoading === resource.id} // Disable while action is in progress
                >
                  {actionLoading === resource.id ? "Retaining..." : "Retain"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

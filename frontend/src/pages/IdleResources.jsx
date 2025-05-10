import { useState, useEffect } from "react";
import { getIdleResources } from "../components/services/api";  // Assume this function fetches idle resources
import { useNavigate } from "react-router-dom";

export default function IdleResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleAction = (resourceId, action) => {
    // Define what happens when the user takes action on a resource (Delete or Retain)
    if (action === "delete") {
      // Perform delete action for the resource (API call)
      alert(`Resource ${resourceId} will be deleted.`);
    } else if (action === "retain") {
      // Perform retain action for the resource (API call)
      alert(`Resource ${resourceId} will be retained.`);
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
                >
                  Delete
                </button>
                <button
                  onClick={() => handleAction(resource.id, "retain")}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Retain
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { getCloudAuditData } from "../components/services/api";  // Assume an API service that fetches audit data

export default function CloudAudit() {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const data = await getCloudAuditData();  // Fetch cloud audit data from backend
        setAuditData(data);
      } catch (err) {
        setError("Failed to load audit data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
  }, []);

  if (loading) {
    return <div>Loading audit data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Cloud Audit Accountability</h1>
      <p className="text-gray-600 mt-4">Here are the recent audit logs:</p>

      <div className="mt-4">
        {auditData.length === 0 ? (
          <p>No audit data found.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Audit ID</th>
                <th className="border px-4 py-2">Resource</th>
                <th className="border px-4 py-2">Action</th>
                <th className="border px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditData.map((audit) => (
                <tr key={audit.id}>
                  <td className="border px-4 py-2">{audit.id}</td>
                  <td className="border px-4 py-2">{audit.resource}</td>
                  <td className="border px-4 py-2">{audit.action}</td>
                  <td className="border px-4 py-2">{audit.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

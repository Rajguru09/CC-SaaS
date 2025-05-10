import { useState, useEffect } from "react";
import { getCloudAuditData } from "../components/services/api";

export default function CloudAudit() {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const data = await getCloudAuditData();
        setAuditData(data);
      } catch (err) {
        setError("⚠️ Failed to load audit data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-blue-600 font-semibold">
        Loading audit data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-blue-100 p-4 rounded-md shadow mb-6 text-center">
        <h1 className="text-2xl font-bold text-blue-800">Cloud Audit Accountability</h1>
        <p className="text-gray-700 mt-1">Here are the recent cloud audit logs.</p>
      </div>

      {auditData.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No audit data found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse shadow rounded-md">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="border px-4 py-2 text-left">Audit ID</th>
                <th className="border px-4 py-2 text-left">Resource</th>
                <th className="border px-4 py-2 text-left">Action</th>
                <th className="border px-4 py-2 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditData.map((audit, idx) => (
                <tr key={audit.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border px-4 py-2">{audit.id}</td>
                  <td className="border px-4 py-2">{audit.resource}</td>
                  <td className="border px-4 py-2">{audit.action}</td>
                  <td className="border px-4 py-2">
                    {new Date(audit.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

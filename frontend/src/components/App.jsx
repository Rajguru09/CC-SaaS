// frontend/src/components/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";

// Protected route component
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("auth_token"); // Check if user is authenticated
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  const [loading, setLoading] = React.useState(true);

  // Simulating a loading state (e.g., data fetching, auth check)
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate loading for 1 second
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or message
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
        
        {/* Optional catch-all route for 404 */}
        <Route path="*" element={<h2>Oops! 404 - Page Not Found <a href="/login">Go to Login</a></h2>} />
      </Routes>
    </Router>
  );
}

export default App;

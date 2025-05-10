import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import jwtDecode from 'jwt-decode'; // For decoding JWT token

// Protected route component with token expiry check
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("access_token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const isExpired = decodedToken.exp * 1000 < Date.now(); // JWT expiration time is in seconds, convert to milliseconds

    if (isExpired) {
      localStorage.removeItem("access_token"); // Remove expired token
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } catch (error) {
    localStorage.removeItem("access_token"); // Remove invalid token
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

function App() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate loading for 1 second
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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
        
        <Route path="*" element={<h2>Oops! 404 - Page Not Found <a href="/login">Go to Login</a></h2>} />
      </Routes>
    </Router>
  );
}

export default App;

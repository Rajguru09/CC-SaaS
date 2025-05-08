//#frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App"; // Import your App component
import "./index.css"; // Import your global CSS

// Create a root element using React 18+ feature
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component inside the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

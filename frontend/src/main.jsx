import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App"; // Import your App component
import "./index.css"; // Import your global CSS

// Optional ErrorBoundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate an error has occurred
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by Error Boundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI in case of error
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

// Create a root element using React 18+ feature
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component inside the root element
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

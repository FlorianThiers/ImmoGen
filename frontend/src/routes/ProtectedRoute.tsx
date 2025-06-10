import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, loading }: { children: React.ReactNode, loading?: boolean }) => {
  const token = localStorage.getItem("token");
  if (loading) {
    // Je kunt hier ook een spinner tonen
    return null;
  }
  if (!token || token === "undefined" || token === "null") {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
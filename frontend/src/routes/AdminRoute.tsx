import React from "react";
import { Navigate } from "react-router-dom";
import User from "../context/User";

const AdminRoute = ({ children, loading, user }: { children: React.ReactNode, loading?: boolean, user?: User | null}) => {
    const token = localStorage.getItem("token");

    if (loading) {
        // You can show a spinner here
        return null;
    }
    if (!token || token === "undefined" || token === "null") {
        return <Navigate to="/login" replace />;
    }
    if (!user?.is_admin) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

export default AdminRoute;
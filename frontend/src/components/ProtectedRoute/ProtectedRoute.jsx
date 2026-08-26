import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

    // URL se token aur role lo
    const params = new URLSearchParams(window.location.search);

    const urlToken = params.get("token");
    const urlRole = params.get("role");

    // Agar login ke baad token URL me aaya hai
    if (urlToken && urlRole) {

        localStorage.setItem("token", urlToken);
        localStorage.setItem("role", urlRole);

        // URL ko clean karo
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );
    }

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
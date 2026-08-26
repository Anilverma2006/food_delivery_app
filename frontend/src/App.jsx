import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "./context/StoreContext";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Card from "./pages/Card/Card";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Verify from "./pages/verify/verify";
import MyOrders from "./pages/MyOrders/MyOrders";

import Orders from "./pages/Orders/Orders";
import List from "./pages/List/List";
import Add from "./pages/Add/Add";

import { ToastContainer } from "react-toastify";

const App = () => {
    const [showLogin, setShowLogin] = useState(false);

    const {
        token,
        role,
        authLoading,
        authChecked,
        url
    } = useContext(StoreContext);

    useEffect(() => {
        if (!authLoading && authChecked && !token) {
            const loginRequired =
                sessionStorage.getItem("loginRequired");

            if (loginRequired === "true") {
                setShowLogin(true);

                sessionStorage.removeItem(
                    "loginRequired"
                );
            }
        }
    }, [authLoading, authChecked, token]);

    const isAdmin = role === "admin";

    return (
        <>
            <ToastContainer />

            {showLogin && (
                <LoginPopup
                    setShowLogin={setShowLogin}
                />
            )}

            <div className="app">

                {/* NORMAL USER NAVBAR */}
                {!isAdmin && (
                    <Navbar
                        setShowLogin={setShowLogin}
                    />
                )}

                {/* ADMIN SIDEBAR */}
                {isAdmin && (
                    <>
                        <hr />
                        <Sidebar />
                    </>
                )}

                <Routes>

                    {/* ========================= */}
                    {/* NORMAL USER ROUTES */}
                    {/* ========================= */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/card"
                        element={<Card />}
                    />

                    <Route
                        path="/order"
                        element={<PlaceOrder />}
                    />

                    <Route
                        path="/verify"
                        element={<Verify />}
                    />

                    <Route
                        path="/myorders"
                        element={<MyOrders />}
                    />

                    {/* ========================= */}
                    {/* ADMIN ROUTES */}
                    {/* ========================= */}

                    <Route
                        path="/add"
                        element={
                            <ProtectedRoute>
                                <Add url={url} />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/list"
                        element={
                            <ProtectedRoute>
                                <List url={url} />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <Orders url={url} />
                            </ProtectedRoute>
                        }
                    />

                </Routes>
            </div>

            {/* USER FOOTER ONLY */}
            {!isAdmin && <Footer />}
        </>
    );
};

export default App;
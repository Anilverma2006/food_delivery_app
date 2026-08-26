import "./app.css";

import React, { useContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { StoreContext } from "./context/StoreContext";

import Navbar from "./components/Navbar/navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Home from "./pages/Home/Home";
import Card from "./pages/Card/Card";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Verify from "./pages/verify/verify";
import MyOrders from "./pages/MyOrders/MyOrders";

import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  const { role, url } = useContext(StoreContext);

  const isAdmin = role === "admin";

  return (
    <>
      <ToastContainer />

      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <div className="app">
        <Navbar setShowLogin={setShowLogin} />

        {isAdmin ? (
          <div className="admin-layout">
            <Sidebar />

            <main className="admin-content">
              <Routes>
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
            </main>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/card" element={<Card />} />
            <Route path="/order" element={<PlaceOrder />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/myorders" element={<MyOrders />} />
          </Routes>
        )}
      </div>

      {!isAdmin && <Footer />}
    </>
  );
};

export default App;

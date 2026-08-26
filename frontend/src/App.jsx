import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes, useSearchParams } from "react-router-dom";
import Home from "./pages/Home/Home";
import Card from "./pages/Card/Card";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Verify from "./pages/verify/verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import ProtectedRoute from "../../admin/src/components/ProtectedRoute/ProtectedRoute";
import Orders from "../../admin/src/pages/Orders/Orders";
import List from "../../admin/src/pages/List/List";
import Add from "../../admin/src/pages/Add/Add";
import { Sidebar } from "lucide-react";
import { ToastContainer } from "react-toastify";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [searchParams] = useSearchParams();
  const url = import.meta.env.VITE_BACKEND_URL;
  console.log(url);
  const role = searchParams.get("role");
  return (
    <>
      <ToastContainer></ToastContainer>
      <div>
        {showLogin && <LoginPopup setShowLogin={setShowLogin}></LoginPopup>}
        <div className="app">
          <Navbar setShowLogin={setShowLogin} />
          {role === "admin" && <hr />}
          {role === "admin" && <Sidebar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/card" element={<Card />} />
            <Route path="/order" element={<PlaceOrder />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/myorders" element={<MyOrders />}></Route>
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  {" "}
                  <Add url={url} />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/list"
              element={
                <ProtectedRoute>
                  {" "}
                  <List url={url} />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  {" "}
                  <Orders url={url} />{" "}
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        <Footer></Footer>
      </div>
    </>
  );
};

export default App;

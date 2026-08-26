import React from 'react'
import { Navbar } from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import {Routes, Route, Link} from "react-router-dom"
import List from './pages/List/List'
import Add from './pages/Add/Add'
import Orders from './pages/Orders/Orders'
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
// import React, { useEffect } from "react";
// import 'react-toastify/dist/ReactToastify.css'

const App = () => {

  const url = "http://localhost:3000";
  return (
    <div>
      <ToastContainer></ToastContainer>
      <Navbar></Navbar>
      <hr />
      <div className="app-content">
        <Sidebar></Sidebar>
        <Routes>
          <Route path="/add" element={<ProtectedRoute> <Add url={url} /> </ProtectedRoute>}/> 
          <Route path="/list" element={ <ProtectedRoute> <List url={url} /> </ProtectedRoute> } /> 
          <Route path="/orders" element={ <ProtectedRoute> <Orders url={url} /> </ProtectedRoute> } />
        </Routes>
      </div>
    </div>
  )
}

export default App

// import { useEffect, useState } from 'react'
// import liff from "@line/liff";
// import axios from "axios";
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
// import { LIFF_ID } from './config/liff';

import { Routes, Route } from "react-router-dom";
import Login from "./pages-user/Login";
import Register from "./pages-user/Register";
import CreateTicket from "./pages-user/CreateTicket";

import Dashboard from "./pages-admin/Dashboard";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/home" element={<CreateTicket />} />

      <Route path="dashboard" element={<Dashboard />} />

    </Routes>
  );
}


export default App;
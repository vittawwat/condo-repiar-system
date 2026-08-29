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
import ReschedulePage from "./pages-user/RequestReschedule"

import Dashboard from "./pages-admin/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import ViewTechnicians from "./pages-admin/Technicians";
import Notifications from "./pages-admin/Notifications";
import Reports from "./pages-admin/Reports";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/create-ticket" element={<CreateTicket />} />

      <Route path="/reschedule/:ticket_id" element={<ReschedulePage />} />

      <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/technicians" element={<ViewTechnicians />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/Reports" element={<Reports />} />
        </Route>

    </Routes>
  );
}


export default App;
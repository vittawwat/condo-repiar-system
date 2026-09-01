// src/layouts/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../pages-admin/Dashboard.css"; // ใช้ CSS เดิมที่มี class .dashboard-layout, .main-content

export default function DashboardLayout() {
    return (
         <div className="dashboard-layout">
             <Sidebar />
            <>
           <div className="dashboard-page-scroll">
                 <Outlet />
            </div>
           </>
         </div>
     );
}
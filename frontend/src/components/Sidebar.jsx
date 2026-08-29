// src/components/Sidebar.jsx
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Sidebar.css"
export default function Sidebar() {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get("/api/notifications/count");
        setNotificationCount(res.data.count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCount();
    // const interval = setInterval(fetchCount, 30000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <aside className="sidebar">

      <div className="sidebar-top">
        <div className="logo-tag">JURISTIC</div>

        <h2 className="sidebar-title">นิติบุคคล</h2>

        <p className="sidebar-subtitle">
          ชื่อคอนโดที่ใช้งาน
        </p>

        <div className="menu-group">
          <p className="menu-label">หลัก</p>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            แดชบอร์ด
          </NavLink>

          <div className="menu-item">รายการแจ้งซ่อม</div>
          <div className="menu-item">ประวัติงาน</div>
        </div>

        <div className="menu-group">
          <p className="menu-label">จัดการ</p>

          <NavLink
            to="/technicians"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            ทีมช่างซ่อม
          </NavLink>

          {/* <div className="menu-item">รายงาน</div> */}
          <NavLink
            to="/Reports"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            รายงาน
          </NavLink>

          
          {/* <div className="menu-item">การแจ้งเตือน</div> */}
          <NavLink
            to="/Notifications"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <span>การแจ้งเตือน</span>
            {notificationCount > 0 && (
              <span className="menu-badge">{notificationCount}</span>
            )}
          </NavLink>
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="avatar" />

        <div>
          <p className="user-name">ชื่อผู้ใช้</p>
          <p className="user-role">เจ้าหน้าที่นิติบุคคล</p>
        </div>
      </div>

    </aside>
  );
}
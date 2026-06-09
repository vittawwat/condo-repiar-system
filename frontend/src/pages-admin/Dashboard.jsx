import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import TicketModalDetail from "../components/TicketModalDetail";
export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [alltickets, setAllTicket] = useState([])
  const [ticket_ById, setTicke_ById] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const getTickets = async () => {
      try {
        const response = await axios.get(
          "/api/tickets"
        );
        console.log("setTickets", response.data.tickets);

        setTickets(response.data.tickets);
        setAllTicket(response.data.tickets);

      } catch (error) {
        console.error("โหลดข้อมูลไม่สำเร็จ:", error);
      }
    };

    getTickets();
  }, []);

  async function getTicketById(ticket_id) {

    // const id = ticket_id
    try {
      const respone = await axios.get(
        `/api/tickets/${ticket_id}`
      )

      console.log("getTicketById", respone.data);
      console.log("getTicketById_images", respone.data.ticket.before_images);
      setTicke_ById(respone.data)
      setShowModal(true)

    } catch (error) {
      console.log("getTicketById", error.message)
    }
  }

  // const countPending = tickets.filter(ticket => ticket.status === "pending").length
  // console.log("countPending", countPending);

  const countByStatus = (status) => {
    return alltickets.filter(ticket => ticket.status === status).length
  }

  const countPending = countByStatus("pending")
  const countAcknowledged = countByStatus("acknowledged")
  const countInProgress = countByStatus("in_progress")
  const countCompleted = countByStatus("completed")


  function checkCategory(category) {
    const map = {
      plumbing: "ประปา",
      electric: "ไฟฟ้า",
      aircon: "แอร์",
      other: "อื่นๆ"
    }

    return map[category]
  }
  function checkStatus(status) {
    const map = {
      pending: "กำลังรอการรับเรื่่อง",
      acknowledged: "รับเรื่องแล้ว",
      in_progress: "กำลังดำเนินการ",
      completed: "เสร็จสิ้น",
      cancelled: "ยกเลิก"
    }
    return map[status]
  }

  const fetchTickets = async (status) => {
    try {

      const response = await axios.get(
        "/api/tickets", {
        params: {
          status: status
        }
      }
      )

      console.log("filter", response.data)

      setTickets(response.data.tickets)

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="dashboard-layout">

      {/* sidebar */}
      <aside className="sidebar">

        <div className="sidebar-top">
          <div className="logo-tag">JURISTIC</div>

          <h2 className="sidebar-title">นิติบุคคล</h2>

          <p className="sidebar-subtitle">
            ชื่อคอนโดที่ใช้งาน
          </p>

          <div className="menu-group">
            <p className="menu-label">หลัก</p>

            <div className="menu-item active">แดชบอร์ด</div>
            <div className="menu-item">รายการแจ้งซ่อม</div>
            <div className="menu-item">ประวัติงาน</div>
          </div>

          <div className="menu-group">
            <p className="menu-label">จัดการ</p>

            <div className="menu-item">ทีมช่างซ่อม</div>
            <div className="menu-item">รายงาน</div>
            <div className="menu-item">การแจ้งเตือน</div>
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

      {/* content */}
      <main className="main-content">

        <div className="page-header">
          <h1>แดชบอร์ด</h1>
          <p>วันที่</p>
        </div>

        {/* cards */}
        <div className="stats-grid">
          <div className="stat-card">รอการดำเนินการ
            <h1>{countPending}</h1>
          </div>
          <div className="stat-card">รับเรื่อง
            <h1>{countAcknowledged}</h1>
          </div>
          <div className="stat-card">กำลังดำเนินการ
            <h1>{countInProgress}</h1>
          </div>
          <div className="stat-card">เสร็จสิ้น
            <h1>{countCompleted}</h1>
          </div>
        </div>

        {/* filter */}
        <div className="filter-bar">
          <button onClick={() => fetchTickets()}>
            ทั้งหมด
          </button>

          <button onClick={() => fetchTickets("pending")}>
            Pending
          </button>

          <button onClick={() => fetchTickets("acknowledged")}>
            Acknowledged
          </button>
          <button onClick={() => fetchTickets("in_progress")}>
            In Progress
          </button>
          <button onClick={() => fetchTickets("completed")}>
            Completed
          </button>
          <button onClick={() => fetchTickets("cancelled")}>
            Cancelled
          </button>
        </div>

        {/* table */}
        <div className="table-section">

          <table className="ticket-table">

            <thead>
              <tr>
                <th>เลขงาน</th>
                <th>ห้อง</th>
                <th>ประเภท</th>
                <th>หัวข้อ</th>
                <th>สถานะ</th>
                <th>วันที่</th>
                <th>ดำเนินงาน</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => {
                // console.log("ticket =", ticket);
                // console.log("key =", ticket.ticket_id);

                return (
                  <tr key={ticket.ticket_id}>
                    <td>{ticket.ticket_id}</td>
                    <td>{ticket.room_number}</td>
                    <td>{checkCategory(ticket.category)}</td>
                    <td>{ticket.title}</td>
                    <td>{checkStatus(ticket.status)}</td>
                    <td>
                      {new Date(ticket.created_at).toLocaleDateString("th-TH")}
                    </td>
                    <td>
                      <button onClick={() => getTicketById(ticket.ticket_id)} > ดูรายระเอียด</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        </div>

      </main>
      {/* วางไว้ก่อน closing div ของ dashboard-layout */}

      {showModal && ticket_ById && (
        <TicketModalDetail
          ticketData={ticket_ById}
          onClose={() => setShowModal(false)}
          test="test"
          isOn
        />
      )}
    </div>
  );
}
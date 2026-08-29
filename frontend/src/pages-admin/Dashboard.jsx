import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import TicketModalDetail from "../components/TicketModalDetail";
import DateDropdown from '../components/DateDropdown';
import {
  checkCategory,
  checkStatus,
  countByStatus,
  formatTicketNumber,
  nextStatus,
  formatDateTime,
  formatDateOnly
} from "../utils/ticketUtils";
// import Sidebar from "../components/Sidebar";



export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [alltickets, setAllTicket] = useState([])
  const [ticket_ById, setTicke_ById] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all');

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

  useEffect(() => {
    getTickets();
  }, []);

  async function getTicketById(ticket_id) {

    // const id = ticket_id
    try {
      const respone = await axios.get(
        `/api/tickets/${ticket_id}`
      )

      setTicke_ById(respone.data.ticket)
      setShowModal(true)

    } catch (error) {
      console.log("getTicketById", error.message)
    }
  }

  const countPending = countByStatus(alltickets, "pending")
  const countAcknowledged = countByStatus(alltickets, "acknowledged")
  const countInProgress = countByStatus(alltickets, "in_progress")
  const countCompleted = countByStatus(alltickets, "completed")

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

  const handleDateSearch = async ({ startDate, endDate }) => {
  try {
    
    const response = await axios.get('/api/tickets/search', {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });

    console.log(response.data);

    setTickets(response.data.data || []); // <-- ตรงนี้สำคัญ
    setActiveFilter('all');

  } catch (error) {
    console.log(error);
    setTickets([]); // กัน error เพิ่มเติม
  }
};
  return (
    <>
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

          <button
            className={activeFilter === 'all' ? 'active' : ''}
            onClick={() => {
              setActiveFilter('all');
              fetchTickets();
            }}
          >
            ทั้งหมด
          </button>

          <button
            className={activeFilter === 'pending' ? 'active' : ''}
            onClick={() => {
              setActiveFilter('pending');
              fetchTickets('pending');
            }}
          >
            รอการดำเนินการ
          </button>

          <button
            className={activeFilter === 'acknowledged' ? 'active' : ''}
            onClick={() => {
              setActiveFilter('acknowledged');
              fetchTickets('acknowledged');
            }}
          >
            รับเรื่อง
          </button>

          <button
            className={activeFilter === 'in_progress' ? 'active' : ''}
            onClick={() => {
              setActiveFilter('in_progress');
              fetchTickets('in_progress');
            }}
          >
            กำลังดำเนินการ
          </button>

          <button
            className={activeFilter === 'completed' ? 'active' : ''}
            onClick={() => {
              setActiveFilter('completed');
              fetchTickets('completed');
            }}
          >
            เสร็จสิ้น
          </button>

          <button
            className={activeFilter === 'cancelled' ? 'active' : ''}
            onClick={() => {
              setActiveFilter('cancelled');
              fetchTickets('cancelled');
            }}
          >
            ยกเลิก
          </button>

        </div>

        {/* search Date*/}
        <DateDropdown
          onSearch={handleDateSearch}
          onReset={() => {
            setActiveFilter('all');
            getTickets();
          }}
        />

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
                <th>วันที่แจ้งซ่อม</th>
                <th>ดำเนินงาน</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => {
                return (
                  <tr key={ticket.ticket_id}>
                    <td>{formatTicketNumber(ticket.ticket_id)}</td>
                    <td>{ticket.room_number}</td>
                    <td>{checkCategory(ticket.category)}</td>
                    <td>{ticket.title}</td>
                    <td>
                      <span className={`status-badge status-${ticket.status}`}>
                        {checkStatus(ticket.status)}
                      </span>
                    </td>
                    <td>
                      {formatDateOnly(ticket.created_at)}
                      {/* {new Date(ticket.created_at).toLocaleDateString("th-TH")} */}
                    </td>

                    <td>
                      <button
                        className="action-btn"
                        onClick={() => getTicketById(ticket.ticket_id)}
                      >
                        {nextStatus(ticket.status)}
                      </button>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>

        </div>

      </main>
      {/* ส่วนของการดำเนินการ */}
      {showModal && ticket_ById && (
        <TicketModalDetail
          ticketData={ticket_ById}
          onClose={() => setShowModal(false)}
          onSuccess={getTickets}
        />
      )}
    </>
  );
}
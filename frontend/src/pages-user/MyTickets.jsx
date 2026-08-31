import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { checkCategory, checkStatus, formatTicketNumber, formatDateTime } from "../utils/ticketUtils";
import "./MyTickets.css";

export default function MyTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("กรุณา login");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/tickets/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTickets(res.data.tickets || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "โหลดรายการแจ้งซ่อมไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

    console.log(tickets);
  return (
    <div className="my-tickets-page">
      <div className="my-tickets-header">
        <h1>🛠 รายการแจ้งซ่อมของฉัน</h1>
      </div>

      {loading && <p className="my-tickets-info">กำลังโหลด...</p>}
      {!loading && error && <p className="my-tickets-info my-tickets-error">{error}</p>}
      {!loading && !error && tickets.length === 0 && (
        <p className="my-tickets-info">ยังไม่มีรายการแจ้งซ่อม</p>
      )}

      <div className="my-tickets-list">
        {tickets.map((t) => (
          <div
            key={t.ticket_id}
            className="my-ticket-card"
            onClick={() => navigate(`/my-tickets/${t.ticket_id}`)}
          >
            <div className="my-ticket-card-top">
              <span className="my-ticket-number">{formatTicketNumber(t.ticket_id)}</span>
              <span className={`my-ticket-status status-${t.status}`}>
                {checkStatus(t.status)}
              </span>
            </div>

            <p className="my-ticket-title">{t.title}</p>

            <div className="my-ticket-card-bottom">
              <span>{checkCategory(t.category)}</span>
              <span>{formatDateTime(t.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
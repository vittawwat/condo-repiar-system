import PendingAction from "./ticket-actions/PendingAction";
import AssignAction from "./ticket-actions/AssignAction";
import InProgressAction from './ticket-actions/InProgressAction';
import './TicketModalDetail.css'
import {
  checkStatus,
  formatTicketNumber,
  formatDateTime
} from "../utils/ticketUtils";
function TicketModal({ ticketData, onClose, onSuccess }) {
  console.log(ticketData);

  return (
    <div className="modal-overlay" onClick={onClose}>

      <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="ticket-modal__header">

          <div className="ticket-modal__header-left">
            <span className="ticket-modal__id">
              {formatTicketNumber(ticketData.ticket_id)}
            </span>

            <span className={`ticket-modal__status ticket-modal__status--${ticketData.status}`}>
              {checkStatus(ticketData.status)}
            </span>
          </div>

          <button className="ticket-modal__close" onClick={onClose}>
            ✕
          </button>

        </div>

        {/* Body */}
        <div className="ticket-modal__body">

          <div className="ticket-modal__grid">

            <div className="ticket-card">
              <div className="ticket-card__label">ผู้แจ้ง</div>
              <div className="ticket-card__value">{ticketData.name}</div>
            </div>

            <div className="ticket-card">
              <div className="ticket-card__label">ห้อง</div>
              <div className="ticket-card__value">{ticketData.room}</div>
            </div>

            <div className="ticket-card ticket-card--full">
              <div className="ticket-card__label">หัวข้อ</div>
              <div className="ticket-card__value">{ticketData.title}</div>
            </div>

            <div className="ticket-card ticket-card--full">
              <div className="ticket-card__label">รายละเอียด</div>
              <div className="ticket-card__detail">
                {ticketData.detail}
              </div>
            </div>

          </div>

          {/* Images */}
          {ticketData.before_images?.length > 0 && (
            <div className="ticket-images">

              {ticketData.before_images.map((img, index) => (
                <img
                  key={index}
                  src={`/uploads/tickets/before/${img}`}
                  alt={`รูปที่ ${index + 1}`}
                  className="ticket-image"
                />
              ))}

            </div>
          )}

          {/* Technician */}
          {ticketData.technician_id && (
            <>
              <h1 className="expense-title">รายละเอียดช่างผู้เข้าซ่อม</h1>

              <div className="technician-card">
                <div className="technician-card__left">
                  {ticketData.technician_profile ? (
                    <img
                      src={`/uploads/technicians/${ticketData.technician_profile}`}
                      alt={ticketData.technician_name}
                      className="technician-avatar"
                    />
                  ) : (
                    <div className="technician-avatar technician-avatar--placeholder">
                      ชพ
                    </div>
                  )}
                </div>

                <div className="technician-card__info">
                  <div className="technician-card__name">
                    {ticketData.technician_name}
                  </div>

                  <div className="technician-card__date">
                    นัดหมาย {formatDateTime(ticketData.appointment_date)}
                    {/* นัดหมาย {new Date(ticketData.appointment_date).toLocaleString('th-TH')} */}
                  </div>
                </div>
              </div>
            </>
          )}
          {ticketData.status === 'completed' && (
            <>
              <h1 className="expense-title">รายละเอียดค่าใช้จ่าย</h1>

              <div className="expense-box">
                <p className="expense-cost">
                  ค่าใช้จ่าย: {ticketData.total_cost} บาท
                </p>

                <p className="expense-reason">
                  รายละเอียดการซ่อม: {ticketData.reason}
                </p>
              </div>
            </>
          )}

          {/* Actions */}
          {ticketData.status === 'pending' && (
            <PendingAction
              ticketData={ticketData}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          )}

          {ticketData.status === 'acknowledged' && (
            <AssignAction
              ticketData={ticketData}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          )}

          {ticketData.status === 'in_progress' && (
            <InProgressAction
              ticketData={ticketData}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          )}
        </div>

      </div>

    </div>
  );
}

export default TicketModal
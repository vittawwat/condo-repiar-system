function TicketModal({ ticketData, onClose, test, isOn }) {
  console.log("onClose",onClose);
  console.log("checkprops",test);
  console.log("isOn",isOn);
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        
        {/* header */}
        <div className="modal-header">
          <span>#{ticketData.ticket.ticket_id}</span>
          <button onClick={onClose}>✕</button>
        </div>

        {/* body */}
        <div className="modal-body">
          <div className="modal-row">
            <span className="modal-label">ผู้แจ้ง</span>
            <span>{ticketData.ticket.name}</span>
          </div>

          <div className="modal-row">
            <span className="modal-label">ห้อง</span>
            <span>{ticketData.ticket.room}</span>
          </div>

          <div className="modal-row">
            <span className="modal-label">หัวข้อ</span>
            <span>{ticketData.ticket.title}</span>
          </div>

          <div className="modal-row">
            <span className="modal-label">รายละเอียด</span>
            <span>{ticketData.ticket.detail}</span>
          </div>

          <div className="modal-label">รูปภาพ</div>

          <div className="modal-images">
            {ticketData.ticket.before_images.map((img, index) => (
              <img
                key={index}
                src={`/uploads/${img}`}
                alt={`รูปที่ ${index + 1}`}
                className="modal-img"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketModal
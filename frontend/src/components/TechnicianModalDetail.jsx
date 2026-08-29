import "./TechnicianModalDetail.css"
import {
  checkCategory,
} from "../utils/ticketUtils";
export default function TechnicianModalDetail({technician,onClose}) {
  console.log(technician);
  
  return (
    <div className="modal-overlay" onClick={onClose}>

      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="modal-header">
          <h3>รายละเอียดช่าง</h3>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">

          <div className="profile-section">

            {technician && (
              <img
                src={`/uploads/technicians/${technician.profile_image_url}`}
                alt=""
                className="profile-image"
              />
            ) 
          }

          </div>

          <p>
            <strong>ชื่อ:</strong> {technician.firstname} {technician.lastname}
          </p>

          <p>
            <strong>ตำแหน่งช่าง:</strong> {checkCategory(technician.skill)}
          </p>

          <p>
            <strong>เบอร์โทร:</strong> {technician.phone}
          </p>

          <p>
            <strong>รหัสช่าง:</strong> {technician.technician_id}
          </p>

        </div>

      </div>

    </div>
  );
}
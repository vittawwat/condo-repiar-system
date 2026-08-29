import { useEffect, useState } from "react";
import axios from "axios";
import './AssignAction.css'
import DateTimePicker from "../DateTimePicker";
export default function AssignAction({ ticketData, onSuccess, onClose, }) {

    const [technicians, setTechnicians] = useState([]);
    const [technicianId, setTechnicianId] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");

    useEffect(() => {
        async function fetchTechnicians() {

            try {
                const response = await axios.get("/api/technician");
                setTechnicians(response.data.Alltechnicians);
            } catch (error) {
                console.error(error);
            }

        }
        fetchTechnicians();
    }, []);

    const selectedTechnician = technicians.find(
        (tech) => tech.technician_id === Number(technicianId)

    );


    console.log(selectedTechnician);

    async function handleAssign() {
        if (!technicianId) {
            return alert("กรุณาเลือกช่าง");
        }

        if (!appointmentDate) {
            return alert("กรุณาเลือกวันนัด");
        }

        try {

            await axios.patch(
                `/api/tickets/${ticketData.ticket_id}/assign`,
                {
                    technician_id: Number(technicianId),
                    appointment_date: appointmentDate,
                    status: "in_progress",
                }
            );

            alert("นัดช่างสำเร็จ");

            onSuccess();
            onClose();

        } catch (error) {
            console.error(error.message);
            alert(
                error.response?.data?.message ||
                "นัดช่างไม่สำเร็จ"
            );
        }
    }

    return (
        <div className="assign-form">

            <div className="form-group">
                <label>เลือกช่าง</label>

                <select
                    className="form-select"
                    value={technicianId}
                    onChange={(e) => setTechnicianId(e.target.value)}
                >
                    <option value="">-- เลือกช่าง --</option>

                    {technicians.map((tech) => (
                        <option
                            key={tech.technician_id}
                            value={tech.technician_id}
                        >
                            {tech.firstname} {tech.lastname}
                        </option>
                    ))}
                </select>
            </div>

            {/* แสดงข้อมูลช่าง */}
            {selectedTechnician && (
                <div className="technician-preview">

                    {selectedTechnician.profile_image_url && (
                        <img
                            src={`/uploads/technicians/${selectedTechnician.profile_image_url}`}
                            alt="technician"
                            className="technician-preview__avatar"
                        />
                    )}

                    <div className="technician-preview__info">

                        <div className="technician-preview__name">
                            <strong>ชื่อ-นามสกุล:</strong> {selectedTechnician.firstname} {selectedTechnician.lastname}
                        </div>

                        <p>
                            <strong>เบอร์โทร:</strong> {selectedTechnician.phone}
                        </p>

                        <p>
                            <strong>ความสามารถ:</strong> {selectedTechnician.skill}
                        </p>

                    </div>

                </div>
            )}

            {/* <div className="form-group">
                <label>วันนัดหมาย</label>

                <input
                    className="form-input"
                    type="datetime-local"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                />
            </div> */}

            <DateTimePicker
                value={appointmentDate}
                onChange={setAppointmentDate}
            />
            
            <div className="assign-footer">

                <button
                    type="button"
                    className="cancel-btn"
                    onClick={onClose}
                >
                    ยกเลิก
                </button>

                <button
                    type="button"
                    className="confirm-btn"
                    onClick={handleAssign}
                >
                    ยืนยันนัดช่าง
                </button>

            </div>

        </div>
    );
}
// ตัวอย่างวิธีเรียกใช้ใน Technicians.jsx:
//
// {showModalAddTech && (
//   <AddTechnicianModal
//     onClose={() => setshowModalAddTech(false)}
//     onSuccess={fetchTechnicians}
//   />
// )}

import { useState } from "react";
import axios from "axios";
import "./AddTechnicianModal.css";

export default function AddTechnicianModal({ onClose, onSuccess }) {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone, setPhone] = useState('');
    const [skill, setSkill] = useState('');
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)

    const handleImage = (e) => {

        const file = e.target.files[0]

        console.log(e.target);
        console.log(e.target.files);

        if (!file) return

        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const removeImage = () => {
        URL.revokeObjectURL(preview)  // ← คืน memory กลับ
        setImage(null)
        setPreview(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstname || !lastname || !phone || !skill) {
            alert("กรุณากรอกข้อมูลให้ครบ")
            return
        }

        try {
            const formData = new FormData()
            formData.append("firstname", firstname)
            formData.append("lastname", lastname)
            formData.append("phone", phone)
            formData.append("skill", skill)
            if (image) {
                formData.append("image", image)
            }

            const response = await axios.post("/api/technician", formData);

            console.log("Create-technician success", response.data)

            alert("เพิ่มข้อมูลช่างสำเร็จ")

            onSuccess?.();
            onClose();

        } catch (error) {
            console.log(error)
            alert(error.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่")
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="technician-modal" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="modal-header">
                    <div>
                        <h2>เพิ่มข้อมูลช่าง</h2>
                        <p>กรอกข้อมูลช่างให้ครบก่อนบันทึก</p>
                    </div>

                    <button type="button" className="close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="technician-form">

                    {/* แถวชื่อ-นามสกุล */}
                    <div className="form-group full-width">
                        <label>ชื่อ - นามสกุล</label>

                        <div className="name-row">
                            <input
                                type="text"
                                placeholder="ชื่อ"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="นามสกุล"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* แถวเบอร์-ทักษะ */}
                    <div className="form-row">
                        <div className="info-card">
                            <label>เบอร์โทร</label>
                            <input
                                type="tel"
                                placeholder="0812345678"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="info-card">
                            <label>ความสามารถ / ทักษะ</label>
                            <select value={skill} onChange={(e) => setSkill(e.target.value)}>
                                <option value="">เลือกความสามารถ</option>
                                <option value="electric">⚡ ไฟฟ้า</option>
                                <option value="plumbing">🚿 ประปา</option>
                                <option value="aircon">❄️ แอร์</option>
                                <option value="other">📌 อื่นๆ</option>
                            </select>
                        </div>
                    </div>

                    {/* รูปภาพ */}
                    <div className="info-card image-card">
                        <label>รูปโปรไฟล์ (ไม่บังคับ)</label>

                        <div className="upload-actions">
                            <label className="upload-btn">
                                📷 เลือกรูปภาพ
                                <input type="file" accept="image/*" onChange={handleImage} />
                            </label>
                        </div>

                        {preview && (
                            <div className="preview-container">
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="preview-image"
                                />

                                <button
                                    type="button"
                                    className="preview-delete-btn"
                                    onClick={removeImage}
                                >
                                    x
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ปุ่ม */}
                    <div className="technician-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            ยกเลิก
                        </button>

                        <button type="submit" className="confirm-btn">
                            เพิ่มข้อมูล
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
import { useState } from "react";
import axios from "axios";
import "./CreateTicket.css";

export default function CreateTicket() {
  // const [user, setUser] = useState('');
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     await axios.get("/api/residents/me", {
  //       headers: { 
  //         Authorization: `Bearer ${token}` 
  //       }
  //     })
  //       .then((res) => setUser(res.data.result))
  //       .catch(() => {
  //         localStorage.removeItem('token');
  //         console.log("กรุณา login");
  //       })
  //   }
  //   fetchData();
  // }, [])

  const handleImages = (e) => {

    const newFiles = [...e.target.files]
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))

    // console.log(e);
    console.log(e.target);
    console.log(e.target.files);
    // console.log(newFiles);

    // console.log("newFiles", newFiles);
    // console.log("newPreviews", newPreviews);

    setImages(prev => [...prev, ...newFiles])
    setPreviews(prev => [...prev, ...newPreviews])

  }

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index])  // ← คืน memory กลับ
    setImages(prev => prev.filter((_, i) => i !== index))  // ลบรูปทีละใบ
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("กรุณา login");
      return;
    }

    if (!title || !detail || !category) {
      alert("กรุณากรอกข้อมูลให้ครบ")
      return
    }

    if (images.length < 2) {
      alert("กรุณาอัพโหลดรูปอย่างน้อย 2 รูป")
      return
    }

    try {
      // Step 1 - สร้าง ticket
      const response = await axios.post("api/tickets",
        {
          title,
          detail,
          category
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Create-ticket success", response.data)

      const ticket_id = response.data.ticket_id
      console.log("ticket_id in forntend:", ticket_id)

      // Step 2 - อัพรูป
      const formData = new FormData()
      // formData.append("image_type", "before")
      // formData.append("uploaded_by", "resident")
      // console.log("formData", formData);
      
      for (const image of images) {
        formData.append("images", image)
      }

      await axios.post(`/api/tickets/${ticket_id}/images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("แจ้งซ่อมสำเร็จ")

      clearForm();

    } catch (error) {
      console.log(error)
    }
  }

  const clearForm = () => {
    setTitle("")
    setDetail("")
    setCategory("")
    setImages([])
  }

  return (
    <div className="ticket-page">
      <div className="ticket-card">
        <h1 className="ticket-title">🛠 แจ้งซ่อม</h1>
        <p className="ticket-subtitle">
          กรุณากรอกรายละเอียดปัญหาให้ครบถ้วน
        </p>

        <form onSubmit={handleSubmit} className="ticket-form">

          <div className="form-group">
            <label>หัวข้อ</label>
            <input type="text" placeholder="เช่น ไฟห้องน้ำเสีย" value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>รายละเอียด</label>
            <textarea rows="4" placeholder="อธิบายปัญหาที่พบ..." value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>ประเภท</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">เลือกประเภท</option>
              <option value="electric">⚡ ไฟฟ้า</option>
              <option value="plumbing">🚿 ประปา</option>
              <option value="aircon">❄️ แอร์</option>
              <option value="other">📌 อื่นๆ</option>
            </select>
          </div>

          <div className="ticket-image-section">
            <label className="ticket-image-label">
              รูปภาพ (อย่างน้อย 2 รูป)
            </label>

            <div className="upload-actions">

              <label className="upload-btn">
                ถ่ายรูป
                <input type="file" accept="image/*" capture="environment"
                  onChange={handleImages}
                />
              </label>

              <label className="upload-btn">
                เลือกรูป
                <input type="file" multiple accept="image/*"
                  onChange={handleImages}
                />
              </label>
            </div>

            <div className="preview-grid">
              {images.map((img, i) => (
                < div key={i} className="preview-item" >
                  <img src={previews[i]} alt="" className="preview-image" />

                  <button type="button" onClick={() => removeImage(i)}>×</button>
                </div>
              ))}
            </div>

            <p className="image-count">
              เพิ่มแล้ว {images.length} รูป
            </p>
          </div>

          <button type="submit" className="submit-btn">
            ส่งคำขอแจ้งซ่อม
          </button>
        </form>
      </div >
    </div >
  );
}
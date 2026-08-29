# Sprint 2 Checklist
**ระยะเวลา:** 2 สัปดาห์  
**เป้าหมาย:** แจ้งซ่อม → รับเรื่อง → นัดช่าง → ลูกบ้านยืนยัน

---

## ⚠️ ทำก่อนเริ่ม Sprint
- [x] ขอ LINE Messaging API channel access token
- [x] ทดสอบส่ง Push Message ได้จริงก่อน

---

## สัปดาห์ที่ 1 — Backend + Acknowledged

### 1. API เปลี่ยนสถานะ Acknowledged
- [x] `PATCH /api/tickets/:id/status` รับ body `{ status: "acknowledged" }`
- [x] validate ว่า ticket ต้องเป็น `pending` ก่อนถึงเปลี่ยนได้
- [x] ส่ง LINE Push Message หาลูกบ้าน "นิติรับเรื่องแล้ว กำลังประสานงานช่าง"

### 2. CRUD ทะเบียนช่าง
- [x] `GET /api/technicians` ดึงรายการช่างทั้งหมด
- [x] `POST /api/technicians` เพิ่มช่างใหม่
- [x] `PATCH /api/technicians/:id` แก้ไขข้อมูลช่าง
- [ ] `DELETE /api/technicians/:id` soft delete → เปลี่ยน status เป็น inactive

### 3. Dashboard — ปุ่มรับเรื่อง
- [x] ปุ่ม "รับเรื่อง" เรียก PATCH status acknowledged
- [x] status badge เปลี่ยนสีทันทีหลังกด (optimistic update)


---

## สัปดาห์ที่ 2 — In Progress Phase 1 + LIFF

### 4. API นัดช่าง (In Progress)
- [x] `PATCH /api/tickets/:id/assign` บันทึก technician_id + appointment_date
- [ ] snapshot ชื่อและเบอร์ช่าง ณ เวลานั้นลงใน tickets table
- [x] เปลี่ยน status → `in_progress` อัตโนมัติ
- [x] ส่ง Flex Message หาลูกบ้าน แสดงชื่อช่าง เบอร์ วันนัด เวลานัด
- [x] Flex Message มีปุ่ม"ขอเปลี่ยนวันนัด" และสามารถใช้งานได้จริง
- [x] โชว์ข้อมูลช่าง ชื่อ รูป เบอร์ ในรายระเอียดให้ครบถ้วน

### 5. LIFF —  ขอเปลี่ยนวันนัด
- [x] ปุ่ม "ขอเปลี่ยนวัน" → เปิด LIFF form
  - [x] กรอกวันที่ต้องการใหม่
  - [x] กรอกเวลาที่ต้องการใหม่
  - [x] กรอกหมายเหตุเพิ่มเติม (optional)
- [x] `POST /api/tickets/:id/reschedule` บันทึกคำขอเปลี่ยนวัน
- [x] Dashboard แสดง badge "ขอเปลี่ยนวันนัด" ให้นิติเห็น
- [x] นิติดูวันเดิม วันใหม่ หมายเหตุ แล้วกดอนุมัติได้
- [ ] ระบบส่งวันนัดใหม่ให้ลูกบ้าน 

### 6. Test + Doc
- [ ] อัปเดต API doc ครบทุก endpoint ที่เพิ่มใน Sprint 2
- [ ] ทดสอบ flow ครบ end-to-end: แจ้งซ่อม → รับเรื่อง → นัดช่าง → ลูกบ้านยืนยัน

---

## ✅ Checkpoint Sprint 2
- [ ] demo flow ครบตั้งแต่ต้นจนลูกบ้านยืนยันวันนัดได้จริง
- [ ] LINE Push Message และ Flex Message ส่งได้จริง
- [ ] API doc อัปเดตแล้ว

- ทำ filter เลือกจำนวนวัน กับ หน้า report
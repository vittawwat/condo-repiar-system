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
- [] เขียน Jest + Supertest ครอบ endpoint นี้

### 2. CRUD ทะเบียนช่าง
- [ ] `GET /api/technicians` ดึงรายการช่างทั้งหมด
- [ ] `POST /api/technicians` เพิ่มช่างใหม่
- [ ] `PATCH /api/technicians/:id` แก้ไขข้อมูลช่าง
- [ ] `DELETE /api/technicians/:id` soft delete → เปลี่ยน status เป็น inactive
- [ ] เขียน Jest + Supertest ครอบ endpoint นี้

### 3. Dashboard — ปุ่มรับเรื่อง
- [ ] ปุ่ม "รับเรื่อง" เรียก PATCH status acknowledged
- [ ] status badge เปลี่ยนสีทันทีหลังกด (optimistic update)
- [ ] ปุ่มหายไปหลังกดแล้ว

---

## สัปดาห์ที่ 2 — In Progress Phase 1 + LIFF

### 4. API นัดช่าง (In Progress)
- [ ] `PATCH /api/tickets/:id/assign` บันทึก technician_id + appointment_date
- [ ] snapshot ชื่อและเบอร์ช่าง ณ เวลานั้นลงใน tickets table
- [ ] เปลี่ยน status → `in_progress` อัตโนมัติ
- [ ] ออกแบบ Flex Message ผ่าน LINE Flex Message Simulator ก่อน
- [ ] ส่ง Flex Message หาลูกบ้าน แสดงชื่อช่าง เบอร์ วันนัด เวลานัด
- [ ] Flex Message มีปุ่ม "ยืนยันความสะดวก" และ "ขอเปลี่ยนวันนัด"
- [ ] เขียน Jest + Supertest ครอบ endpoint นี้

### 5. LIFF — ลูกบ้านกดยืนยัน / ขอเปลี่ยนวันนัด
- [ ] ปุ่ม "ยืนยัน" → `POST /api/tickets/:id/confirm` เก็บ decided_at
- [ ] ระบบแจ้งนิติผ่าน Dashboard ว่าลูกบ้านยืนยันแล้ว
- [ ] ปุ่ม "ขอเปลี่ยนวัน" → เปิด LIFF form
  - [ ] กรอกวันที่ต้องการใหม่
  - [ ] กรอกเวลาที่ต้องการใหม่
  - [ ] กรอกหมายเหตุเพิ่มเติม (optional)
- [ ] `POST /api/tickets/:id/reschedule` บันทึกคำขอเปลี่ยนวัน
- [ ] Dashboard แสดง badge "ขอเปลี่ยนวันนัด" ให้นิติเห็น
- [ ] นิติดูวันเดิม วันใหม่ หมายเหตุ แล้วกดอนุมัติได้
- [ ] ระบบส่งวันนัดใหม่ให้ลูกบ้าน + รอยืนยันอีกครั้ง

### 6. Test + Doc
- [ ] อัปเดต API doc ครบทุก endpoint ที่เพิ่มใน Sprint 2
- [ ] ทดสอบ flow ครบ end-to-end: แจ้งซ่อม → รับเรื่อง → นัดช่าง → ลูกบ้านยืนยัน

---

## ✅ Checkpoint Sprint 2
- [ ] demo flow ครบตั้งแต่ต้นจนลูกบ้านยืนยันวันนัดได้จริง
- [ ] LINE Push Message และ Flex Message ส่งได้จริง
- [ ] API doc อัปเดตแล้ว
- [ ] test ผ่านทั้งหมด

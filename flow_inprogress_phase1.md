status: acknowledged
   │
   │  [แอดมิน: เลือกช่าง + ตั้งวันนัด]
   │  POST /:ticket_id/appointment
   │  body: { technician_id, appointment_date, status: "in_progress" }
   ▼
status: in_progress
phase: appointment_scheduled
appointment_status: proposed
   │
   │  ──► push Flex Message แจ้งลูกบ้าน (ช่าง + วันนัด)
   │
   ├──[ลูกบ้าน: กด "ยืนยันความสะดวก"]
   │        PATCH /:ticket_id/appointment/confirm
   │        ▼
   │   appointment_status: confirmed ─► จบ phase 1
   │
   └──[ลูกบ้าน: กด "ขอเปลี่ยนวันนัด"]
            PATCH /:ticket_id/appointment/reschedule-request
            body: { appointment_date, reason }
            │  ──► UPDATE appointment_date ทับทันที (ไม่เก็บ history)
            │  ──► แจ้งแอดมิน พร้อมเหตุผล + เบอร์ลูกบ้าน (ติดต่อตรงได้ถ้าหาวันไม่ลงตัว)
            ▼
       appointment_status: proposed (วนกลับเข้า loop เดิม รอแอดมินตั้งวันใหม่ หรือลูกบ้าน confirm)
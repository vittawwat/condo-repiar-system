# Resident API Documentation

Base URL: `/api/residents`

---

## Authentication

Route ที่มี 🔒 ต้องส่ง token ใน header ทุกครั้ง

```
Authorization: Bearer <token>
```

---

## Endpoints

### POST `/register`

ลงทะเบียนผู้พักอาศัยใหม่

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `line_id` | string | ✅ | Line user ID |
| `fullname` | string | ✅ | ชื่อ-นามสกุล |
| `room_number` | string | ✅ | หมายเลขห้อง |
| `phone` | string | ✅ | เบอร์โทรศัพท์ |

**Request Example**

```json
{
  "line_id": "U1234567890abcdef",
  "fullname": "สมชาย ใจดี",
  "room_number": "101",
  "phone": "0812345678"
}
```

**Response**

```json
// 201 Created
{
  "success": true,
  "message": "Create user success"
}

// 400 Bad Request - กรอกข้อมูลไม่ครบ
{
  "success": false,
  "message": "Please fill in all the information."
}

// 400 Bad Request - มีผู้ใช้อยู่แล้ว
{
  "success": false,
  "message": "User already exists"
}

// 500 Server Error
{
  "success": false,
  "message": "Server Error"
}
```

---

### GET `/registration-status`

เช็คสถานะการลงทะเบียนของผู้ใช้

**Query Parameter**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `line_id` | string | ✅ | Line user ID |

**Request Example**

```
GET /api/residents/registration-status?line_id=U1234567890abcdef
```

**Response**

```json
// 200 - ยังไม่ได้ลงทะเบียน
{
  "newUser": true,
  "message": "ยังไม่ได้ลงทะเบียน"
}

// 200 - ลงทะเบียนแล้ว
{
  "newUser": false,
  "message": "ลงทะเบียนแล้ว",
  "resident": {
    "user_id": 1,
    "line_id": "U1234567890abcdef",
    "fullname": "สมชาย ใจดี",
    "room_number": "101",
    "phone": "0812345678"
  }
}

// 400 Bad Request
"ข้อมูลไม่ถูกต้อง"
```

---

### GET `/me` 🔒

ดึงข้อมูลผู้ใช้ปัจจุบันจาก token

**Header**

```
Authorization: Bearer <token>
```

**Response**

```json
// 200 OK
{
  "success": true,
  "isRegistered": true,
  "resident_info": {
    "user": {
      "user_id": 1,
      "line_id": "U1234567890abcdef",
      "fullname": "สมชาย ใจดี",
      "room_number": "101",
      "phone": "0812345678"
    }
  }
}

// 401 Unauthorized - ไม่มี token
{
  "message": "No token"
}

// 401 Unauthorized - ไม่พบผู้ใช้
{
  "message": "ไม่พบผู้ใช้งาน"
}

// 401 Unauthorized - token ไม่ถูกต้อง
{
  "message": "Invalid token"
}
```

---

## การทดสอบด้วย Postman

เพิ่ม dev-login route สำหรับรับ token ทดสอบ (เฉพาะ development เท่านั้น)

### POST `/dev-login`

```json
// Request
{
  "user_id": 1
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

นำ token ไปใส่ใน Postman

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```


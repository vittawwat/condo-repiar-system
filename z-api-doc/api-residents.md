# Residents API

Base URL

```http
https://hug-glucose-geologist.ngrok-free.dev/api/residents
```
---


# Token Types

ระบบใช้ Token 2 ประเภท

| Token          | Description                                                                       |
| -------------- | --------------------------------------------------------------------------------- |
| `line_token`   | Token ที่ได้จาก LINE Login ใช้ยืนยันตัวตนผู้ใช้                                   |
| `access_token` | JWT Token ที่ระบบออกให้หลัง Login สำเร็จ ใช้เรียก API ที่ต้องมีการ Authentication |
---

# Development Only

## Generate LINE Token

ใช้สำหรับทดสอบ API ผ่าน Postman เท่านั้น

### Endpoint

```http
POST /api/dev/generate-line-token
```

### Request Body

```json
{
  "line_id": "U2004"
}
```

### Success Response

**201 Created**

```json
{
  "success": true,
  "line_access_token": "<line_token>"
}
```

---

# Register Resident

สร้างบัญชีลูกบ้านใหม่

## Endpoint

```http
POST /register
```

## Request Body

```json
{
  "line_id": "U2004",
  "fullname": "สมศรี มานะ",
  "room_number": "102",
  "phone": "08109841341"
}
```

## Success Response

**201 Created**

```json
{
  "success": true,
  "message": "Create user success"
}
```

## Error Responses

**400 Bad Request**

```json
{
  "success": false,
  "message": "Please fill in all the information."
}
```

```json
{
  "success": false,
  "message": "User already exists"
}
```

---

# Login Resident

เข้าสู่ระบบด้วย LINE Identity Token

## Endpoint

```http
POST /login
```

## Headers

```http
Authorization: Bearer <line_token>
```

## Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Login success",
  "access_token": "<jwt_token>"
}
```

## Error Response

**401 Unauthorized**

```json
{
  "success": false,
  "message": "User unregistered"
}
```

---

# Check Registration Status

ตรวจสอบว่าผู้ใช้ลงทะเบียนแล้วหรือไม่

## Endpoint

```http
GET /registration-status
```

## Headers

```http
Authorization: Bearer <line_token>
```

## Response (Registered)

**200 OK**

```json
{
    "success": true,
    "isRegistered": true,
    "message": "User already registered",
    "resident": {
        "user_id": 1,
        "line_id": "U2004",
        "fullname": "สมศรี มานะ",
        "room_number": "102",
        "phone": "08109841341",
        "created_at": "2026-06-09T19:09:18.000Z"
    }
}
```

## Response (Unregistered)

**200 OK**

```json
{
  "isRegistered": false,
  "message": "Unregistered user"
}
```

---
## Error Responses

**401 Unauthorized**

```json
{
  "message": "No token"
}
```

```json
{
  "message": "Invalid identity"
}
```

```json
{
  "message": "Invalid token"
}
```
# Get Current Resident

ดึงข้อมูลลูกบ้านของผู้ใช้ที่ Login อยู่

## Endpoint

```http
GET /me
```

## Headers

```http
Authorization: Bearer <jwt_token>
```

## Success Response

**200 OK**

```json
{
    "success": true,
    "message": "User data retrieved successfully",
    "resident_info": {
        "user": {
            "user_id": 1,
            "line_id": "U2004",
            "fullname": "สมศรี มานะ",
            "room_number": "102",
            "phone": "08109841341",
            "created_at": "2026-06-09T19:09:18.000Z"
        }
    }
}
```

## Error Responses

**401 Unauthorized**

```json
{
  "message": "No token"
}
```

```json
{
  "message": "Invalid identity"
}
```

```json
{
  "message": "Invalid token"
}
```

# Authentication Flow

```text
LIFF Login
    │
    ▼
LINE Identity Token
    │
    ▼
GET /registration-status
    │
    ├── Registered
    │       │
    │       ▼
    │   POST /login
    │       │
    │       ▼
    │   JWT Token
    │       │
    │       ▼
    │   GET /me
    │
    └── Not Registered
            │
            ▼
      POST /register
            │
            ▼
      POST /login
```

---

# Notes

* `line_token` ใช้สำหรับยืนยันตัวตนจาก LINE Login
* `jwt_token` คือ Access Token ที่ระบบออกให้หลัง Login สำเร็จ
* Endpoint `/me` ต้องใช้ `jwt_token`
* Endpoint `/registration-status` และ `/login` ต้องใช้ `line_token`
* Endpoint `/api/dev/generate-line-token` ใช้สำหรับ Development/Test เท่านั้น และไม่ควร Deploy ใน Production

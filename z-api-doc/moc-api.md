# Residents API

Base URL

```http
https://hug-glucose-geologist.ngrok-free.dev/api/residents
```

---

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
    │   Access Token (JWT)
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
            │
            ▼
      Access Token (JWT)
            │
            ▼
         GET /me
```

---

# Token Types

ระบบใช้ Token 2 ประเภท

| Token          | Description                                                                       |
| -------------- | --------------------------------------------------------------------------------- |
| `line_token`   | Token ที่ได้จาก LINE Login ใช้ยืนยันตัวตนผู้ใช้                                   |
| `access_token` | JWT Token ที่ระบบออกให้หลัง Login สำเร็จ ใช้เรียก API ที่ต้องมีการ Authentication |

---

# Step 1 : Check Registration Status

ตรวจสอบว่าผู้ใช้เคยลงทะเบียนแล้วหรือไม่

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
  "isRegistered": true,
  "message": "User already registered",
  "resident": {
    "user_id": 6,
    "line_id": "U88888",
    "fullname": "สมศรี มานะ",
    "room_number": "102",
    "phone": "08109841341",
    "created_at": "2026-06-08T15:18:25.000Z"
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

# Step 2 : Register Resident

ใช้สำหรับผู้ใช้ที่ยังไม่เคยลงทะเบียน

## Endpoint

```http
POST /register
```

## Request Body

```json
{
  "line_id": "U88888",
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
  "message": "User created successfully"
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

# Step 3 : Login

เข้าสู่ระบบและรับ JWT Access Token

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
  "message": "Login success",
  "access_token": "eyJhbGciOi..."
}
```

## Error Response

**401 Unauthorized**

```json
{
  "message": "User unregistered"
}
```

---

# Step 4 : Get Current Resident

ดึงข้อมูลผู้ใช้ที่กำลัง Login อยู่

## Endpoint

```http
GET /me
```

## Headers

```http
Authorization: Bearer <access_token>
```

## Success Response

**200 OK**

```json
{
  "success": true,
  "isRegistered": true,
  "message": "User data retrieved successfully",
  "resident": {
    "user_id": 6,
    "line_id": "U88888",
    "fullname": "สมศรี มานะ",
    "room_number": "102",
    "phone": "08109841341",
    "created_at": "2026-06-08T15:18:25.000Z"
  }
}
```

## Error Responses

### 401 Unauthorized

```json
{
  "message": "No token"
}
```

```json
{
  "message": "Invalid token"
}
```

```json
{
  "message": "Invalid identity"
}
```

---

# Development Only

## Generate LINE Token

ใช้สำหรับทดสอบ API ผ่าน Postman เท่านั้น

> ไม่ควรเปิดใช้งาน Endpoint นี้บน Production

## Endpoint

```http
POST /api/dev/generate-line-token
```

## Request Body

```json
{
  "line_id": "U88888"
}
```

## Success Response

**201 Created**

```json
{
  "message": "success",
  "token": "eyJhbGciOi..."
}
```

---

# Example Usage

## Existing User

```text
1. LIFF Login
2. GET /registration-status
3. POST /login
4. GET /me
```

## New User

```text
1. LIFF Login
2. GET /registration-status
3. POST /register
4. POST /login
5. GET /me
```

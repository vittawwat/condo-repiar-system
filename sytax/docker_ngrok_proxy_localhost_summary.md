# Docker + ngrok + Proxy + localhost Summary

## ปัญหาที่เจอ

เปิดเว็บผ่านคอมได้ แต่เปิดผ่าน LINE ในมือถือไม่ได้

---

# สาเหตุจริง

## ตอนเปิดบนคอม

```txt
Browser + Frontend + Backend
อยู่เครื่องเดียวกัน
```

ดังนั้น:

```js
http://localhost:3000
```

ใช้ได้

เพราะ:

```txt
localhost = เครื่องเราเอง
```

---

## แต่ตอนเปิดผ่านมือถือ

Flow เปลี่ยนเป็น:

```txt
Phone
 ↓
ngrok
 ↓
Frontend
```

ถ้า frontend ยิง:

```js
http://localhost:3000
```

มือถือจะคิดว่า:

```txt
localhost = มือถือเอง
```

ซึ่งไม่มี backend

จึง error

---

# Proxy คืออะไร

Proxy = ตัวกลางส่ง request ต่อ

---

## ไม่มี Proxy

```txt
Phone
 ↓
localhost:3000 ❌
```

มือถือหา backend ไม่เจอ

---

## มี Proxy

```txt
Phone
 ↓
Frontend Server
 ↓ Proxy
Backend
```

มือถือคุยกับ frontend อย่างเดียว

frontend เป็นคนส่งต่อ request ไป backend

---

# vite.config.js

```js
proxy: {
  "/api": {
    target: "http://backend:3000",
    changeOrigin: true
  }
}
```

---

# เวลา React ยิง

```js
axios.post("/api/check-user")
```

Vite จะแปลงเป็น:

```txt
http://backend:3000/api/check-user
```

อัตโนมัติ

---

# Docker สำคัญยังไง

## ตอนใช้ Docker

แต่ละ container มี:

* localhost ของตัวเอง
* network ของตัวเอง

---

# ดังนั้น

ใน frontend container:

```txt
localhost = frontend container
```

ไม่ใช่ backend

---

# Container คุยกันยังไง

ใช้:

```txt
service name
```

จาก docker-compose.yml

เช่น:

```yml
services:
  frontend:
  backend:
```

frontend จึงต้องยิง:

```txt
http://backend:3000
```

---

# Architecture สุดท้าย

```txt
Phone
 ↓
ngrok
 ↓
Frontend (Vite)
 ↓ Proxy
Backend (Express)
 ↓
MySQL
```

---

# สิ่งสำคัญที่ต้องจำ

## ภายนอก Docker

```txt
localhost = เครื่องเรา
```

---

## ภายใน Docker

```txt
localhost = container ตัวเอง
```

---

## Container-to-container

ใช้:

```txt
service name
```

เช่น:

```txt
backend:3000
```

---

# ทำไมตอนนี้ใช้ ngrok เดียวได้

เพราะ:

```txt
Phone
 ↓
ngrok frontend
 ↓
Vite Proxy
 ↓
Backend
```

Vite ทำหน้าที่เป็นตัวกลางให้แล้ว

---

# Concept ที่ได้จากเรื่องนี้

* localhost
* Reverse Proxy
* Docker Networking
* Internal DNS
* Client vs Server
* Production Architecture

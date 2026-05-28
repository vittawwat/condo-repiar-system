# Sprint 1 — Project Foundation

## 🎯 Goal

ระบบพื้นฐานต้องใช้งานได้จริงครบ flow:

```text
LIFF Login → Register → Create Ticket → Admin Dashboard
```

และ frontend + backend + database + docker เชื่อมกันสมบูรณ์

---

# ⚙️ Setup & Architecture

* [x] setup React + Vite
* [x] setup Express API
* [x] setup Docker Compose
* [x] setup MySQL
* [x] setup project structure
* [x] frontend/backend run พร้อมกันได้
* [x] ngrok ใช้งานได้

---

# 🧱 Backend Structure

* [ ] แยก routes
* [x] แยก controllers
* [x] แยก models
* [ ] setup reusable DB connection
* [x] setup .env
* [ ] setup middleware
* [ ] API response format เหมือนกันทุก route

---

# 🗄 Database

* [x] create residents table
* [x] create tickets table
* [x] create technicians table
* [ ] setup primary key
* [ ] setup foreign key
* [ ] relation resident → ticket ถูกต้อง
* [ ] database schema ไม่ซ้ำซ้อน

---

# 👤 User Features

## LIFF Login

* [x] login LINE ได้
* [x] ดึง LINE profile ได้
* [x] ดึง LINE userId ได้
* [x] redirect register ได้
* [ ] handle LIFF error ได้

---

## Register User

* [x] กรอกชื่อได้
* [x] กรอกเบอร์โทรได้
* [x] กรอกเลขห้องได้
* [x] validate required field
* [x] save user ลง DB
* [x] LINE userId unique
* [x] register สำเร็จ redirect ได้

---

## Create Ticket

* [x] กรอกหัวข้อแจ้งซ่อมได้
* [x] กรอกรายละเอียดได้
* [x] เลือก category ได้
* [x] เพิ่มรูปภาพได้
* [x] validate input ได้
* [x] save ticket ลง DB
* [x] ticket เชื่อม resident ถูกต้อง
* [ ] success message แสดงถูกต้อง

---

# 🖥 Admin Dashboard

* [ ] dashboard ticket list ทำงาน
* [ ] ดึงข้อมูลจาก API จริง
* [ ] view ticket detail ได้
* [ ] empty state ทำงาน
* [ ] API error แล้ว UI ไม่พัง

---

# 🔌 API & Integration

* [x] frontend/backend เชื่อมกัน
* [ ] CRUD ทำงานจริง
* [x] status code ถูกต้อง
* [ ] API response format ถูกต้อง
* [ ] test API ผ่าน Postman

---

# ❌ Error Handling

* [x] backend มี try/catch
* [x] handle database error
* [x] handle duplicate user
* [ ] frontend loading state
* [ ] frontend error state

---

# 🔒 Security

* [x] validate input backend
* [x] ใช้ parameterized query
* [x] ใช้ .env
* [x] ไม่ hardcode token/config

---

# 🧪 Testing

* [ป] test login flow
* [x] test register flow
* [ป] test create ticket flow
* [ ] test dashboard flow
* [x] test invalid input
* [ ] test database relation
* [ ] test frontend/backend integration

---

# 📄 Documentation

* [ ] README วิธีรันระบบ
* [ ] ER Diagram
* [ ] API Flow Diagram
* [ ] project structure document

---

# 🚀 Deployment

* [x] Docker run ได้
* [x] frontend container ทำงาน
* [x] backend container ทำงาน
* [x] mysql container ทำงาน
* [ ] LINE webhook ใช้งานได้

---

# 📊 Current Progress

```text
ประมาณ 30% ของ Sprint 1
```

---

# 🎯 สิ่งที่ควรทำต่อทันที

1. setup reusable DB connection
2. แยก routes ให้ครบ
3. ทำ register flow frontend
4. เชื่อม React → API จริง
5. ทำ create ticket API
6. ทำ create ticket page
7. เริ่ม dashboard ticket list

---

# ✅ Sprint 1 Done เมื่อ

* login LINE ได้จริง 
* register ได้จริง 
* create ticket ได้จริง และสามารถเพิ่มรูปภาพได้

* dashboard
    // ออกแบบหน้าการใช้งาน ผ่าน figma ครอบคลุมแค่โชว์ การแจ้งซ่อม และ ดูรายระเอียด
    // สามารถดึงข้อมูลการแจ้งซ่อมและดูรายระเอียดได้
* doc apidocment ERdiagram  
* ตั้งชื่อ endpoint ทวนเรื่อง restful api 
* validation ทำงาน automate test ลองไปใช้ Jest เอาไว้ unit test&& supertest เอาไว้เทส api && playwright เอาไว้ทำ ui test \\ อีกชื่อนึง e2e
* error handling ทำงาน
* พร้อมต่อ Sprint 2

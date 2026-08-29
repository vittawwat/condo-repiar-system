# Object Mapping ใน JavaScript

## Object Mapping คืออะไร

Object Mapping คือการใช้ **object เป็นตัวจับคู่ค่า (key → value)**

เหมือนพจนานุกรม

```js
const map = {
  pending: "กำลังรอการรับเรื่อง",
  completed: "เสร็จสิ้น"
}
```

เวลาอยากได้ค่า ให้เอา key ไปค้น

```js
map["pending"]
```

ผลลัพธ์

```txt
กำลังรอการรับเรื่อง
```

---

## หลักการ

รูปแบบ

```js
const map = {
  key1: value1,
  key2: value2
}

map[key]
```

ภาพจำง่าย ๆ

```txt
pending   → กำลังรอการรับเรื่อง
completed → เสร็จสิ้น
cancelled → ยกเลิก
```

---

## ตัวอย่างใช้งาน

### 1 แปลง status จาก backend

```js
function checkStatus(status) {
  const map = {
    pending: "กำลังรอการรับเรื่อง",
    acknowledged: "รับเรื่องแล้ว",
    in_progress: "กำลังดำเนินการ",
    completed: "เสร็จสิ้น",
    cancelled: "ยกเลิก"
  }

  return map[status]
}
```

ใช้

```jsx
<td>{checkStatus(ticket.status)}</td>
```

backend ส่ง

```txt
pending
```

หน้าเว็บแสดง

```txt
กำลังรอการรับเรื่อง
```

---

### 2 ตั้ง fallback ถ้าหาไม่เจอ

```js
function checkStatus(status) {
  const map = {
    pending: "กำลังรอการรับเรื่อง",
    completed: "เสร็จสิ้น"
  }

  return map[status] ?? "ไม่ทราบสถานะ"
}
```

เช่น

```js
checkStatus("abc")
```

ผล

```txt
ไม่ทราบสถานะ
```

---

### 3 เปลี่ยนเป็นสี

```js
function getStatusColor(status) {
  const map = {
    pending: "orange",
    completed: "green",
    cancelled: "red"
  }

  return map[status] ?? "gray"
}
```

ใช้

```jsx
<span style={{ color: getStatusColor(ticket.status) }}>
  {checkStatus(ticket.status)}
</span>
```

---

### 4 แสดงประเภทงาน

```js
const categoryMap = {
  plumbing: "ประปา",
  electric: "ไฟฟ้า",
  internet: "อินเทอร์เน็ต"
}

categoryMap[ticket.category]
```

---

### 5 route / navigation

```js
const pages = {
  dashboard: "/dashboard",
  history: "/history",
  report: "/report"
}

navigate(pages[menu])
```

---

## ต่างจาก if / else ยังไง

แบบ if

```js
if (status === "pending") {
  return "กำลังรอการรับเรื่อง"
} else if (status === "completed") {
  return "เสร็จสิ้น"
}
```

แบบ object mapping

```js
const map = {
  pending: "กำลังรอการรับเรื่อง",
  completed: "เสร็จสิ้น"
}

return map[status]
```

ข้อดี

- สั้นกว่า
- อ่านง่าย
- เพิ่มค่าใหม่สะดวก
- ใช้ซ้ำง่าย

---

## ต่างจาก Destructuring ไหม

Destructuring

```js
const { user_id } = req.body
```

คือ

> ดึงค่าจาก object ออกมา

Object Mapping

```js
map[status]
```

คือ

> เอา key ไปค้นใน object แล้วคืนค่า

สรุป

```txt
Destructuring = เอาค่าออกมา
Object Mapping = เอา key ไปค้นค่า
```

---

## สรุปสั้น ๆ

Object Mapping คือ

> ใช้ object เป็นพจนานุกรม
> เอา key ไปค้น แล้วคืน value

ตัวอย่าง

```js
const map = {
  pending: "กำลังรอการรับเรื่อง"
}

map["pending"]
```

ผล

```txt
กำลังรอการรับเรื่อง
```

จำง่าย ๆ

```txt
key → value
ค้น → ได้ค่า
```
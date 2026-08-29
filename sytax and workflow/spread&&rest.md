# Spread (...) vs Rest (...)

## Spread (...)

ความหมาย:

> กางข้อมูลออกมา

### Array

```js
const a = [1,2]
const b = [3]

[...a, ...b] = [1,2,3]

การเขียนแบบฟังชั้น 

const a = []
const b = [1,2]

a => [...a,...b] =  [ ค่าว่าง,2,3]

a = [2,3]
```
### Object
```js
const user = { name: "Vitawat" }

{ ...user } -> { name: "Vitawat" }

key ใหม่ = เพิ่ม
{ ...user, age: 20 } =  { name: "Vitawat", age: 20 }

key เก่า = เปลี่ยนค่า
{ ...user, age: 21 } =  { name: "Vitawat", age: 21 }
```
## Rest (...)

ความหมาย:

> เก็บที่เหลือ
```js 
[a,b,c] = ดึงตามตำแหน่ง

[ , , c] = ข้ามแล้วดึง

...rest = เก็บที่เหลือ
const [a, ...b] = [1,2,3,4]

```
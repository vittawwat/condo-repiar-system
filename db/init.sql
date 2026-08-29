CREATE DATABASE IF NOT EXISTS condo_app;

USE condo_app;

CREATE TABLE IF NOT EXISTS residents (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  line_id VARCHAR(255) UNIQUE NOT NULL,
  fullname VARCHAR(50) NOT NULL,
  room_number VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS technicians (
  technician_id INT AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  skill ENUM('plumbing','electric','aircon','other'),
  profile_image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tickets (

  ticket_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  detail TEXT,
  category ENUM('plumbing','electric','aircon','other'),
  status ENUM('pending','acknowledged','in_progress','completed','cancelled') DEFAULT 'pending',

  technician_id INT,
  appointment_date DATETIME,
  appointment_status ENUM('confirmed','reschedule_requested') DEFAULT NULL,
  total_cost INT,
  reason TEXT,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)REFERENCES residents(user_id),
  FOREIGN KEY (technician_id)REFERENCES technicians(technician_id)
);

CREATE TABLE ticket_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    image_type ENUM('before','after') NOT NULL,
    uploaded_by ENUM('resident','admin') NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
    ON DELETE CASCADE
);

CREATE TABLE appointment_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    requested_date DATETIME NOT NULL,
    reason TEXT,
    status ENUM(
        'pending',
        'approved',
        'rejected'
    ) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME DEFAULT NULL,

    FOREIGN KEY(ticket_id)
        REFERENCES tickets(ticket_id)
        ON DELETE CASCADE

);

INSERT INTO residents (line_id, fullname, room_number, phone) VALUES
('line001', 'สมชาย ใจดี', 'A101', '0811111111'),
('line002', 'สมหญิง รักดี', 'A102', '0822222222'),
('line003', 'วิชัย มั่นคง', 'A103', '0833333333'),
('line004', 'สุดา สดใส', 'A104', '0844444444'),
('line005', 'กิตติ ชาญชัย', 'A105', '0855555555');

INSERT INTO technicians (firstname, lastname, phone, skill) VALUES
('ช่าง', 'ประปา', '0891111111', 'plumbing'),
('ช่าง', 'ไฟฟ้า', '0892222222', 'electric'),
('ช่าง', 'แอร์', '0893333333', 'aircon');

INSERT INTO tickets
  (user_id,title,detail,category, status,technician_id,appointment_date,appointment_status,total_cost,reason,created_at)
VALUES
-- 6 เดือนที่แล้ว
( 1,'ก๊อกน้ำห้องน้ำรั่ว','น้ำหยดตลอดเวลา ปิดวาล์วแล้วยังไม่หาย','plumbing','completed',1,DATE_SUB(NOW(), INTERVAL 185 DAY),'confirmed', 1200,'เปลี่ยนวาล์วน้ำและซ่อมก๊อกน้ำ',DATE_SUB(NOW(),INTERVAL 188 DAY)),
( 2,'ไฟดับทั้งห้อง','เบรกเกอร์ตัดบ่อย','electric','completed',2,DATE_SUB(NOW(), INTERVAL 178 DAY),'confirmed',2500,'เปลี่ยนเบรกเกอร์และตรวจสอบระบบไฟ', DATE_SUB(NOW(), INTERVAL 181 DAY)),
( 3,'แอร์ไม่เย็น','เปิดแล้วลมออกแต่ไม่เย็น','aircon','completed',3,DATE_SUB(NOW(), INTERVAL 170 DAY),'confirmed',1800,'เติมน้ำยาแอร์และทำความสะอาดระบบ',DATE_SUB(NOW(), INTERVAL 173 DAY)),

-- 5 เดือนที่แล้ว
(4,'ท่อน้ำทิ้งอุดตัน','อ่างล้างจานระบายน้ำช้ามาก','plumbing','completed',1,DATE_SUB(NOW(), INTERVAL 155 DAY),'confirmed',900,'ล้างท่อและแก้ไขท่อน้ำทิ้งอุดตัน',DATE_SUB(NOW(), INTERVAL 158 DAY)),
(5,'ปลั๊กไฟชำรุด','ปลั๊กบริเวณครัวมีประกายไฟ','electric','completed',2,DATE_SUB(NOW(), INTERVAL 148 DAY),'confirmed',1500,'เปลี่ยนปลั๊กไฟและตรวจสอบสายไฟ',DATE_SUB(NOW(), INTERVAL 151 DAY)),
(1,'แอร์มีน้ำหยด','มีน้ำหยดจากเครื่องปรับอากาศ','aircon','cancelled',NULL,NULL,NULL,0,'ลูกบ้านยกเลิกคำขอแจ้งซ่อม',DATE_SUB(NOW(), INTERVAL 140 DAY)),

-- 4 เดือนที่แล้ว
(2,'สวิตซ์ไฟเสีย','กดสวิตซ์แล้วไฟไม่ติด','electric','completed',2,DATE_SUB(NOW(), INTERVAL 125 DAY),'confirmed',700,'เปลี่ยนสวิตซ์ไฟ',DATE_SUB(NOW(), INTERVAL 128 DAY)),
(3,'ชักโครกน้ำไหลไม่หยุด','น้ำในชักโครกไหลตลอดเวลา','plumbing','completed',1,DATE_SUB(NOW(), INTERVAL 118 DAY),'confirmed',1100,'เปลี่ยนวาล์วน้ำและลูกลอย',DATE_SUB(NOW(), INTERVAL 121 DAY)),
(4,'แอร์ไม่ทำงาน','เปิดเครื่องแล้วไม่มีลมออก','aircon','completed',3,DATE_SUB(NOW(), INTERVAL 110 DAY),'confirmed',3200,'เปลี่ยนมอเตอร์พัดลมแอร์',DATE_SUB(NOW(), INTERVAL 113 DAY)),
(5,'ประตูห้องน้ำล็อคไม่ได้','กลอนประตูหลวมและล็อคไม่ได้','other','cancelled',NULL,NULL,NULL,0,'ลูกบ้านแจ้งยกเลิกงาน',DATE_SUB(NOW(), INTERVAL 105 DAY)),

-- 3 เดือนที่แล้ว
(1,'ไฟกระพริบ','หลอดไฟห้องนั่งเล่นกระพริบตลอด','electric','completed',2,DATE_SUB(NOW(), INTERVAL 92 DAY),'confirmed',600,'เปลี่ยนหลอดไฟและตรวจสอบขั้วหลอด',DATE_SUB(NOW(), INTERVAL 95 DAY)),
(2,'ท่อประปารั่ว','มีน้ำซึมออกจากบริเวณผนัง','plumbing','completed',1,DATE_SUB(NOW(), INTERVAL 86 DAY),'confirmed',2100,'ซ่อมท่อประปาและเปลี่ยนข้อต่อ',DATE_SUB(NOW(), INTERVAL 89 DAY)),
(3,'แอร์เสียงดัง','คอมเพรสเซอร์มีเสียงดังผิดปกติ','aircon','completed',3,DATE_SUB(NOW(), INTERVAL 80 DAY),'confirmed',2700,'ซ่อมคอมเพรสเซอร์และตรวจสอบระบบ',DATE_SUB(NOW(), INTERVAL 83 DAY)),
(4,'ไฟห้องครัวดับ','ไฟบริเวณห้องครัวไม่ติด','electric','in_progress',2,DATE_SUB(NOW(), INTERVAL 2 DAY),'confirmed',NULL,NULL,DATE_SUB(NOW(), INTERVAL 75 DAY)),

-- 2 เดือนที่แล้ว
(5,'ก๊อกน้ำห้องครัวรั่ว','ก๊อกน้ำมีน้ำหยดตลอดเวลา','plumbing','completed',1,DATE_SUB(NOW(), INTERVAL 62 DAY),'confirmed',1300,'เปลี่ยนก๊อกน้ำใหม่',DATE_SUB(NOW(), INTERVAL 65 DAY)),
(1,'ไฟดับทั้งห้อง','ไฟภายในห้องดับทั้งหมด','electric','completed',2,DATE_SUB(NOW(), INTERVAL 60 DAY),'confirmed',2800,'เปลี่ยนเบรกเกอร์และตรวจสอบวงจรไฟ',DATE_SUB(NOW(), INTERVAL 63 DAY)),
(2,'แอร์ไม่เย็น','แอร์เปิดทำงานแต่ไม่มีความเย็น','aircon','completed',3,DATE_SUB(NOW(), INTERVAL 55 DAY),'confirmed',1900,'ล้างแอร์และเติมน้ำยาแอร์',DATE_SUB(NOW(), INTERVAL 58 DAY)),
(3,'ปลั๊กไฟชำรุด','ปลั๊กไฟมีประกายไฟ','electric','cancelled',NULL,NULL,NULL,0,'ยกเลิกงานเนื่องจากลูกบ้านไม่สะดวกนัดช่าง',DATE_SUB(NOW(), INTERVAL 50 DAY)),
(4,'ท่อน้ำทิ้งอุดตัน','น้ำระบายลงท่อช้ามาก','plumbing','completed',1,DATE_SUB(NOW(), INTERVAL 45 DAY),'confirmed',1000,'ล้างท่อระบายน้ำ',DATE_SUB(NOW(), INTERVAL 48 DAY)),

-- เดือนที่แล้ว
(5,'แอร์ไม่เย็น','เปิดแล้วลมออกแต่ไม่เย็น','aircon','completed',3,DATE_SUB(NOW(), INTERVAL 35 DAY),'confirmed',1800,'เติมน้ำยาแอร์และทำความสะอาดระบบ',DATE_SUB(NOW(), INTERVAL 38 DAY)),
(1,'ปลั๊กไฟชำรุด','ปลั๊กบริเวณครัวมีประกายไฟ','electric','cancelled',NULL,NULL,NULL,0,'ยกเลิกงานเนื่องจากลูกบ้านแจ้งยกเลิก',DATE_SUB(NOW(), INTERVAL 32 DAY)),
(2,'ท่อน้ำทิ้งอุดตัน','อ่างล้างจานระบายน้ำช้ามาก','plumbing','completed',1,DATE_SUB(NOW(), INTERVAL 28 DAY),'confirmed',900,'ล้างท่อและแก้ไขท่อน้ำทิ้งอุดตัน',DATE_SUB(NOW(), INTERVAL 30 DAY)),
(3,'สวิตซ์ไฟไม่ติด','สวิตซ์ห้องนอนกดแล้วไม่ติด','electric','in_progress',2,DATE_SUB(NOW(), INTERVAL 3 DAY),'confirmed',NULL,NULL,DATE_SUB(NOW(), INTERVAL 14 DAY)),
(4,'แอร์มีเสียงดัง','มีเสียงดังผิดปกติตอนคอมเพรสเซอร์ทำงาน','aircon','acknowledged',3, NULL,NULL,NULL,NULL,DATE_SUB(NOW(), INTERVAL 12 DAY)),

-- สัปดาห์ที่แล้ว
(5,'ชักโครกน้ำไม่หยุดไหล','กดชักโครกแล้วน้ำไหลไม่หยุด','plumbing','in_progress',1,DATE_ADD(NOW(), INTERVAL 1 DAY),'confirmed',NULL,NULL,DATE_SUB(NOW(), INTERVAL 6 DAY)),
(1,'ไฟกระพริบ','หลอดไฟห้องนั่งเล่นกระพริบตลอด','electric','pending',NULL,NULL,NULL,NULL,NULL,DATE_SUB(NOW(), INTERVAL 5 DAY)),                 -- ★ แก้: เพิ่ม NULL ตัวที่ 5
(2,'แอร์รั่วน้ำ','มีน้ำหยดจากแอร์ลงพื้น','aircon','acknowledged',3,DATE_ADD(NOW(), INTERVAL 2 DAY),'confirmed',NULL,NULL,DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3,'ประตูห้องน้ำล็อคไม่ได้','กลอนประตูหลวม','other','pending',NULL,NULL,NULL,NULL,NULL,DATE_SUB(NOW(), INTERVAL 2 DAY)),                          -- ★ แก้: เพิ่ม NULL ตัวที่ 5

-- วันนี้
(4,'ท่อประปาแตก','น้ำไหลออกมาจากผนังห้องครัว','plumbing','pending',NULL,NULL,NULL,NULL,NULL,DATE_SUB(NOW(), INTERVAL 1 DAY)),                    -- ★ แก้: เพิ่ม NULL ตัวที่ 5
(5,'ไฟช็อตที่ปลั๊กห้องนอน','เสียบปลั๊กแล้วมีประกายไฟ อันตราย','electric','pending',NULL,NULL,NULL,NULL,NULL,NOW());                                 -- ★ แก้: เพิ่ม NULL ตัวที่ 5
CREATE DATABASE IF NOT EXISTS condo_app;

USE condo_app;

CREATE TABLE IF NOT EXISTS residents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE,
  fullname VARCHAR(50),
  room_number VARCHAR(50),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS technicians (
  technician_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  phone VARCHAR(20),
  skill ENUM('plumbing','electric','aircon','other'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
  ticket_id INT AUTO_INCREMENT PRIMARY KEY,

  user_id VARCHAR(255),
  title VARCHAR(255),
  detail TEXT,
  category VARCHAR(50),
  status ENUM('pending','acknowledged','in_progress','completed','cancelled') DEFAULT 'pending',

  technician_id INT,
  appointment_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)REFERENCES residents(user_id),
  FOREIGN KEY (technician_id)REFERENCES technicians(technician_id)
);



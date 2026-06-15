CREATE DATABASE IF NOT EXISTS condo_app;

USE condo_app;

CREATE TABLE IF NOT EXISTS residents (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  line_id VARCHAR(255) UNIQUE,
  fullname VARCHAR(50) NOT NULL,
  room_number VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS technicians (
  technician_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
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
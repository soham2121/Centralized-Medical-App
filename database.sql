create database medicalSystem;
use medicalSystem;

CREATE TABLE hospitals (
    hospital_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100)
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('PATIENT', 'DOCTOR', 'LAB_TECH', 'ADMIN', 'SYSTEM_ADMIN') NOT NULL,
    hospital_id INT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
        ON DELETE SET NULL
);

CREATE TABLE medical_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    created_by INT,
    record_type ENUM('BLOOD_TEST', 'SCAN', 'PRESCRIPTION') NOT NULL,
    details TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
        ON DELETE SET NULL
);

CREATE TABLE qr_tokens (
    token_id VARCHAR(100) UNIQUE PRIMARY KEY,
    patient_id INT NOT NULL,
    expiry_time DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (patient_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

select * from users;
select * from medical_records;
select * from qr_tokens;

#To reset any table
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE qr_tokens;
SET FOREIGN_KEY_CHECKS = 1;
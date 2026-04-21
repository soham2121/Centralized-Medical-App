# 🏥 MedVault — Centralized Medical Record Management System

MedVault is a cross-platform mobile application designed to securely manage and share medical records between patients, doctors, lab technicians, and administrators.

It uses a centralized cloud-based system with **QR-based temporary authentication**, ensuring medical data is accessible, secure, and always up to date.

---

## 🚀 Key Features

- 🔐 **Role-Based Access Control**
  - Patient, Doctor, Lab Technician, Admin

- 🔗 **Secure QR Code Sharing**
  - Patients generate time-sensitive (5-minute) QR tokens  
  - Doctors/Lab Techs scan QR to gain temporary access  

- 🧾 **Comprehensive Medical Records**
  - 🩸 Blood Tests (Hemoglobin, Sugar Levels)  
  - 🔬 Scans (MRI, X-Ray, CT Scan + findings)  
  - 💊 Prescriptions (Diagnosis, Medicines, Dosage, Timing)  

- ☁️ **Centralized Cloud Access**
  - Access records anytime, anywhere  
  - No dependency on local servers  

---

## 🧠 How It Works

1. Patient logs into the app  
2. Generates a **QR access token (valid for 5 minutes)**  
3. Doctor/Lab Technician scans the QR code  
4. Backend validates the token  
5. Medical records can be viewed or added  
6. Access automatically expires  

---

## 🛠️ Tech Stack

### 📱 Frontend
- React Native (Expo)
- expo-camera (QR scanning)
- react-native-qrcode-svg (QR generation)

### ⚙️ Backend
- Spring Boot 3 (Java 17)
- Spring Data JPA
- REST APIs

### 🗄️ Database
- MySQL

---

## 🌐 Deployment

The system is fully deployed and accessible globally:

- 🔗 **Backend API:** https://centralized-medical-app.onrender.com  
- ☁️ **Database:** Railway  

> The frontend app connects directly to the live backend — no local backend setup required.

---

## 🧩 System Architecture

```
Mobile App (React Native)
        ↓
Backend API (Spring Boot - Render)
        ↓
Database (MySQL - Railway)
```

---

## 📂 Project Structure

```
Frontend/
  MedVault/
    App.js
    screens/
    api/api.js

Backend/
  medical-api/      → Spring Boot REST API
  MedicalSystem/    → Initial Java prototype (pre-Spring Boot)

database.sql        → MySQL schema (users, hospitals, records, qr_tokens)
```

---

## 🏃‍♂️ Running the App Locally (Frontend Only)

```bash
cd Frontend/MedVault
npm install
npm start
```

Then:
- Scan QR using **Expo Go**  
- OR press:
  - `a` → Android  
  - `i` → iOS  
  - `w` → Web  

> The app automatically connects to the deployed backend.

---

## 🔒 Security

- QR-based temporary authentication  
- Time-limited access tokens (5 minutes)  
- Role-based authorization  
- Controlled record access  

---

## 📈 Future Scope

- 🤖 AI-based health insights  
- 🔗 Blockchain-based medical data security  
- 🏥 Hospital system integration  
- 🌍 Multi-language support  

---

## ⭐ Acknowledgment

This project was developed as part of an academic initiative to solve real-world healthcare data management challenges.

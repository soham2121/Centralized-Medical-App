# Centralized Medical App (MedVault)

MedVault is a comprehensive, cross-platform mobile application designed to securely manage and share medical records between patients, doctors, lab technicians, and administrators. By leveraging a centralized approach, it ensures that your medical history is always accessible and up to date, no matter where you are.

## 🌟 Key Features

- **Role-Based Access Control**: Different tailored experiences for `PATIENT`, `DOCTOR`, `LAB_TECH`, and `ADMIN`.
- **Secure QR Code Sharing**: Patients can generate time-sensitive (5-minute) QR access tokens. Doctors and lab technicians scan these QR codes using the app's built-in camera to temporarily authenticate and add new medical records.
- **Comprehensive Record Types**: Support for logging various types of medical records including:
  - 🩸 Blood Tests (Hemoglobin, Sugar Levels)
  - 🔬 Scans (MRI, X-Ray, CT Scan, and findings)
  - 💊 Prescriptions (Diagnoses, Medicines, Dosages, and timings)
- **Centralized Accessibility**: The application backend is hosted on the cloud, making the mobile app fully functional from anywhere without requiring a local server setup.

## 🛠️ Technology Stack

- **Frontend**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) for cross-platform mobile development (iOS/Android). Uses `expo-camera` for QR scanning and `react-native-qrcode-svg` for QR generation.
- **Backend API**: [Spring Boot 3](https://spring.io/projects/spring-boot) (Java 17), utilizing Spring Data JPA and Spring Web.
- **Database**: [MySQL](https://www.mysql.com/)

## 🚀 Deployment

The system is fully deployed on the cloud to allow easy and global access:
- **Backend API**: Hosted on **[Render](https://render.com/)** (`https://centralized-medical-app.onrender.com`).
- **Database**: Hosted on **[Railway](https://railway.app/)**.

Because the API and database are hosted remotely, you can run the Expo frontend app on your mobile device or simulator without needing to run the backend locally.

## 📂 Project Structure

- `/Frontend/MedVault/`: Contains the React Native Expo application. 
  - `App.js`: Navigation and Theme providers.
  - `screens/`: Contains role-specific screens (e.g., `PatientScreen.js`, `DoctorScreen.js`, etc.).
  - `api/api.js`: Axios configuration pointing to the Render hosted backend.
- `/Backend/medical-api/`: The Spring Boot REST API providing endpoints for authentication, QR generation, users, and medical records.
- `/Backend/MedicalSystem/`: A lightweight Java companion project. (Scheme before converting to Spring Boot API)
- `database.sql`: The complete MySQL database schema for creating tables (users, hospitals, medical records, qr_tokens).

## 🏃‍♂️ How to Run Locally (Frontend)

To run the mobile application on your device or emulator:

1. Navigate to the frontend directory:
   ```bash
   cd Frontend/MedVault
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npm start
   ```
4. Use the Expo Go app on your iOS or Android device to scan the QR code displayed in your terminal, or press `a` to run on an Android emulator / `i` to run on an iOS simulator / `w` to run in web browser.

> **Note**: The app will automatically connect to the live backend on Render. No local backend setup is required!

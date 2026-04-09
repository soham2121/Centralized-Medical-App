package com.soham.medicalsystem;

import com.soham.medicalsystem.dao.*;
import com.soham.medicalsystem.model.*;
import com.soham.medicalsystem.model.medicalRecords.*;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        //TestUsers();
        //TestMedicalRecords();
        UserDao dao = new UserDao();
        User doctor = dao.getDocName(2);
        System.out.println(doctor.getName() + " " + doctor.getEmail() + " " + doctor.getRole());
    }

    private static void TestMedicalRecords() {
        MedicalRecordsDao dao = new MedicalRecordsDao();

        int patientId = 1;
        int doctorId = 2;

        BloodTest bt = new BloodTest(patientId, doctorId, 13.5, 90.0);
        dao.addRecord(bt);

        ScanRecord sr = new ScanRecord(patientId, doctorId, "MRI", "No abnormalities");
        dao.addRecord(sr);

        PrescriptionRecord pr = new PrescriptionRecord(patientId, doctorId, "Take rest and hydrate");
        pr.addMedicine("Paracetamol", "500mg", "Twice a day", "5 days", "After food");
        pr.addMedicine("Vitamin C", "1000mg", "Once a day", "7 days", "");
        dao.addRecord(pr);

        List<MedicalRecord> records = dao.getRecordsById(patientId);
        for (MedicalRecord record : records) {
            System.out.println("Record ID: " + record.getRecordId());
            System.out.println("Type: " + record.getRecordType());
            System.out.println("Created By: " + record.getCreatedBy());
            System.out.println("Date: " + record.getDate());
            System.out.println("Details: " + record.getDetails());
            System.out.println("-----------------------------");
        }
    }

    private static void TestUsers() {
        UserDao dao = new UserDao();

        User user = new User("Soham", "test@mail.com", "1234", "PATIENT", null);
        boolean result = dao.addUser(user);
        System.out.println(result ? "Inserted!" : "Failed!");

        User user2 = new User("Doctor Jackass", "test123@mail.com", "1234", "DOCTOR", null);
        boolean result2 = dao.addUser(user2);
        System.out.println(result2 ? "Inserted!" : "Failed!");

        User user3 = new User("DELETE", "test132123@mail.com", "1234", "PATIENT", null);
        boolean result3 = dao.addUser(user3);
        System.out.println(result2 ? "Inserted!" : "Failed!");

        User gottenID = dao.getUserById(2);
        System.out.println(gottenID.getName() + " " + gottenID.getEmail());

        User gottenMail = dao.getUserByMail("test@mail.com");
        System.out.println(gottenMail.getName() + " " + gottenMail.getEmail());

        dao.updateUser(1, "Som", "newEmail@gmail.com", null);
        gottenID = dao.getUserById(1);
        System.out.println(gottenID.getName() + " " + gottenID.getEmail());

        //dao.deleteUser(3);
    }
}
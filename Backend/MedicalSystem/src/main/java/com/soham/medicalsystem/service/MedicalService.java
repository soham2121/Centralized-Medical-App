package com.soham.medicalsystem.service;

import com.soham.medicalsystem.dao.MedicalRecordsDao;
import com.soham.medicalsystem.dao.QRDao;
import com.soham.medicalsystem.model.medicalRecords.MedicalRecord;

public class MedicalService {
    private final MedicalRecordsDao recordsDao;
    private final QRDao qrDao;

    public MedicalService() {
        this.recordsDao = new MedicalRecordsDao();
        this.qrDao = new QRDao();
    }

    public boolean addRecordUsingToken(String tokenId, MedicalRecord record) {
        try {
            int patientId = qrDao.validateToken(tokenId);

            record.setPatientId(patientId);

            boolean success = recordsDao.addRecord(record);
            if (!success) {
                throw new RuntimeException("Failed to insert record");
            }

            qrDao.deactivateToken(tokenId);

            return true;

        } catch (Exception e) {
            throw new RuntimeException("Error in addRecordUsingToken ", e);
        }
    }
}
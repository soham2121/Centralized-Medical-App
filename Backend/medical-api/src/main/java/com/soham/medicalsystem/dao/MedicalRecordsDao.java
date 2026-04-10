package com.soham.medicalsystem.dao;

import com.soham.medicalsystem.util.DBConnection;
import com.soham.medicalsystem.model.medicalRecords.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class MedicalRecordsDao {
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean addRecord(MedicalRecord record) {
        String query = "INSERT INTO medical_records (patient_id, created_by, record_type, details) VALUES (?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {

            ps.setInt(1, record.getPatientId());
            ps.setInt(2, record.getCreatedBy());
            ps.setString(3, record.getRecordType().name());

            String jsonDetails = objectMapper.writeValueAsString(record.getDetails());
            ps.setString(4, jsonDetails);

            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            throw new RuntimeException("Error adding medical record", e);
        }
    }

    public List<MedicalRecord> getRecordsById(int patientId){
        List<MedicalRecord> records = new ArrayList<>();

        String query = "SELECT * FROM medical_records WHERE patient_id = ? ORDER BY date DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {

            ps.setInt(1, patientId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                RecordType type = RecordType.valueOf(rs.getString("record_type"));
                String detailsJson = rs.getString("details");
                Map<String, Object> detailsMap = objectMapper.readValue(detailsJson, Map.class);

                MedicalRecord record = null;
                switch (type) {
                    case BLOOD_TEST -> {
                        BloodTest bt = new BloodTest();
                        bt.setHemoglobin(((Number) detailsMap.get("hemoglobin")).doubleValue());
                        bt.setSugarLevel(((Number) detailsMap.get("sugarLevel")).doubleValue());
                        record = bt;
                    }

                    case SCAN -> {
                        ScanRecord sr = new ScanRecord();
                        sr.setScanType((String) detailsMap.get("scanType"));
                        sr.setFindings((String) detailsMap.get("findings"));
                        record = sr;
                    }

                    case PRESCRIPTION -> {
                        PrescriptionRecord pr = new PrescriptionRecord();
                        pr.setDoctorNotes((String) detailsMap.get("doctorNotes"));

                        List<Map<String, Object>> meds = (List<Map<String, Object>>) detailsMap.get("medicines");
                        if (meds != null) {
                            for (Map<String, Object> m : meds) {
                                pr.addMedicine(
                                        (String) m.get("name"),
                                        (String) m.get("dosage"),
                                        (String) m.get("timing"),
                                        (String) m.get("duration"),
                                        (String) m.get("notes")
                                );
                            }
                        }

                        record = pr;
                    }
                }

                if (record != null) {
                    record.setRecordId(rs.getInt("record_id"));
                    record.setPatientId(rs.getInt("patient_id"));
                    record.setCreatedBy(rs.getInt("created_by"));
                    record.setRecordType(type);

                    Timestamp ts = rs.getTimestamp("date");
                    if (ts != null) {
                        record.setDate(ts.toLocalDateTime());
                    }

                    records.add(record);
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Error fetching records", e);
        }

        return records;
    }

    public static void main(String[] args) {
        
    }
}

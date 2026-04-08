package com.soham.medicalsystem.dao;

import com.soham.medicalsystem.util.DBConnection;

import java.sql.*;

import com.soham.medicalsystem.model.medicalRecords.*;

public class MedicalRecordsDao {
    public static boolean addRecord(RecordType recordType, int patientId, int hospitalId){
        try(Connection conn  = DBConnection.getConnection();
        PreparedStatement ps = conn.Prepared)
        return false;
    }
}

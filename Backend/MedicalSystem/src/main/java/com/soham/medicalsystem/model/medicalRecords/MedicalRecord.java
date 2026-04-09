package com.soham.medicalsystem.model.medicalRecords;

import java.time.LocalDateTime;

public abstract class MedicalRecord {
    private int recordId;
    private int patientId;
    private int createdBy;
    private RecordType recordType;
    private LocalDateTime date;

    public MedicalRecord(){}

    public MedicalRecord(int patientId, int createdBy, RecordType recordType){
        this.patientId = patientId;
        this.createdBy = createdBy;
        this.recordType = recordType;
    }

    public int getRecordId() { return recordId; }
    public void setRecordId(int recordId) { this.recordId = recordId; }

    public int getPatientId() { return patientId; }
    public void setPatientId(int patientId) { this.patientId = patientId; }

    public int getCreatedBy() { return createdBy; }
    public void setCreatedBy(int createdBy) { this.createdBy = createdBy; }

    public RecordType getRecordType() { return recordType; }
    public void setRecordType(RecordType recordType) { this.recordType = recordType; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public abstract Object getDetails();
}
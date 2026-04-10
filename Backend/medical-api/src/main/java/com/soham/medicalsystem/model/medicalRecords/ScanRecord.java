package com.soham.medicalsystem.model.medicalRecords;

import java.util.HashMap;
import java.util.Map;

public class ScanRecord extends MedicalRecord{
    private String scanType;
    private String findings;

    public ScanRecord(){
        super();
        setRecordType(RecordType.SCAN);
    }

    public ScanRecord(int patientId, int createdBy, String scanType, String findings){
        super(patientId, createdBy, RecordType.SCAN);
        this.scanType = scanType;
        this.findings = findings;
    }

    public String getScanType() { return scanType; }
    public void setScanType(String scanType) { this.scanType = scanType; }

    public String getFindings() { return findings; }
    public void setFindings(String findings) { this.findings = findings; }

    @Override
    public Object getDetails(){
        Map<String, Object> data = new HashMap<>();
        data.put("type", "SCAN");
        data.put("scanType", scanType);
        data.put("findings", findings);
        return data;
    }
}

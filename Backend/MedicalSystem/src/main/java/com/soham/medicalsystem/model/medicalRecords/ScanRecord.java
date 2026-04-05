package com.soham.medicalsystem.model.medicalRecords;

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
    public String getDetails(){
        return "Scan Type: " + scanType + " Findings " + findings;
    }
}

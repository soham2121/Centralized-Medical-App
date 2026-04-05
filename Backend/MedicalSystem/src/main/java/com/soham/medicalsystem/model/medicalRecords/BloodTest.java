package com.soham.medicalsystem.model.medicalRecords;

public class BloodTest extends MedicalRecord{
    private double hemoglobin;
    private double sugarLevel;

    public BloodTest(){
        super();
        setRecordType(RecordType.BLOOD_TEST);
    }

    public BloodTest(int patientId, int createdBy, double hemoglobin, double sugarLevel){
        super(patientId, createdBy, RecordType.BLOOD_TEST);
        this.hemoglobin = hemoglobin;
        this.sugarLevel = sugarLevel;
    }

    public double getHemoglobin() { return hemoglobin; }
    public void setHemoglobin(double hemoglobin) { this.hemoglobin = hemoglobin; }

    public double getSugarLevel() { return sugarLevel; }
    public void setSugarLevel(double sugarLevel) { this.sugarLevel = sugarLevel; }

    @Override
    public String getDetails(){
        return "Blood Test -> Hemoglobin " + hemoglobin + " Sugar Level " + sugarLevel;
    }
}

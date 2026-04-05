package com.soham.medicalsystem.model.medicalRecords;

public class Medicine {

    private String name;
    private String dosage;

    public Medicine(String name, String dosage) {
        this.name = name;
        this.dosage = dosage;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    @Override
    public String toString() {
        return name + " (" + dosage + ")";
    }
}
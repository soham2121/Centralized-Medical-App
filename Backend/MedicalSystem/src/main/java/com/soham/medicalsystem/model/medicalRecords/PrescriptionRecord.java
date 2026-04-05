package com.soham.medicalsystem.model.medicalRecords;

import java.util.ArrayList;
import java.util.List;

public class PrescriptionRecord extends MedicalRecord {
    private List<Medicine> medicines;

    public PrescriptionRecord() {
        super();
        setRecordType(RecordType.PRESCRIPTION);
        this.medicines = new ArrayList<>();
    }

    public PrescriptionRecord(int patientId, int createdBy, List<Medicine> medicines) {
        super(patientId, createdBy, RecordType.PRESCRIPTION);
        this.medicines = medicines;
    }

    public List<Medicine> getMedicines() {
        return medicines;
    }

    public void addMedicine(String name, String dosage) {
        this.medicines.add(new Medicine(name, dosage));
    }

    @Override
    public String getDetails() {
        return "Prescription -> Medicines: " + medicines;
    }
}
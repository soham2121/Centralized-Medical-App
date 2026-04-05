package com.soham.medicalsystem.model.medicalRecords;

import java.util.ArrayList;
import java.util.List;

public class PrescriptionRecord extends MedicalRecord {

    private List<Medicine> medicines;
    private String doctorNotes;

    public PrescriptionRecord() {
        super();
        setRecordType(RecordType.PRESCRIPTION);
        this.medicines = new ArrayList<>();
    }

    public PrescriptionRecord(int patientId, int createdBy, String doctorNotes) {
        super(patientId, createdBy, RecordType.PRESCRIPTION);
        this.medicines = new ArrayList<>();
        this.doctorNotes = doctorNotes;
    }

    public List<Medicine> getMedicines() {
        return medicines;
    }

    public String getDoctorNotes() {
        return doctorNotes;
    }

    public void setDoctorNotes(String doctorNotes) {
        this.doctorNotes = doctorNotes;
    }

    public void addMedicine(String name, String dosage, String timing, String duration, String notes) {
        medicines.add(new Medicine(name, dosage, timing, duration, notes));
    }

    @Override
    public String getDetails() {
        return "Prescription -> Medicines: " + medicines +
                (doctorNotes != null ? ", Notes: " + doctorNotes : "");
    }
}
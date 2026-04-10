package com.soham.medicalsystem.model.medicalRecords;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    public Object getDetails() {
        List<Map<String, Object>> medsList = new ArrayList<>();

        for (Medicine med : medicines) {
            java.util.Map<String, Object> medData = new java.util.HashMap<>();

            medData.put("name", med.getName());
            medData.put("dosage", med.getDosage());
            medData.put("timing", med.getTiming());
            medData.put("duration", med.getDuration());
            medData.put("notes", med.getNotes());

            medsList.add(medData);
        }

        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("type", "PRESCRIPTION");
        result.put("medicines", medsList);
        result.put("doctorNotes", doctorNotes);

        return result;
    }
}
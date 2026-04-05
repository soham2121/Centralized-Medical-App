package com.soham.medicalsystem.model.medicalRecords;

public class Medicine {

    private String name;
    private String dosage;
    private String timing;
    private String duration;
    private String notes;

    public Medicine(String name, String dosage, String timing, String duration, String notes) {
        this.name = name;
        this.dosage = dosage;
        this.timing = timing;
        this.duration = duration;
        this.notes = notes;
    }

    public String getName() { return name; }
    public String getDosage() { return dosage; }
    public String getTiming() { return timing; }
    public String getDuration() { return duration; }
    public String getNotes() { return notes; }

    public void setName(String name) { this.name = name; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public void setTiming(String timing) { this.timing = timing; }
    public void setDuration(String duration) { this.duration = duration; }
    public void setNotes(String notes) { this.notes = notes; }

    @Override
    public String toString() {
        return name + " (" + dosage + ") - " +
                timing + " for " + duration +
                (notes != null && !notes.isEmpty() ? " [" + notes + "]" : "");
    }
}
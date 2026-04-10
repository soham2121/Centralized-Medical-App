package com.soham.medicalsystem.controller;

import com.soham.medicalsystem.dao.MedicalRecordsDao;
import com.soham.medicalsystem.model.medicalRecords.*;
import com.soham.medicalsystem.service.MedicalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/records")
public class MedicalRecordController {
    private final MedicalService service = new MedicalService();
    private final MedicalRecordsDao medicalRecordsDao = new MedicalRecordsDao();

    @PostMapping("/add")
    public String addRecord(@RequestBody Map<String, Object> request) {

        String token = (String) request.get("token");
        String type = (String) request.get("type");

        MedicalRecord record = null;

        switch (type) {
            case "BLOOD_TEST" -> {
                BloodTest bt = new BloodTest();
                bt.setHemoglobin(Double.parseDouble(request.get("hemoglobin").toString()));
                bt.setSugarLevel(Double.parseDouble(request.get("sugarLevel").toString()));
                bt.setCreatedBy((Integer) request.get("createdBy"));
                record = bt;
            }

            case "SCAN" -> {
                ScanRecord sr = new ScanRecord();
                sr.setScanType((String) request.get("scanType"));
                sr.setFindings((String) request.get("findings"));
                sr.setCreatedBy((Integer) request.get("createdBy"));
                record = sr;
            }

            case "PRESCRIPTION" -> {
                PrescriptionRecord pr = new PrescriptionRecord();

                pr.setDoctorNotes((String) request.get("doctorNotes"));
                pr.setCreatedBy((Integer) request.get("createdBy"));

                List<Map<String, Object>> meds = (List<Map<String, Object>>) request.get("medicines");

                if (meds != null) {
                    for (Map<String, Object> m : meds) {
                        pr.addMedicine(
                                (String) m.get("name"),
                                (String) m.get("dosage"),
                                (String) m.get("timing"),
                                (String) m.get("duration"),
                                (String) m.get("notes")
                        );
                    }
                }

                record = pr;
            }
        }

        service.addRecordUsingToken(token, record);

        return "Record added successfully";
    }

    @GetMapping("/{patientId}")
    public List<MedicalRecord> getRecords(@PathVariable int patientId) {
        return medicalRecordsDao.getRecordsById(patientId);
    }
}
package com.soham.medicalsystem.controller;

import com.soham.medicalsystem.dao.QRDao;
import com.soham.medicalsystem.model.QRToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/qr")
public class QRController {
    private final QRDao qrDao = new QRDao();

    @PostMapping("/generate")
    public Map<String, String> generate(@RequestBody Map<String, Integer> request) {
        int patientId = request.get("patientId");

        QRToken token = qrDao.createToken(patientId);

        Map<String, String> response = new HashMap<>();
        response.put("token", token.getTokenId());

        return response;
    }
}
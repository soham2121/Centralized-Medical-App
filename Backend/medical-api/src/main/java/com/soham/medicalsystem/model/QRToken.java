package com.soham.medicalsystem.model;

import java.time.LocalDateTime;
import java.security.SecureRandom;
import java.util.Base64;

public class QRToken {
    private final String tokenId;
    private final int patientId;
    private final LocalDateTime expiryTime;
    private boolean isActive;
    private static final SecureRandom secureRandom = new SecureRandom();

    public QRToken(int patientId){
        tokenId = generateTokenId();
        this.patientId = patientId;
        expiryTime = LocalDateTime.now().plusMinutes(5);
        isActive = true;
    }

    public QRToken(String tokenId, int patientId, LocalDateTime expiryTime, boolean isActive) {
        this.tokenId = tokenId;
        this.patientId = patientId;
        this.expiryTime = expiryTime;
        this.isActive = isActive;
    }

    public String getTokenId() {
        return tokenId;
    }

    public int getPatientId() {
        return patientId;
    }

    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }

    public boolean isActive() {
        return isActive;
    }

    public void deactivate() {
        isActive = false;
    }

    private String generateTokenId(){
        byte[] bytes = new byte[24];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public boolean isValid(){
        return isActive && LocalDateTime.now().isBefore(expiryTime);
    }
}

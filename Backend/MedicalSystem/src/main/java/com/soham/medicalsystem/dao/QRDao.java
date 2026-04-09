package com.soham.medicalsystem.dao;

import com.soham.medicalsystem.model.QRToken;
import com.soham.medicalsystem.util.DBConnection;

import java.sql.*;

public class QRDao {
    public QRToken createToken(int patientId){
        String query = "INSERT INTO qr_tokens (token_id, patient_id, expiry_time, is_active) VALUES (?, ?, ?, ?)";

        try(Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(query)){
            QRToken token = new QRToken(patientId);

            ps.setString(1, token.getTokenId());
            ps.setInt(2, token.getPatientId());
            ps.setTimestamp(3, Timestamp.valueOf(token.getExpiryTime()));
            ps.setBoolean(4, token.isActive());
            ps.executeUpdate();

            return token;
        } catch (SQLException e){
            throw new RuntimeException("Error adding the qr token ", e);
        }
    }

    public int validateToken(String tokenId){
        String query = "SELECT * FROM qr_tokens WHERE token_id = ?";
        QRToken token = null;

        try(Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(query)){
            ps.setString(1, tokenId);
            ResultSet rs = ps.executeQuery();

            if(rs.next()) {
                token = new QRToken(
                        rs.getString("token_id"),
                        rs.getInt("patient_id"),
                        rs.getTimestamp("expiry_time").toLocalDateTime(),
                        rs.getBoolean("is_active")
                );
            }

            if(token == null){
                throw new RuntimeException("Invalid token");
            }
            else if(!token.isValid()){
                deactivateToken(token.getTokenId());
                throw new RuntimeException("Token expired");
            }

            return token.getPatientId();
        } catch (SQLException e) {
            throw new RuntimeException("Error validating token ", e);
        }
    }

    public void deactivateToken(String tokenId){
        String Query = "UPDATE qr_tokens SET is_active = false WHERE token_id = ? AND is_active = true";
        try(Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(Query)){
            ps.setString(1, tokenId);
            ps.executeUpdate();
        } catch (SQLException e){
            throw new RuntimeException("Error deactivating token ", e);
        }
    }
}

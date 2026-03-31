package com.soham.medicalsystem.dao;

import com.soham.medicalsystem.model.User;
import com.soham.medicalsystem.util.DBConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Types;

public class UserDao {
    public boolean addUser(User user){
        String query = "INSERT INTO users (name, email, password, role, hospital_Id) VALUES (?,?,?,?,?)";

        try(
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(query);
        ){
            ps.setString(1, user.getName());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPassword());
            ps.setString(4, user.getRole());
            if(user.getHospitalId() != null){
                ps.setInt(5, user.getHospitalId());
            }
            else{
                ps.setNull(5, Types.INTEGER);
            }
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new RuntimeException("Error while adding user: ",e);
        }
    }
}

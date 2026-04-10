package com.soham.medicalsystem.dao;

import com.soham.medicalsystem.model.User;
import com.soham.medicalsystem.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserDao {
    public boolean addUser(User user){
        String query = "INSERT INTO users (name, email, password, role, hospital_id) VALUES (?,?,?,?,?)";

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

    private User getUser(Integer userId, String email){
        String query;

        if (userId != null) {
            query = "SELECT user_id, name, email, password, role, hospital_id FROM users WHERE user_id = ?";
        } else if (email != null) {
            query = "SELECT user_id, name, email, password, role, hospital_id FROM users WHERE email = ?";
        } else {
            throw new IllegalArgumentException("Provide userId or email");
        }

        try(Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(query);
        ){
            if (userId != null) {
                ps.setInt(1, userId);
            } else {
                ps.setString(1, email);
            }

            ResultSet result  = ps.executeQuery();
            if (!result.next()) { return null; }
            
            User user = new User();
            user.setUserId(result.getInt("user_id"));
            user.setName(result.getString("name"));
            user.setEmail(result.getString("email"));
            user.setRole(result.getString("role"));
            user.setPassword(result.getString("password"));

            int hospitalId = result.getInt("hospital_id");
            if (result.wasNull()) {
                user.setHospitalId(null);
            } else {
                user.setHospitalId(hospitalId);
            }
            
            return user;
        } catch (SQLException e) {
            throw new RuntimeException("Error getting user ", e);
        }
    }

    public User getUserById(Integer userId){
        return getUser(userId, null);
    }

    public User getUserByMail(String email){
        return getUser(null, email);
    }

    public boolean updateUser(int userId, String name, String email, String password){
        String query = "UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), password = COALESCE(?, password) WHERE user_id = ?";

        try(Connection conn = DBConnection.getConnection();
        PreparedStatement ps = conn.prepareStatement(query);){

            ps.setString(1, name);
            ps.setString(2, email);
            ps.setString(3, password);

            ps.setInt(4, userId);

            return ps.executeUpdate() > 0;
        }
        catch (SQLException e){
            throw new RuntimeException("Error updating user ", e);
        }
    }

    public boolean deleteUser(int userId){
        String query = "DELETE FROM users WHERE user_id = ?";
        try(Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(query);){
            ps.setInt(1, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e){
            throw new RuntimeException("Error deleting user ", e);
        }
    }

    public boolean assignHospitalToUser(int userId, int hospitalId){
        String query = "UPDATE users SET hospital_id = ? WHERE user_id = ?";
        try(Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(query);){
            ps.setInt(1, hospitalId);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e){
            throw new RuntimeException("Error updating user hospital ", e);
        }
    }

    public User getDocName(int userId){
        String query = "SELECT user_id, name, email, role, hospital_id FROM users WHERE user_id = ?";

        try(Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(query);
        ){
            ps.setInt(1, userId);
            ResultSet result  = ps.executeQuery();
            if (!result.next()) { return null; }

            if(result.getString("role").equals("DOCTOR")) {
                User user = new User();
                user.setUserId(result.getInt("user_id"));
                user.setName(result.getString("name"));
                user.setEmail(result.getString("email"));
                user.setRole(result.getString("role"));
                user.setHospitalId(result.getInt("hospital_id"));
                return user;
            }
            return null;
        } catch (SQLException e) {
            throw new RuntimeException("Error getting doctor ", e);
        }
    }

    public List<User> getAllUsers() {
        String query = "SELECT user_id, name, email, role, hospital_id FROM users";
        List<User> users = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                User u = new User();
                u.setUserId(rs.getInt("user_id"));
                u.setName(rs.getString("name"));
                u.setEmail(rs.getString("email"));
                u.setRole(rs.getString("role"));
                users.add(u);
            }
            return users;
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching users", e);
        }
    }
}
package com.soham.medicalsystem;

import com.soham.medicalsystem.util.DBConnection;
import com.soham.medicalsystem.model.User;
import com.soham.medicalsystem.dao.UserDao;

import java.sql.Connection;

public class Main {
    public static void main(String[] args) {
        Connection conn = DBConnection.getConnection();

        if (conn != null) {
            System.out.println("Connection test successful!");
        } else {
            System.out.println("Connection test failed!");
        }

        User user = new User("Soham", "test@mail.com", "1234", "PATIENT", null);

        UserDao dao = new UserDao();
        boolean result = dao.addUser(user);

        System.out.println(result ? "Inserted!" : "Failed!");
    }
}
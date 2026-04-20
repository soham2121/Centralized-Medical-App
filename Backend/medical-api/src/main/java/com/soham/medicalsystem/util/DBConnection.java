package com.soham.medicalsystem.util;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    private static String URL = System.getenv("SPRING_DATASOURCE_URL");
    private static String USER = System.getenv("SPRING_DATASOURCE_USERNAME");
    private static String PASSWORD = System.getenv("SPRING_DATASOURCE_PASSWORD");

    static {
        if (URL == null) {
            URL = "jdbc:mysql://metro.proxy.rlwy.net:38491/railway?useSSL=false&allowPublicKeyRetrieval=true";
            USER = "root";
            PASSWORD = "ntRCLYuiXdBSwXXCKuXwRdkstwfUusud";
        }
    }

    public static Connection getConnection() {
        Connection connection = null;

        try {
            connection = DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (SQLException e) {
            throw new RuntimeException("Error connecting to the database ", e);
        }

        return connection;
    }
}

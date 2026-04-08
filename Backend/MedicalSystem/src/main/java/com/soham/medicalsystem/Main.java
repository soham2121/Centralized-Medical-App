package com.soham.medicalsystem;

import com.soham.medicalsystem.dao.UserDao;
import com.soham.medicalsystem.model.User;

public class Main {
    public static void main(String[] args) {
        UserDao dao = new UserDao();

//        User user = new User("Soham", "test@mail.com", "1234", "PATIENT", null);
//        boolean result = dao.addUser(user);
//        System.out.println(result ? "Inserted!" : "Failed!");
//
//        User user2 = new User("Arjun", "test123@mail.com", "1234", "PATIENT", null);
//        boolean result2 = dao.addUser(user2);
//        System.out.println(result2 ? "Inserted!" : "Failed!");

        User gottenID = dao.getUserById(2);
        System.out.println(gottenID.getName() + " " + gottenID.getEmail());

        User gottenMail = dao.getUserByMail("test@mail.com");
        System.out.println(gottenMail.getName() + " " + gottenMail.getEmail());

        dao.updateUser(1, "Som", "newEmail@gmail.com", null);
        gottenID = dao.getUserById(1);
        System.out.println(gottenID.getName() + " " + gottenID.getEmail());

        dao.deleteUser(2);
    }
}
package com.soham.medicalsystem.controller;

import com.soham.medicalsystem.dao.UserDao;
import com.soham.medicalsystem.model.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserDao userDao = new UserDao();

    @PostMapping("/add")
    public String addUser(@RequestBody User user) {
        boolean success = userDao.addUser(user);
        return success ? "User added" : "Failed";
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable int id) {
        return userDao.getUserById(id);
    }
}
package com.soham.medicalsystem.controller;

import com.soham.medicalsystem.dao.UserDao;
import com.soham.medicalsystem.model.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userDao.getAllUsers();
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable int id) {
        boolean success = userDao.deleteUser(id);
        return success ? "User deleted" : "Failed";
    }

    @GetMapping("/doctor/{id}")
    public User getDoctorById(@PathVariable int id) {
        User user = userDao.getDocName(id);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found");
        }
        return user;
    }
}
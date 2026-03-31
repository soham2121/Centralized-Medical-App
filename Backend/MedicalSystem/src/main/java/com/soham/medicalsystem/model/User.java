package com.soham.medicalsystem.model;

public class User {
    private int userId;
    private String name;
    private String email;
    private String password;
    private String role;
    private Integer hospitalId;

    public User(){}

    public User(String name, String email, String password, String role, Integer hospitalId){
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.hospitalId = hospitalId;
    }

    public int getUserId() {
        return userId;
    }
    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }

    public Integer getHospitalId() {
        return hospitalId;
    }
    public void setHospitalId(Integer hospitalId) {
        this.hospitalId = hospitalId;
    }
}

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
} from "react-native";
import API from "../api/api";

export default function AdminScreen({ route, navigation }) {
  const { role } = route.params;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("DOCTOR");
  const [hospitalId, setHospitalId] = useState("");

  // 🔥 ROLE PROTECTION
  useEffect(() => {
    if (role !== "ADMIN") {
      Alert.alert("Access Denied", "You are not authorized");

      navigation.replace("Login"); // kick back
    }
  }, []);

  const validate = () => {
    if (!name || !email || !password) return "Fill all fields";

    if (!["DOCTOR", "LAB_TECH", "ADMIN"].includes(userRole))
      return "Invalid role";

    return null;
  };

  const addUser = async () => {
    const error = validate();
    if (error) {
      Alert.alert(error);
      return;
    }

    try {
      await API.post("/users/add", {
        name,
        email,
        password,
        role: userRole,
        hospitalId: hospitalId ? parseInt(hospitalId) : null,
      });

      Alert.alert("User added successfully");

      // reset
      setName("");
      setEmail("");
      setPassword("");
      setHospitalId("");
    } catch (err) {
      console.log(err);
      Alert.alert("Error adding user");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Admin Dashboard</Text>

      <Text>Name</Text>
      <TextInput value={name} onChangeText={setName} />

      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} />

      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} />

      <Text style={{ marginTop: 10 }}>Select Role</Text>

      <Button title="Doctor" onPress={() => setUserRole("DOCTOR")} />
      <Button title="Lab Tech" onPress={() => setUserRole("LAB_TECH")} />
      <Button title="Admin" onPress={() => setUserRole("ADMIN")} />

      <Text style={{ marginTop: 5 }}>
        Selected Role: {userRole}
      </Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Add User" onPress={addUser} />
      </View>
    </View>
  );
}
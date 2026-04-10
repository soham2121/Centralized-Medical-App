import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import API from "../api/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  console.log("API:", API);

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const { role, userId } = res.data;
      console.log("SUCCESS:", res.data);

      if (role === "PATIENT") {
        navigation.navigate("Patient", { userId, role });
      } else if (role === "DOCTOR" || role === "LAB_TECH") {
        navigation.navigate("Doctor", { userId, role });
      } else {
        navigation.navigate("Admin", { userId, role });
      }
    } catch (err) {
        console.log("ERROR FULL:", err);
        console.log("ERROR DATA:", err.response?.data);
        console.log("ERROR STATUS:", err.response?.status);
        alert("Login failed");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} />

      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />

      <Button title="Login" onPress={login} />
    </View>
  );
}
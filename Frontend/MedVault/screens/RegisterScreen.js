import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import API from "../api/api";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validate = () => {
    if (!name || !email || !password)
      return "Fill all fields";

    return null;
  };

  const register = async () => {
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
        role: "PATIENT",
        hospitalId: null,
      });

      Alert.alert("Registered successfully");

      navigation.navigate("Login");
    } catch (err) {
      console.log(err);
      Alert.alert("Registration failed");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Register</Text>

      <Text>Name</Text>
      <TextInput value={name} onChangeText={setName} />

      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} />

      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />

      <Button title="Register" onPress={register} />
    </View>
  );
}
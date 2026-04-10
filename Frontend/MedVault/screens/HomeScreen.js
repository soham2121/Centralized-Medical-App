import React from "react";
import { View, Text, Button } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      {/* APP NAME */}
      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 20 }}>
        MedVault
      </Text>

      <Text style={{ marginBottom: 40, textAlign: "center" }}>
        Secure and centralized medical records system
      </Text>

      {/* LOGIN BUTTON */}
      <View style={{ width: "80%", marginBottom: 15 }}>
        <Button
          title="Login"
          onPress={() => navigation.navigate("Login")}
        />
      </View>

      {/* REGISTER BUTTON */}
      <View style={{ width: "80%" }}>
        <Button
          title="Register"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
}
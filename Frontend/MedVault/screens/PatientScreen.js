import React, { useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import QRCode from "react-native-qrcode-svg";
import API from "../api/api";

export default function PatientScreen({ route, navigation }) {
  const { userId } = route.params;

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    try {
      setLoading(true);

      const res = await API.post("/qr/generate", {
        patientId: userId,
      });

      setToken(res.data.token);
    } catch (err) {
      console.log(err);
      alert("Failed to generate QR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Patient Dashboard
      </Text>

      <Button
        title="View Records"
        onPress={() => navigation.navigate("Records", { userId })}
      />

      <Button title="Generate QR" onPress={generateQR} />

      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

      {token && (
        <View style={{ marginTop: 30, alignItems: "center" }}>
          <Text style={{ marginBottom: 10 }}>Scan this QR:</Text>

          <QRCode value={token} size={200} />

          <Text style={{ marginTop: 20 }}>Token:</Text>
          <Text selectable style={{ fontWeight: "bold" }}>
            {token}
          </Text>

          <Text style={{ marginTop: 10, fontSize: 12, color: "gray" }}>
            (Valid for 5 minutes)
          </Text>

          <Button title="Generate New QR" onPress={generateQR} />
        </View>
      )}
    </View>
  );
}
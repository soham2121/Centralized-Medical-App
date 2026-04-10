import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import API from "../api/api";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function DoctorScreen({ route }) {
  const { userId } = route.params;

  const [token, setToken] = useState("");
  const [type, setType] = useState("BLOOD_TEST");
  const [loading, setLoading] = useState(false);

  const [scanMode, setScanMode] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // Blood test
  const [hemoglobin, setHemoglobin] = useState("");
  const [sugarLevel, setSugarLevel] = useState("");

  // Scan
  const [scanType, setScanType] = useState("");
  const [findings, setFindings] = useState("");

  // Prescription
  const [doctorNotes, setDoctorNotes] = useState("");
  const [medicines, setMedicines] = useState([]);

  // 🔥 QR SCANNER MODE
  if (scanMode) {
    if (!permission) return <Text>Requesting permission...</Text>;

    if (!permission.granted) {
      return (
        <View style={{ padding: 20 }}>
          <Text>No camera access</Text>
          <Button title="Allow Camera" onPress={requestPermission} />
        </View>
      );
    }

    return (
      <CameraView
        style={{ flex: 1 }}
        onBarcodeScanned={({ data }) => {
          setToken(data);
          setScanMode(false);
        }}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
    );
  }

  // 🟢 MEDICINE FUNCTIONS
  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", timing: "", duration: "", notes: "" },
    ]);
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const removeMedicine = (index) => {
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(updated);
  };

  // 🟢 VALIDATION
  const validateForm = () => {
    if (!token) return "Token required";

    if (type === "BLOOD_TEST") {
      if (!hemoglobin || !sugarLevel)
        return "Fill all blood test fields";
    }

    if (type === "SCAN") {
      if (!scanType || !findings)
        return "Fill all scan fields";
    }

    if (type === "PRESCRIPTION") {
      if (medicines.length === 0)
        return "Add at least one medicine";

      for (let med of medicines) {
        if (!med.name) return "Medicine name required";
      }
    }

    return null;
  };

  // 🟢 SUBMIT
  const submit = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert(error);
      return;
    }

    try {
      setLoading(true);

      let payload = {
        token,
        type,
        createdBy: userId,
      };

      if (type === "BLOOD_TEST") {
        payload.hemoglobin = parseFloat(hemoglobin);
        payload.sugarLevel = parseFloat(sugarLevel);
      }

      if (type === "SCAN") {
        payload.scanType = scanType;
        payload.findings = findings;
      }

      if (type === "PRESCRIPTION") {
        payload.doctorNotes = doctorNotes;
        payload.medicines = medicines;
      }

      await API.post("/records/add", payload);

      Alert.alert("Record added successfully");

      // 🔥 RESET FORM
      setToken("");
      setHemoglobin("");
      setSugarLevel("");
      setScanType("");
      setFindings("");
      setDoctorNotes("");
      setMedicines([]);
    } catch (err) {
      console.log(err);

      if (err.response?.data) {
        Alert.alert(err.response.data);
      } else {
        Alert.alert("Error adding record");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>
          Doctor Dashboard
        </Text>

        {/* TOKEN */}
        <Text>Token</Text>
        <TextInput value={token} onChangeText={setToken} />

        <Button title="Scan QR" onPress={() => setScanMode(true)} />

        {/* TYPE */}
        <Text style={{ marginTop: 10 }}>Select Type</Text>
        <Button title="Blood Test" onPress={() => setType("BLOOD_TEST")} />
        <Button title="Scan" onPress={() => setType("SCAN")} />
        <Button
          title="Prescription"
          onPress={() => setType("PRESCRIPTION")}
        />

        {/* BLOOD TEST */}
        {type === "BLOOD_TEST" && (
          <>
            <Text>Hemoglobin</Text>
            <TextInput value={hemoglobin} onChangeText={setHemoglobin} />

            <Text>Sugar Level</Text>
            <TextInput value={sugarLevel} onChangeText={setSugarLevel} />
          </>
        )}

        {/* SCAN */}
        {type === "SCAN" && (
          <>
            <Text>Scan Type</Text>
            <TextInput value={scanType} onChangeText={setScanType} />

            <Text>Findings</Text>
            <TextInput value={findings} onChangeText={setFindings} />
          </>
        )}

        {/* PRESCRIPTION */}
        {type === "PRESCRIPTION" && (
          <>
            <Text>Doctor Notes</Text>
            <TextInput value={doctorNotes} onChangeText={setDoctorNotes} />

            <Button title="Add Medicine" onPress={addMedicine} />

            {medicines.map((med, index) => (
              <View key={index} style={{ marginBottom: 15 }}>
                <Text>Medicine {index + 1}</Text>

                <TextInput
                  placeholder="Name"
                  value={med.name}
                  onChangeText={(val) =>
                    updateMedicine(index, "name", val)
                  }
                />

                <TextInput
                  placeholder="Dosage"
                  value={med.dosage}
                  onChangeText={(val) =>
                    updateMedicine(index, "dosage", val)
                  }
                />

                <TextInput
                  placeholder="Timing"
                  value={med.timing}
                  onChangeText={(val) =>
                    updateMedicine(index, "timing", val)
                  }
                />

                <TextInput
                  placeholder="Duration"
                  value={med.duration}
                  onChangeText={(val) =>
                    updateMedicine(index, "duration", val)
                  }
                />

                <TextInput
                  placeholder="Notes"
                  value={med.notes}
                  onChangeText={(val) =>
                    updateMedicine(index, "notes", val)
                  }
                />

                <Button
                  title="Remove"
                  onPress={() => removeMedicine(index)}
                />
              </View>
            ))}
          </>
        )}

        {/* SUBMIT */}
        <View style={{ marginTop: 20 }}>
          <Button
            title="Submit Record"
            onPress={submit}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
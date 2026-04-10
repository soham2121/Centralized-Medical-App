import React, { useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  Alert, KeyboardAvoidingView, Platform, TouchableOpacity, Modal,
} from "react-native";
import API from "../api/api";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useTheme } from "../theme/Themecontext";
import { Typography, Spacing, Radius } from "../theme";
import { Button, Input, Card, Badge, SectionHeader, PillTabs, Divider } from "../components/UI";

const RECORD_TYPES = [
  { label: '🩸 Blood Test',   value: 'BLOOD_TEST'   },
  { label: '🔬 Scan',         value: 'SCAN'          },
  { label: '💊 Prescription', value: 'PRESCRIPTION'  },
];

export default function DoctorScreen({ route }) {
  const { userId, role } = route.params;
  const { theme } = useTheme();

  const [token,   setToken]   = useState("");
  const [type,    setType]    = useState("BLOOD_TEST");
  const [loading, setLoading] = useState(false);

  const [scanMode,   setScanMode]   = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // Blood test
  const [hemoglobin, setHemoglobin] = useState("");
  const [sugarLevel, setSugarLevel] = useState("");

  // Scan
  const [scanType,  setScanType]  = useState("");
  const [findings,  setFindings]  = useState("");

  // Prescription
  const [doctorNotes, setDoctorNotes] = useState("");
  const [medicines,   setMedicines]   = useState([]);

  const isLabTech = role === "LAB_TECH";

  // ── QR Scanner ──────────────────────────────────────────────────────────────
  if (scanMode) {
    if (!permission) return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[Typography.body, { color: theme.textSecondary }]}>Requesting camera...</Text>
      </SafeAreaView>
    );
    if (!permission.granted) return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <View style={styles.permWrap}>
          <Text style={{ fontSize: 48, marginBottom: Spacing.md }}>📷</Text>
          <Text style={[Typography.h3, { color: theme.text, marginBottom: Spacing.sm }]}>Camera Access Needed</Text>
          <Text style={[Typography.bodySmall, { color: theme.textSecondary, textAlign: 'center', marginBottom: Spacing.lg }]}>
            Allow camera access to scan patient QR codes
          </Text>
          <Button title="Allow Camera" onPress={requestPermission} />
          <Button title="Cancel" onPress={() => setScanMode(false)} variant="ghost" style={{ marginTop: Spacing.sm }} />
        </View>
      </SafeAreaView>
    );
    return (
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          onBarcodeScanned={({ data }) => { setToken(data); setScanMode(false); }}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
        <View style={styles.scanOverlay}>
          <View style={[styles.scanFrame, { borderColor: theme.primary }]} />
          <Text style={[Typography.body, { color: '#fff', marginTop: Spacing.lg }]}>
            Align QR code within the frame
          </Text>
          <Button title="Cancel" onPress={() => setScanMode(false)} variant="ghost" style={{ marginTop: Spacing.md }} />
        </View>
      </View>
    );
  }

  // ── Medicine helpers ─────────────────────────────────────────────────────────
  const addMedicine = () =>
    setMedicines(p => [...p, { name: "", dosage: "", timing: "", duration: "", notes: "" }]);

  const updateMedicine = (i, field, val) =>
    setMedicines(p => p.map((m, idx) => idx === i ? { ...m, [field]: val } : m));

  const removeMedicine = (i) =>
    setMedicines(p => p.filter((_, idx) => idx !== i));

  // ── Validation ───────────────────────────────────────────────────────────────
  const validateForm = () => {
    if (!token.trim())        return "Token is required.";
    if (type === "BLOOD_TEST" && (!hemoglobin || !sugarLevel)) return "Fill all blood test fields.";
    if (type === "SCAN"       && (!scanType   || !findings))   return "Fill all scan fields.";
    if (type === "PRESCRIPTION") {
      if (medicines.length === 0) return "Add at least one medicine.";
      for (let m of medicines) if (!m.name.trim()) return "Medicine name is required.";
    }
    return null;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const submit = async () => {
    const err = validateForm();
    if (err) { Alert.alert("Validation Error", err); return; }

    setLoading(true);
    try {
      const payload = { token, type, createdBy: userId };
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
        payload.medicines   = medicines;
      }

      await API.post("/records/add", payload);
      Alert.alert("✅ Success", "Record added successfully.");

      // Reset
      setToken(""); setHemoglobin(""); setSugarLevel("");
      setScanType(""); setFindings(""); setDoctorNotes(""); setMedicines([]);
    } catch (err) {
      const msg = err.response?.data;
      Alert.alert("Error", typeof msg === "string" ? msg : "Failed to add record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[Typography.label, { color: theme.primary }]}>
                {isLabTech ? "LAB TECH PORTAL" : "DOCTOR PORTAL"}
              </Text>
              <Text style={[Typography.h1, { color: theme.text }]}>Add Record</Text>
            </View>
            <Badge label={isLabTech ? "Lab Tech" : "Doctor"} color="primary" />
          </View>

          {/* Token */}
          <Card>
            <SectionHeader title="Patient Token" subtitle="Enter or scan the patient's QR token" />
            <Input
              label="Access Token"
              value={token}
              onChangeText={setToken}
              placeholder="Enter token or scan QR..."
              inputStyle={{ fontFamily: 'monospace' }}
            />
            <Button title="📷 Scan QR Code" onPress={() => setScanMode(true)} variant="ghost" />
          </Card>

          {/* Record Type */}
          <Card>
            <SectionHeader title="Record Type" subtitle="Select what you want to add" />
            <PillTabs options={RECORD_TYPES} selected={type} onSelect={setType} />
          </Card>

          {/* Blood Test Form */}
          {type === "BLOOD_TEST" && (
            <Card>
              <SectionHeader title="🩸 Blood Test Details" />
              <Input label="Hemoglobin (g/dL)" value={hemoglobin} onChangeText={setHemoglobin} keyboardType="numeric" placeholder="e.g. 14.5" />
              <Input label="Sugar Level (mg/dL)" value={sugarLevel} onChangeText={setSugarLevel} keyboardType="numeric" placeholder="e.g. 95" />
            </Card>
          )}

          {/* Scan Form */}
          {type === "SCAN" && (
            <Card>
              <SectionHeader title="🔬 Scan Details" />
              <Input label="Scan Type" value={scanType} onChangeText={setScanType} placeholder="e.g. MRI, X-Ray, CT Scan" />
              <Input
                label="Findings"
                value={findings}
                onChangeText={setFindings}
                placeholder="Describe findings..."
                multiline
                inputStyle={{ height: 80 }}
              />
            </Card>
          )}

          {/* Prescription Form */}
          {type === "PRESCRIPTION" && (
            <Card>
              <SectionHeader title="💊 Prescription Details" />
              <Input
                label="Doctor Notes"
                value={doctorNotes}
                onChangeText={setDoctorNotes}
                placeholder="Diagnosis, instructions..."
                multiline
                inputStyle={{ height: 70 }}
              />

              <Divider />
              <View style={styles.medicinesHeader}>
                <Text style={[Typography.h3, { color: theme.text }]}>Medicines</Text>
                <TouchableOpacity
                  onPress={addMedicine}
                  style={[styles.addMedBtn, { backgroundColor: theme.primaryDim, borderColor: theme.primary + '40' }]}
                >
                  <Text style={[Typography.label, { color: theme.primary }]}>+ ADD</Text>
                </TouchableOpacity>
              </View>

              {medicines.length === 0 && (
                <Text style={[Typography.bodySmall, { color: theme.textMuted, textAlign: 'center', paddingVertical: Spacing.md }]}>
                  No medicines added yet. Tap + ADD above.
                </Text>
              )}

              {medicines.map((med, i) => (
                <View key={i} style={[styles.medCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                  <View style={styles.medCardHeader}>
                    <Text style={[Typography.label, { color: theme.primary }]}>MEDICINE {i + 1}</Text>
                    <TouchableOpacity onPress={() => removeMedicine(i)}>
                      <Text style={[Typography.label, { color: theme.danger }]}>REMOVE</Text>
                    </TouchableOpacity>
                  </View>
                  <Input label="Name"     value={med.name}     onChangeText={v => updateMedicine(i, 'name', v)}     placeholder="e.g. Paracetamol" />
                  <Input label="Dosage"   value={med.dosage}   onChangeText={v => updateMedicine(i, 'dosage', v)}   placeholder="e.g. 500mg" />
                  <Input label="Timing"   value={med.timing}   onChangeText={v => updateMedicine(i, 'timing', v)}   placeholder="e.g. After meals" />
                  <Input label="Duration" value={med.duration} onChangeText={v => updateMedicine(i, 'duration', v)} placeholder="e.g. 5 days" />
                  <Input label="Notes"    value={med.notes}    onChangeText={v => updateMedicine(i, 'notes', v)}    placeholder="Optional notes" />
                </View>
              ))}
            </Card>
          )}

          {/* Submit */}
          <Button title="Submit Record" onPress={submit} loading={loading} style={{ marginTop: Spacing.sm }} />
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:     { flex: 1 },
  scroll:   { padding: Spacing.lg },
  header:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  permWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  scanOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  scanFrame: {
    width: 220, height: 220, borderWidth: 3, borderRadius: Radius.lg,
  },
  medicinesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  addMedBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1 },
  medCard:   { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.md },
  medCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
});
import React, { useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, ActivityIndicator, Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import API from "../api/api";
import { useTheme } from "../theme/Themecontext";
import { Typography, Spacing, Radius } from "../theme";
import { Button, Input, Card, Badge, Divider, SectionHeader } from "../components/UI";

export default function PatientScreen({ route, navigation }) {
  const { userId } = route.params;
  const { theme } = useTheme();

  // QR state
  const [token,   setToken]   = useState(null);
  const [qrLoad,  setQrLoad]  = useState(false);

  // Doctor search state
  const [doctorId,     setDoctorId]     = useState("");
  const [doctorResult, setDoctorResult] = useState(null);
  const [doctorError,  setDoctorError]  = useState("");
  const [searching,    setSearching]    = useState(false);

  const generateQR = async () => {
    try {
      setQrLoad(true);
      const res = await API.post("/qr/generate", { patientId: userId });
      setToken(res.data.token);
    } catch (err) {
      Alert.alert("Error", "Failed to generate QR. Try again.");
    } finally {
      setQrLoad(false);
    }
  };

  const searchDoctor = async () => {
    if (!doctorId.trim()) { setDoctorError("Please enter a Doctor ID."); return; }
    setDoctorError("");
    setDoctorResult(null);
    setSearching(true);
    try {
      const res = await API.get(`/users/doctor/${doctorId.trim()}`);
      setDoctorResult(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setDoctorError("No doctor found with that ID.");
      } else {
        setDoctorError("Something went wrong. Try again.");
      }
    } finally {
      setSearching(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[Typography.label, { color: theme.primary }]}>PATIENT PORTAL</Text>
          <Text style={[Typography.h1, { color: theme.text }]}>Dashboard</Text>
        </View>

        {/* View Records */}
        <Card>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[Typography.h3, { color: theme.text }]}>My Medical Records</Text>
              <Text style={[Typography.bodySmall, { color: theme.textSecondary, marginTop: 2 }]}>
                View all your records sorted by date
              </Text>
            </View>
            <Button
              title="View"
              onPress={() => navigation.navigate("Records", { userId })}
              style={{ height: 40, paddingHorizontal: Spacing.md }}
            />
          </View>
        </Card>

        {/* QR Token */}
        <Card>
          <SectionHeader title="Access Token" subtitle="Generate a QR for your doctor or lab tech" />
          <Button title="Generate QR Token" onPress={generateQR} loading={qrLoad} />

          {token && (
            <View style={[styles.qrWrap, { borderColor: theme.primary + '40', backgroundColor: theme.primaryDim }]}>
              <Text style={[Typography.bodySmall, { color: theme.textSecondary, marginBottom: Spacing.md, textAlign: 'center' }]}>
                Show this to your doctor or lab technician
              </Text>
              <View style={[styles.qrBox, { backgroundColor: '#fff', padding: 12, borderRadius: Radius.md }]}>
                <QRCode value={token} size={180} />
              </View>
              <View style={[styles.tokenRow, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Text style={[Typography.mono, { color: theme.primary, textAlign: 'center' }]}>{token}</Text>
              </View>
              <Text style={[Typography.label, { color: theme.warning, textAlign: 'center', marginTop: Spacing.sm }]}>
                ⏱ Valid for 5 minutes
              </Text>
              <Button
                title="Generate New QR"
                onPress={generateQR}
                variant="ghost"
                style={{ marginTop: Spacing.md }}
              />
            </View>
          )}
        </Card>

        <Divider />

        {/* Doctor Search */}
        <SectionHeader title="🔍 Find a Doctor" subtitle="Search by Doctor ID to see their details" />
        <Card>
          <Input
            label="Doctor ID"
            value={doctorId}
            onChangeText={t => { setDoctorId(t); setDoctorError(""); setDoctorResult(null); }}
            placeholder="Enter doctor's user ID"
            keyboardType="numeric"
            error={doctorError}
          />
          <Button title="Search" onPress={searchDoctor} loading={searching} />

          {doctorResult && (
            <View style={[styles.doctorCard, { backgroundColor: theme.primaryDim, borderColor: theme.primary + '40' }]}>
              <View style={styles.doctorRow}>
                <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                  <Text style={{ fontSize: 22, color: '#fff' }}>👨‍⚕️</Text>
                </View>
                <View style={{ flex: 1, marginLeft: Spacing.md }}>
                  <Text style={[Typography.h3, { color: theme.text }]}>{doctorResult.name}</Text>
                  <Text style={[Typography.bodySmall, { color: theme.textSecondary, marginTop: 2 }]}>{doctorResult.email}</Text>
                </View>
                <Badge label="Doctor" color="primary" />
              </View>
              {doctorResult.hospitalId && (
                <Text style={[Typography.bodySmall, { color: theme.textMuted, marginTop: Spacing.sm }]}>
                  Hospital ID: {doctorResult.hospitalId}
                </Text>
              )}
            </View>
          )}
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1 },
  scroll: { padding: Spacing.lg },
  header: { marginBottom: Spacing.lg },
  row:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  qrWrap: {
    marginTop: Spacing.lg, alignItems: 'center',
    padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1,
  },
  qrBox:    { marginBottom: Spacing.md },
  tokenRow: {
    width: '100%', padding: Spacing.md,
    borderRadius: Radius.md, borderWidth: 1, marginTop: Spacing.sm,
  },
  doctorCard: {
    marginTop: Spacing.md, padding: Spacing.md,
    borderRadius: Radius.lg, borderWidth: 1,
  },
  doctorRow: { flexDirection: 'row', alignItems: 'center' },
  avatar:    { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
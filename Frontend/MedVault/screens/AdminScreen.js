import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  Alert, TouchableOpacity, RefreshControl,
} from "react-native";
import API from "../api/api";
import { useTheme } from "../theme/Themecontext";
import { Typography, Spacing, Radius } from "../theme";
import { Button, Input, Card, Badge, SectionHeader, Divider, EmptyState } from "../components/UI";

const ROLES = ["DOCTOR", "LAB_TECH", "ADMIN"];
const ROLE_META = {
  DOCTOR:   { icon: "👨‍⚕️", label: "Doctor",        color: "primary" },
  LAB_TECH: { icon: "🔬",    label: "Lab Technician", color: "accent"  },
  ADMIN:    { icon: "🛡️",   label: "Admin",          color: "danger"  },
  PATIENT:  { icon: "🧑",    label: "Patient",        color: "success" },
};

export default function AdminScreen({ route, navigation }) {
  const { role } = route.params;
  const { theme } = useTheme();

  // Role protection
  useEffect(() => {
    if (role !== "ADMIN") {
      Alert.alert("Access Denied", "You are not authorized.");
      navigation.replace("Login");
    }
  }, []);

  // Add user form
  const [name,       setName]       = useState("");
  const [email,      setEmail]       = useState("");
  const [password,   setPassword]   = useState("");
  const [userRole,   setUserRole]   = useState("DOCTOR");
  const [hospitalId, setHospitalId] = useState("");
  const [adding,     setAdding]     = useState(false);
  const [errors,     setErrors]     = useState({});

  // User list
  const [users,      setUsers]      = useState([]);
  const [loadingList,setLoadingList] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting,   setDeleting]   = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await API.get("/users/all");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Fetch users error:", err.response?.data);
    } finally {
      setLoadingList(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const onRefresh = () => { setRefreshing(true); fetchUsers(); };

  const validate = () => {
    const e = {};
    if (!name.trim())  e.name  = "Name is required.";
    if (!email.trim() || !email.includes("@")) e.email = "Valid email required.";
    if (password.length < 6) e.password = "Min. 6 characters.";
    if (!ROLES.includes(userRole)) e.role = "Invalid role.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addUser = async () => {
    if (!validate()) return;
    setAdding(true);
    try {
      await API.post("/users/add", {
        name, email, password, role: userRole,
        hospitalId: hospitalId ? parseInt(hospitalId) : null,
      });
      Alert.alert("✅ User Added", `${name} has been added as ${userRole.replace("_", " ")}.`);
      setName(""); setEmail(""); setPassword(""); setHospitalId(""); setErrors({});
      fetchUsers();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Failed to add user.");
    } finally {
      setAdding(false);
    }
  };

  const deleteUser = (userId, userName) => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete ${userName}? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive",
          onPress: async () => {
            setDeleting(userId);
            try {
              await API.delete(`/users/${userId}`);
              setUsers(p => p.filter(u => u.userId !== userId));
            } catch (err) {
              Alert.alert("Error", "Failed to delete user.");
            } finally {
              setDeleting(null);
            }
          },
        },
      ]
    );
  };

  const set = (setter, field) => (val) => {
    setter(val);
    setErrors(p => ({ ...p, [field]: "" }));
  };

  const nonPatientUsers = users.filter(u => u.role !== "PATIENT");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[Typography.label, { color: theme.danger }]}>ADMIN PANEL</Text>
            <Text style={[Typography.h1, { color: theme.text }]}>User Management</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { label: "Total",     value: nonPatientUsers.length,                          color: theme.primary },
              { label: "Doctors",   value: users.filter(u => u.role === "DOCTOR").length,   color: theme.success },
              { label: "Lab Techs", value: users.filter(u => u.role === "LAB_TECH").length, color: theme.accent  },
              { label: "Admins",    value: users.filter(u => u.role === "ADMIN").length,    color: theme.danger  },
            ].map(s => (
              <View key={s.label} style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[Typography.h2, { color: s.color }]}>{s.value}</Text>
                <Text style={[Typography.label, { color: theme.textMuted, fontSize: 9, textAlign: 'center' }]}>
                  {s.label.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>

          {/* Add User Form */}
          <Card>
            <SectionHeader title="Add New User" subtitle="Create a doctor, lab tech, or admin account" />

            {/* Role Selector */}
            <Text style={[Typography.label, { color: theme.textSecondary, marginBottom: Spacing.sm }]}>SELECT ROLE</Text>
            <View style={styles.roleRow}>
              {ROLES.map(r => {
                const meta = ROLE_META[r];
                const active = userRole === r;
                return (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setUserRole(r)}
                    style={[
                      styles.roleCard,
                      {
                        backgroundColor: active ? theme.primaryDim : theme.surfaceElevated,
                        borderColor: active ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 22 }}>{meta.icon}</Text>
                    <Text style={[Typography.label, { color: active ? theme.primary : theme.textSecondary, marginTop: 4, fontSize: 9 }]}>
                      {meta.label.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{ height: Spacing.md }} />
            <Input label="Full Name"       value={name}       onChangeText={set(setName, 'name')}           placeholder="e.g. Dr. Rahul Sharma" error={errors.name} />
            <Input label="Email Address"   value={email}      onChangeText={set(setEmail, 'email')}         placeholder="doctor@hospital.com" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
            <Input label="Password"        value={password}   onChangeText={set(setPassword, 'password')}   placeholder="Min. 6 characters" secureTextEntry error={errors.password} />
            <Input label="Hospital ID (optional)" value={hospitalId} onChangeText={setHospitalId} placeholder="e.g. 1" keyboardType="numeric" />

            <Button title={`Add ${ROLE_META[userRole].label}`} onPress={addUser} loading={adding} />
          </Card>

          <Divider />

          {/* User List */}
          <SectionHeader
            title="All Staff"
            subtitle={`${nonPatientUsers.length} staff member${nonPatientUsers.length !== 1 ? 's' : ''} registered`}
          />

          {loadingList ? (
            <EmptyState icon="⏳" title="Loading users..." />
          ) : nonPatientUsers.length === 0 ? (
            <EmptyState icon="👥" title="No staff yet" subtitle="Add doctors, lab techs, and admins above." />
          ) : (
            nonPatientUsers.map(u => {
              const meta = ROLE_META[u.role] || { icon: "👤", label: u.role, color: "primary" };
              const isDeleting = deleting === u.userId;
              return (
                <Card key={u.userId || u.email}>
                  <View style={styles.userRow}>
                    <View style={[styles.avatar, { backgroundColor: theme.primaryDim }]}>
                      <Text style={{ fontSize: 20 }}>{meta.icon}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: Spacing.md }}>
                      <Text style={[Typography.h3, { color: theme.text }]}>{u.name}</Text>
                      <Text style={[Typography.bodySmall, { color: theme.textSecondary }]}>{u.email}</Text>
                      {u.hospitalId ? (
                        <Text style={[Typography.bodySmall, { color: theme.textMuted }]}>Hospital ID: {u.hospitalId}</Text>
                      ) : null}
                    </View>
                    <View style={styles.userActions}>
                      <Badge label={meta.label} color={meta.color} />
                      <TouchableOpacity
                        onPress={() => deleteUser(u.userId, u.name)}
                        disabled={isDeleting}
                        style={[styles.deleteBtn, { backgroundColor: theme.dangerDim, borderColor: theme.danger + '40' }]}
                      >
                        <Text style={[Typography.label, { color: theme.danger, fontSize: 10 }]}>
                          {isDeleting ? "..." : "DELETE"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              );
            })
          )}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1 },
  content: { padding: Spacing.lg },
  header:  { marginBottom: Spacing.lg },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.md },
  statCard: {
    flex: 1, alignItems: 'center', paddingVertical: Spacing.md,
    borderRadius: Radius.md, borderWidth: 1,
  },
  roleRow:  { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  roleCard: {
    flex: 1, alignItems: 'center', paddingVertical: Spacing.md,
    borderRadius: Radius.lg, borderWidth: 1,
  },
  userRow:     { flexDirection: 'row', alignItems: 'center' },
  userActions: { alignItems: 'flex-end', gap: 6 },
  avatar:      { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  deleteBtn:   { paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1, marginTop: 4 },
});
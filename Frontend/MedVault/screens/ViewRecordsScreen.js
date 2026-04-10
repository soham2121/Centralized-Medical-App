import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  RefreshControl, TextInput,
} from "react-native";
import API from "../api/api";
import { useTheme } from "../theme/Themecontext";
import { Typography, Spacing, Radius } from "../theme";
import { Card, Badge, PillTabs, EmptyState, SectionHeader } from "../components/UI";

const RECORD_META = {
  BLOOD_TEST:   { icon: "🩸", label: "Blood Test",   color: "danger"  },
  SCAN:         { icon: "🔬", label: "Scan",          color: "accent"  },
  PRESCRIPTION: { icon: "💊", label: "Prescription",  color: "primary" },
};

const FILTER_OPTIONS = [
  { label: "📋 All",          value: "ALL"          },
  { label: "🩸 Blood Test",   value: "BLOOD_TEST"   },
  { label: "🔬 Scan",         value: "SCAN"         },
  { label: "💊 Prescription", value: "PRESCRIPTION" },
];

export default function ViewRecordsScreen({ route }) {
  const { userId } = route.params;
  const { theme } = useTheme();

  const [records,    setRecords]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter,     setFilter]     = useState("ALL");
  const [search,     setSearch]     = useState("");
  const [doctorNames,setDoctorNames]= useState({});

  const fetchRecords = useCallback(async () => {
    try {
      const res = await API.get(`/records/${userId}`);
      const data = Array.isArray(res.data) ? res.data : [];
      // Sort newest first
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecords(data);
      // Fetch doctor names for all unique createdBy ids
      const doctorIds = [...new Set(data.map(r => r.createdBy).filter(Boolean))];
      fetchDoctorNames(doctorIds);
    } catch (err) {
      console.log("Fetch records error:", err.response?.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  const fetchDoctorNames = async (ids) => {
    const results = {};
    await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await API.get(`/users/doctor/${id}`);
          results[id] = res.data.name;
        } catch {
          results[id] = `Dr. #${id}`;
        }
      })
    );
    setDoctorNames(prev => ({ ...prev, ...results }));
  };

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const onRefresh = () => { setRefreshing(true); fetchRecords(); };

  const filtered = records.filter(r => {
    const matchFilter = filter === "ALL" || r.recordType === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.recordType?.toLowerCase().includes(q) ||
      r.scanType?.toLowerCase().includes(q) ||
      r.findings?.toLowerCase().includes(q) ||
      r.doctorNotes?.toLowerCase().includes(q) ||
      doctorNames[r.createdBy]?.toLowerCase().includes(q) ||
      r.date?.includes(q);
    return matchFilter && matchSearch;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown date";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[Typography.label, { color: theme.primary }]}>PATIENT RECORDS</Text>
            <Text style={[Typography.h1, { color: theme.text }]}>My Records</Text>
          </View>

          {/* Search bar */}
          <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
            <Text style={{ fontSize: 16, marginRight: Spacing.sm }}>🔍</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search records, doctors, findings..."
              placeholderTextColor={theme.textMuted}
              style={[Typography.body, { flex: 1, color: theme.text }]}
            />
          </View>

          {/* Filter pills */}
          <PillTabs options={FILTER_OPTIONS} selected={filter} onSelect={setFilter} />

          {/* Count */}
          <SectionHeader
            title="Results"
            subtitle={`${filtered.length} record${filtered.length !== 1 ? 's' : ''} found`}
          />

          {/* Records */}
          {loading ? (
            <EmptyState icon="⏳" title="Loading records..." />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="📂"
              title="No records found"
              subtitle={search ? "Try a different search term." : "Records added by your doctor will appear here."}
            />
          ) : (
            filtered.map((record, index) => {
              const meta = RECORD_META[record.recordType] || { icon: "📋", label: record.recordType, color: "primary" };
              const doctorName = record.createdBy ? (doctorNames[record.createdBy] || `Dr. #${record.createdBy}`) : null;

              return (
                <Card key={index}>
                  {/* Record header */}
                  <View style={styles.recordHeader}>
                    <View style={[styles.recordIcon, { backgroundColor: theme.primaryDim }]}>
                      <Text style={{ fontSize: 22 }}>{meta.icon}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: Spacing.md }}>
                      <Text style={[Typography.h3, { color: theme.text }]}>{meta.label}</Text>
                      <Text style={[Typography.bodySmall, { color: theme.textSecondary, marginTop: 2 }]}>
                        {formatDate(record.date)}
                      </Text>
                    </View>
                    <Badge label={meta.label} color={meta.color} />
                  </View>

                  {/* Doctor */}
                  {doctorName && (
                    <View style={[styles.doctorBadge, { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }]}>
                      <View style = {{borderRadius: Radius.sm, borderWidth: 1, backgroundColor: theme.surfaceElevated, borderColor: theme.border, paddingHorizontal: 10, paddingVertical: 5}}>
                        <Text style={[Typography.bodySmall, { color: theme.textSecondary, fontWeight: "bold" }]}>
                          👨‍⚕️ {doctorName}
                        </Text>
                      </View>
                      <View style = {{borderRadius: Radius.sm, borderWidth: 1, backgroundColor: theme.surfaceElevated, borderColor: theme.border, paddingHorizontal: 10, paddingVertical: 5}}>
                        <Text style={[Typography.bodySmall, { color: theme.textSecondary }]}>
                          Doctor Id: {userId}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Blood Test details */}
                  {record.recordType === "BLOOD_TEST" && (
                    <View style={styles.detailsGrid}>
                      <DetailItem theme={theme} label="Hemoglobin" value={`${record.hemoglobin} g/dL`} />
                      <DetailItem theme={theme} label="Sugar Level" value={`${record.sugarLevel} mg/dL`} />
                    </View>
                  )}

                  {/* Scan details */}
                  {record.recordType === "SCAN" && (
                    <View style={styles.detailsCol}>
                      <DetailItem theme={theme} label="Scan Type" value={record.scanType} />
                      <DetailItem theme={theme} label="Findings"  value={record.findings} />
                    </View>
                  )}

                  {/* Prescription details */}
                  {record.recordType === "PRESCRIPTION" && (
                    <View style={styles.detailsCol}>
                      {record.doctorNotes ? (
                        <DetailItem theme={theme} label="Doctor Notes" value={record.doctorNotes} />
                      ) : null}
                      {record.medicines?.length > 0 && (
                        <View style={{ marginTop: Spacing.sm }}>
                          <Text style={[Typography.label, { color: theme.textSecondary, marginBottom: Spacing.sm }]}>
                            MEDICINES ({record.medicines.length})
                          </Text>
                          {record.medicines.map((med, i) => (
                            <View key={i} style={[styles.medRow, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                              <Text style={[Typography.body, { color: theme.text, fontWeight: '600' }]}>{med.name}</Text>
                              <View style={styles.medDetails}>
                                {med.dosage   && <MedChip theme={theme} text={med.dosage} />}
                                {med.timing   && <MedChip theme={theme} text={med.timing} />}
                                {med.duration && <MedChip theme={theme} text={med.duration} />}
                              </View>
                              {med.notes ? (
                                <Text style={[Typography.bodySmall, { color: theme.textMuted, marginTop: 4 }]}>{med.notes}</Text>
                              ) : null}
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
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

function DetailItem({ theme, label, value }) {
  return (
    <View style={{ marginBottom: Spacing.sm }}>
      <Text style={[Typography.label, { color: theme.textSecondary, marginBottom: 2 }]}>{label.toUpperCase()}</Text>
      <Text style={[Typography.body, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

function MedChip({ theme, text }) {
  return (
    <View style={[{ backgroundColor: theme.primaryDim, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 }]}>
      <Text style={[Typography.label, { color: theme.primary, fontSize: 10 }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1 },
  content: { padding: Spacing.lg },
  header:  { marginBottom: Spacing.lg },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, height: 48,
    marginBottom: Spacing.md,
  },
  recordHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  recordIcon:   { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  doctorBadge:  { paddingHorizontal: Spacing.sm, paddingVertical: 5, alignSelf: 'flex-start', marginBottom: Spacing.sm },
  detailsGrid:  { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.sm },
  detailsCol:   { marginTop: Spacing.sm },
  medRow:       { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.sm, marginBottom: Spacing.sm },
  medDetails:   { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
});
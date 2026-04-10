import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import API from "../api/api";

export default function ViewRecordsScreen({ route }) {
  const { userId } = route.params;

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const res = await API.get(`/records/${userId}`);
      setRecords(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        My Medical Records
      </Text>

      {records.length === 0 && <Text>No records found</Text>}

      {records.map((record, index) => (
        <View
          key={index}
          style={{
            marginBottom: 20,
            padding: 15,
            borderWidth: 1,
            borderRadius: 10,
          }}
        >
          <Text>Type: {record.recordType}</Text>
          <Text>Date: {record.date}</Text>

          {/* BLOOD TEST */}
          {record.recordType === "BLOOD_TEST" && (
            <>
              <Text>Hemoglobin: {record.hemoglobin}</Text>
              <Text>Sugar Level: {record.sugarLevel}</Text>
            </>
          )}

          {/* SCAN */}
          {record.recordType === "SCAN" && (
            <>
              <Text>Scan Type: {record.scanType}</Text>
              <Text>Findings: {record.findings}</Text>
            </>
          )}

          {/* PRESCRIPTION */}
          {record.recordType === "PRESCRIPTION" && (
            <>
              <Text>Doctor Notes: {record.doctorNotes}</Text>

              <Text style={{ marginTop: 10, marginBottom: 10 }}>Medicines:</Text>

              {record.medicines?.map((med, i) => (
                <View key={i} style={{ 
                    marginLeft: 10,
                    marginBottom: 10, 
                    padding: 8,        
                    borderWidth: 0.5,  
                    borderRadius: 5, 
                }}>
                  <Text>Name: {med.name}</Text>
                  <Text>Dosage: {med.dosage}</Text>
                  <Text>Timing: {med.timing}</Text>
                  <Text>Duration: {med.duration}</Text>
                  <Text>Notes: {med.notes}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
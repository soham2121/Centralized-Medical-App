import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../theme/Themecontext";
import { Typography, Spacing } from "../theme";
import { Input } from "../components/UI";

export default function ProfileScreen() {
    const { theme } = useTheme();

    const [bloodGroup, setBloodGroup] = useState("");
    const [allergies, setAllergies] = useState("");
    const [contact, setContact] = useState("");

    useEffect(() => {
        const loadData = async () => {
        const data = await AsyncStorage.getItem("emergencyProfile");
        if (data) {
            const parsed = JSON.parse(data);
            setBloodGroup(parsed.bloodGroup || "");
            setAllergies(parsed.allergies || "");
            setContact(parsed.contact || "");
        }
        };
        loadData();
    }, []);

    const saveProfile = async () => {
        const data = {
        bloodGroup,
        allergies,
        contact,
        };

        await AsyncStorage.setItem("emergencyProfile", JSON.stringify(data));
        alert("Saved successfully");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, padding: Spacing.lg }}>
        <Text style={[Typography.h2, { color: theme.text, marginBottom: Spacing.lg }]}>
            Emergency Profile
        </Text>

        <Input label="Blood Group" value={bloodGroup} onChangeText={setBloodGroup} />
        <Input label="Allergies" value={allergies} onChangeText={setAllergies} />
        <Input label="Emergency Contact" value={contact} onChangeText={setContact} />

        <Button title="Save" onPress={saveProfile} style={{ marginTop: Spacing.md }} />
        </SafeAreaView>
    );
}
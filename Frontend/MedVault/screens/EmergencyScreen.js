import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useTheme } from "../theme/Themecontext";
import { Typography, Spacing, Radius } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function EmergencyScreen() {
    const { theme } = useTheme();
    const [data, setData] = useState(null);

    useEffect(() => {
        const load = async () => {
            const stored = await AsyncStorage.getItem("emergencyProfile");
            if (stored){ setData(JSON.parse(stored));}
        };
        load();
    }, []);

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <View style={styles.container}>

            <Text style={[Typography.h2, { color: theme.text, marginBottom: Spacing.lg }]}>
            🚨 Emergency Profile
            </Text>

            <View style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.border }
            ]}>

            <Text style={[Typography.body, { color: theme.text }]}>
                Blood Group: {data?.bloodGroup || "Not set"}
            </Text>

            <Text style={[Typography.body, { color: theme.text }]}>
                Allergies: {data?.allergies || "Not set"}
            </Text>

            <Text style={[Typography.body, { color: theme.text }]}>
                Emergency Contact: {data?.contact || "Not set"}
            </Text>

            </View>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: Spacing.lg,
    },
    card: {
        borderRadius: Radius.lg,
        borderWidth: 1,
        padding: Spacing.lg,
    },
});
import React from "react";
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Switch,
} from "react-native";
import { useTheme } from "../theme/Themecontext";
import { Typography, Spacing, Radius } from "../theme";
import { Card, Divider, Button } from "../components/UI";

function SettingRow({ icon, title, subtitle, right, onPress, theme }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper onPress={onPress} activeOpacity={0.7} style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: theme.primaryDim }]}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: Spacing.md }}>
        <Text style={[Typography.body, { color: theme.text, fontWeight: '500' }]}>{title}</Text>
        {subtitle ? <Text style={[Typography.bodySmall, { color: theme.textSecondary, marginTop: 2 }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </Wrapper>
  );
}

export default function SettingsScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[Typography.label, { color: theme.primary }]}>PREFERENCES</Text>
          <Text style={[Typography.h1, { color: theme.text }]}>Settings</Text>
        </View>

        <Text style={[Typography.label, { color: theme.textMuted, marginBottom: Spacing.sm }]}>MY PROFILE</Text>
        <Card style={{ marginBottom: Spacing.lg }}>
          <Button
            title="Edit Emergency Profile"
            onPress={() => navigation.navigate("Profile")}
          />
        </Card>

        {/* Appearance */}
        <Text style={[Typography.label, { color: theme.textMuted, marginBottom: Spacing.sm }]}>APPEARANCE</Text>
        <Card style={{ marginBottom: Spacing.lg }}>
          <SettingRow
            theme={theme}
            icon={isDark ? "🌙" : "☀️"}
            title="Dark Mode"
            subtitle={isDark ? "Currently using dark theme" : "Currently using light theme"}
            right={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                thumbColor={isDark ? theme.primary : theme.textMuted}
              />
            }
          />
        </Card>

        {/* App Info */}
        <Text style={[Typography.label, { color: theme.textMuted, marginBottom: Spacing.sm }]}>ABOUT</Text>
        <Card style={{ marginBottom: Spacing.lg }}>
          <SettingRow
            theme={theme}
            icon="⚕"
            title="MedVault"
            subtitle="Centralized Medical Records System"
          />
          <Divider style={{ marginHorizontal: 0 }} />
          <SettingRow
            theme={theme}
            icon="📱"
            title="Version"
            subtitle="Built with React Native + Expo"
            right={<Text style={[Typography.bodySmall, { color: theme.textMuted }]}>v1.0.0</Text>}
          />
          <Divider style={{ marginHorizontal: 0 }} />
          <SettingRow
            theme={theme}
            icon="🏥"
            title="Backend"
            subtitle="Spring Boot + MySQL"
            right={<Text style={[Typography.bodySmall, { color: theme.success }]}>Connected</Text>}
          />
          <Divider style={{ marginHorizontal: 0 }} />
          <SettingRow
            theme={theme}
            icon="🔒"
            title="Security"
            subtitle="Role-based access control enabled"
          />
        </Card>

        {/* OOP Features */}
        <Text style={[Typography.label, { color: theme.textMuted, marginBottom: Spacing.sm }]}>OOP IMPLEMENTATION</Text>
        <Card>
          {[
            { icon: "🧩", title: "Inheritance",    subtitle: "MedicalRecord → BloodTest, Scan, Prescription" },
            { icon: "🔐", title: "Encapsulation",  subtitle: "Getters/setters on all model classes"          },
            { icon: "🔄", title: "Polymorphism",   subtitle: "Method overriding across record types"         },
            { icon: "📐", title: "Abstraction",    subtitle: "Abstract MedicalRecord base class"             },
            { icon: "🗄️", title: "JDBC + MySQL",   subtitle: "DAO layer with full CRUD operations"          },
          ].map((item, i, arr) => (
            <View key={item.title}>
              <SettingRow theme={theme} {...item} />
              {i < arr.length - 1 && <Divider style={{ marginHorizontal: 0 }} />}
            </View>
          ))}
        </Card>

        <Text style={[Typography.bodySmall, { color: theme.textMuted, textAlign: 'center', marginTop: Spacing.xl }]}>
          MedVault © 2025 · Assignment Project
        </Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1 },
  scroll: { padding: Spacing.lg },
  header: { marginBottom: Spacing.lg },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  iconWrap: {
    width: 38, height: 38, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
});
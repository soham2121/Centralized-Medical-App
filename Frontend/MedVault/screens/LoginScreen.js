import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, Animated,
  KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import API from "../api/api";
import { useTheme } from "../theme/Themecontext";
import { Typography, Spacing, Radius } from "../theme";
import { Button, Input } from "../components/UI";

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const login = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      const { role, userId } = res.data;

      if (role === "PATIENT") {
        navigation.replace("Patient", { userId, role });
      } else if (role === "DOCTOR" || role === "LAB_TECH") {
        navigation.replace("Doctor", { userId, role });
      } else {
        navigation.replace("Admin", { userId, role });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data;
      setError(typeof msg === "string" ? msg : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.blob, { backgroundColor: theme.primary + '15' }]} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <Animated.View style={[styles.logoWrap, { opacity: fadeAnim }]}>
            <View style={[styles.logoCircle, { backgroundColor: theme.primary }]}>
              <Text style={styles.logoIcon}>⚕</Text>
            </View>
            <Text style={[Typography.display, { color: theme.text, marginTop: Spacing.md }]}>
              Med<Text style={{ color: theme.primary }}>Vault</Text>
            </Text>
          </Animated.View>

          {/* Form card */}
          <Animated.View
            style={[
              styles.card,
              { backgroundColor: theme.surface, borderColor: theme.border, opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={[Typography.h2, { color: theme.text, marginBottom: 4 }]}>Welcome back</Text>
            <Text style={[Typography.bodySmall, { color: theme.textSecondary, marginBottom: Spacing.lg }]}>
              Sign in to access your records
            </Text>

            <Input
              label="Email Address"
              value={email}
              onChangeText={t => { setEmail(t); setError(""); }}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={t => { setPassword(t); setError(""); }}
              placeholder="••••••••"
              secureTextEntry
            />

            {error ? (
              <View style={[styles.errorBox, { backgroundColor: theme.dangerDim, borderColor: theme.danger + '40' }]}>
                <Text style={[Typography.bodySmall, { color: theme.danger }]}>⚠ {error}</Text>
              </View>
            ) : null}

            <Button title="Sign In" onPress={login} loading={loading} style={{ marginTop: Spacing.sm }} />

            <Button
              title="Back to Home"
              onPress={() => navigation.goBack()}
              variant="ghost"
              style={{ marginTop: Spacing.sm }}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1 },
  blob:   { position: 'absolute', width: 280, height: 280, borderRadius: 140, top: -80, right: -80 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xl, justifyContent: 'center' },
  logoWrap:   { alignItems: 'center', marginBottom: Spacing.xl },
  logoCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  logoIcon:   { fontSize: 32, color: '#fff' },
  card: {
    borderRadius: Radius.xl, borderWidth: 1, padding: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12, shadowRadius: 20, elevation: 6,
  },
  errorBox: {
    padding: Spacing.md, borderRadius: Radius.md,
    borderWidth: 1, marginBottom: Spacing.md,
  },
});
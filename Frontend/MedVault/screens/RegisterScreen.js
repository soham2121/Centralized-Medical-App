import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, StyleSheet, SafeAreaView,
  Animated, KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import API from "../api/api";
import { useTheme } from "../theme/Themecontext";
import { Typography, Spacing, Radius } from "../theme";
import { Button, Input } from "../components/UI";

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
  const [name,     setName]     = useState("");
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

  const validate = () => {
    if (!name.trim())     return "Name is required.";
    if (!email.trim() || !email.includes("@")) return "Valid email is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const register = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      await API.post("/users/add", { name, email, password, role: "PATIENT", hospitalId: null });
      navigation.replace("Login");
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data;
      setError(typeof msg === "string" ? msg : "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.blob, { backgroundColor: theme.accent + '12' }]} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <Animated.View style={[styles.logoWrap, { opacity: fadeAnim }]}>
            <View style={[styles.logoCircle, { backgroundColor: theme.primary }]}>
              <Text style={styles.logoIcon}>⚕</Text>
            </View>
            <Text style={[Typography.display, { color: theme.text, marginTop: Spacing.md }]}>
              Med<Text style={{ color: theme.primary }}>Vault</Text>
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              { backgroundColor: theme.surface, borderColor: theme.border, opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={[Typography.h2, { color: theme.text, marginBottom: 4 }]}>Create Account</Text>
            <Text style={[Typography.bodySmall, { color: theme.textSecondary, marginBottom: Spacing.lg }]}>
              Register as a patient to get started
            </Text>

            <Input
              label="Full Name"
              value={name}
              onChangeText={t => { setName(t); setError(""); }}
              placeholder="Your full name"
              autoCapitalize="words"
            />
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
              placeholder="Min. 6 characters"
              secureTextEntry
            />

            {error ? (
              <View style={[styles.errorBox, { backgroundColor: theme.dangerDim, borderColor: theme.danger + '40' }]}>
                <Text style={[Typography.bodySmall, { color: theme.danger }]}>⚠ {error}</Text>
              </View>
            ) : null}

            <Button title="Create Account" onPress={register} loading={loading} style={{ marginTop: Spacing.sm }} />
            <Button title="Back to Login" onPress={() => navigation.goBack()} variant="ghost" style={{ marginTop: Spacing.sm }} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1 },
  blob:   { position: 'absolute', width: 260, height: 260, borderRadius: 130, bottom: 60, left: -80 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xl, justifyContent: 'center' },
  logoWrap:   { alignItems: 'center', marginBottom: Spacing.xl },
  logoCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  logoIcon:   { fontSize: 32, color: '#fff' },
  card: {
    borderRadius: Radius.xl, borderWidth: 1, padding: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12, shadowRadius: 20, elevation: 6,
  },
  errorBox: { padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, marginBottom: Spacing.md },
});
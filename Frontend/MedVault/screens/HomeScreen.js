import React, { useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, SafeAreaView,
  Animated, TouchableOpacity,
} from "react-native";
import { useTheme } from "../theme/Themecontext";
import { Typography, Spacing, Radius } from "../theme";
import { Button } from "../components/UI";

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 55, friction: 10, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, tension: 45, friction: 8,  useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* Background blobs */}
      <View style={[styles.blob1, { backgroundColor: theme.primary + '15' }]} />
      <View style={[styles.blob2, { backgroundColor: theme.accent  + '10' }]} />

      <View style={styles.content}>
        {/* Logo */}
        <Animated.View style={[styles.logoWrap, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}>
          <View style={[styles.logoRing, { borderColor: theme.primary + '50' }]}>
            <Animated.View style={[styles.logoPulse, { backgroundColor: theme.primary + '20', transform: [{ scale: pulseAnim }] }]} />
            <View style={[styles.logoCircle, { backgroundColor: theme.primary }]}>
              <Text style={styles.logoIcon}>⚕</Text>
            </View>
          </View>

          <Text style={[Typography.display, { color: theme.text, marginTop: Spacing.lg }]}>
            Med<Text style={{ color: theme.primary }}>Vault</Text>
          </Text>
          <Text style={[Typography.bodySmall, { color: theme.textSecondary, letterSpacing: 2, marginTop: 6 }]}>
            CENTRALIZED MEDICAL RECORDS
          </Text>
        </Animated.View>

        {/* Tagline card */}
        <Animated.View
          style={[
            styles.taglineCard,
            { backgroundColor: theme.surface, borderColor: theme.border, opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={[Typography.bodySmall, { color: theme.textSecondary, textAlign: 'center', lineHeight: 20 }]}>
            Secure, centralized access to your medical records — anytime, anywhere across India.
          </Text>
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={[styles.btnGroup, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Button
            title="Login"
            onPress={() => navigation.navigate("Login")}
            style={{ marginBottom: Spacing.md }}
          />
          <Button
            title="Register as Patient"
            onPress={() => navigation.navigate("Register")}
            variant="ghost"
          />
          <Button
            title="Emergency Card"
            onPress={() => navigation.navigate("Emergency")}
            style={{ marginTop: Spacing.md, backgroundColor: 'red'}}
          />
        </Animated.View>

        {/* Feature pills */}
        <Animated.View style={[styles.pillRow, { opacity: fadeAnim }]}>
          {['🔒 Secure', '📋 Centralized', '⚡ Real-time'].map(f => (
            <View key={f} style={[styles.featurePill, { backgroundColor: theme.primaryDim, borderColor: theme.primary + '30' }]}>
              <Text style={[Typography.label, { color: theme.primary, fontSize: 10 }]}>{f}</Text>
            </View>
          ))}
        </Animated.View>
      </View>

      <Text style={[Typography.bodySmall, { color: theme.textMuted, textAlign: 'center', paddingBottom: Spacing.lg }]}>
        MedVault © 2025
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1 },
  blob1:   { position: 'absolute', width: 320, height: 320, borderRadius: 160, top: -100, right: -100 },
  blob2:   { position: 'absolute', width: 220, height: 220, borderRadius: 110, bottom: 80, left: -80 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.lg },
  logoWrap:  { alignItems: 'center', marginBottom: Spacing.xl },
  logoRing:  { width: 100, height: 100, borderRadius: 50, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  logoPulse: { position: 'absolute', width: 100, height: 100, borderRadius: 50 },
  logoCircle:{ width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center' },
  logoIcon:  { fontSize: 36, color: '#fff' },
  taglineCard: {
    borderRadius: Radius.lg, borderWidth: 1,
    padding: Spacing.md, marginBottom: Spacing.xl,
  },
  btnGroup: { marginBottom: Spacing.xl },
  pillRow:  { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  featurePill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.full, borderWidth: 1 },
});
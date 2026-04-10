import React, { useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet, Animated,
} from 'react-native';
import { useTheme } from '../theme/Themecontext';
import { Typography, Spacing, Radius } from '../theme';

// ── Button ────────────────────────────────────────────────────────────────────
export function Button({ title, onPress, loading, variant = 'primary', style, disabled }) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const bg =
    variant === 'primary' ? theme.primary :
    variant === 'danger'  ? theme.danger :
    variant === 'success' ? theme.success :
    variant === 'ghost'   ? 'transparent' :
    theme.surfaceElevated;

  const textColor = variant === 'ghost' ? theme.textSecondary : '#fff';
  const borderColor = variant === 'ghost' ? theme.border : 'transparent';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={loading || disabled}
        activeOpacity={1}
        style={[
          styles.btn,
          { backgroundColor: bg, borderColor, borderWidth: variant === 'ghost' ? 1 : 0, opacity: disabled ? 0.5 : 1 },
          style,
        ]}
      >
        {loading
          ? <ActivityIndicator color="#fff" size="small" />
          : <Text style={[Typography.body, { color: textColor, fontWeight: '600' }]}>{title}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, error, style, inputStyle, ...props }) {
  const { theme } = useTheme();
  return (
    <View style={[{ marginBottom: Spacing.md }, style]}>
      {label && (
        <Text style={[Typography.label, { color: theme.textSecondary, marginBottom: Spacing.sm }]}>
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor={theme.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBg,
            borderColor: error ? theme.danger : theme.border,
            color: theme.text,
          },
          inputStyle,
        ]}
        {...props}
      />
      {error ? (
        <Text style={[Typography.bodySmall, { color: theme.danger, marginTop: 4 }]}>{error}</Text>
      ) : null}
    </View>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, style]}>
      {children}
    </View>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ label, color }) {
  const { theme } = useTheme();
  const bg =
    color === 'primary' ? theme.primaryDim :
    color === 'danger'  ? theme.dangerDim :
    color === 'accent'  ? theme.accentDim :
    color === 'success' ? theme.successDim :
    theme.surfaceElevated;
  const fg =
    color === 'primary' ? theme.primary :
    color === 'danger'  ? theme.danger :
    color === 'accent'  ? theme.accent :
    color === 'success' ? theme.success :
    theme.textSecondary;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[Typography.label, { color: fg, fontSize: 10 }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ style }) {
  const { theme } = useTheme();
  return <View style={[{ height: 1, backgroundColor: theme.border, marginVertical: Spacing.md }, style]} />;
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }) {
  const { theme } = useTheme();
  return (
    <View style={styles.emptyState}>
      <Text style={{ fontSize: 40 }}>{icon}</Text>
      <Text style={[Typography.h3, { color: theme.text, marginTop: Spacing.md, textAlign: 'center' }]}>{title}</Text>
      {subtitle ? (
        <Text style={[Typography.bodySmall, { color: theme.textSecondary, textAlign: 'center', marginTop: 6 }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle }) {
  const { theme } = useTheme();
  return (
    <View style={{ marginBottom: Spacing.md }}>
      <Text style={[Typography.h3, { color: theme.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[Typography.bodySmall, { color: theme.textSecondary, marginTop: 2 }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

// ── Pill Tabs ─────────────────────────────────────────────────────────────────
export function PillTabs({ options, selected, onSelect }) {
  const { theme } = useTheme();
  return (
    <View style={styles.pillRow}>
      {options.map(opt => {
        const active = selected === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={[
              styles.pill,
              {
                backgroundColor: active ? theme.primary : theme.surface,
                borderColor: active ? theme.primary : theme.border,
              },
            ]}
          >
            <Text style={[Typography.label, { color: active ? '#fff' : theme.textSecondary, fontSize: 11 }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  input: {
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: 15,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.md,
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
});
import React from 'react';
import { TextInput, View, Text, StyleSheet, Platform } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';

export default function Input({
  label,
  error,
  style,
  containerStyle,
  secureTextEntry,
  ...props
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          secureTextEntry && styles.secureInput,
          style
        ]}
        placeholderTextColor={colors.textLight}
        secureTextEntry={secureTextEntry}
        autoCorrect={false}
        autoComplete="off"
        textContentType={secureTextEntry ? 'password' : 'none'}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.text,
    minHeight: 44,
    textAlignVertical: 'center',
    includeFontPadding: false,
    ...Platform.select({
      ios: {
        paddingTop: spacing.sm,
        paddingBottom: spacing.sm,
      },
      android: {
        paddingTop: spacing.sm - 2,
        paddingBottom: spacing.sm - 2,
        textAlignVertical: 'center',
      },
    }),
  },
  inputError: {
    borderColor: colors.error,
  },
  secureInput: {
    // Remove special font styling for password fields to avoid display issues
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: 0,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
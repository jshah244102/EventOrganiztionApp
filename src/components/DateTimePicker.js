import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, borderRadius } from '../theme/colors';

export default function CustomDateTimePicker({
  label,
  value,
  onChange,
  mode = 'date',
  placeholder,
  error,
  containerStyle,
}) {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const formatDate = (date) => {
    if (!date) return '';
    if (mode === 'date') {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    if (selectedDate) {
      setTempDate(selectedDate);
      if (Platform.OS === 'android') {
        onChange(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setShow(false);
  };

  const handleCancel = () => {
    setTempDate(value || new Date());
    setShow(false);
  };

  const displayValue = value ? formatDate(value) : placeholder;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[styles.input, error && styles.inputError]}
        onPress={() => setShow(true)}
      >
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {displayValue}
        </Text>
        <Text style={styles.icon}>
          {mode === 'date' ? '📅' : '🕐'}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {show && Platform.OS === 'ios' && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={show}
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={styles.modalButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  Select {mode === 'date' ? 'Date' : 'Time'}
                </Text>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={[styles.modalButton, styles.confirmButton]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode={mode}
                display="spinner"
                onChange={handleDateChange}
                style={styles.picker}
              />
            </View>
          </View>
        </Modal>
      )}

      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={tempDate}
          mode={mode}
          display="default"
          onChange={handleDateChange}
        />
      )}
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
    backgroundColor: colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  placeholderText: {
    color: colors.textLight,
  },
  icon: {
    fontSize: 18,
    marginLeft: spacing.sm,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingBottom: 34, // Safe area for iOS
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  modalButton: {
    fontSize: 16,
    color: colors.primary,
  },
  confirmButton: {
    fontWeight: '600',
  },
  picker: {
    backgroundColor: colors.surface,
  },
});
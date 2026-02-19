import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { colors, spacing, fontSize } from '../theme';

interface SelectProps {
  label: string;
  value: string;
  placeholder: string;
  items: { id: number | string; name: string }[];
  onSelect: (item: any) => void;
  loading?: boolean;
  disabled?: boolean;
}

export function SelectGroup({ label, value, placeholder, items, onSelect, loading, disabled }: SelectProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginBottom: spacing.l }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.selectButton, disabled && { backgroundColor: '#F3F4F6', opacity: 0.7 }]}
        onPress={() => !disabled && setVisible(true)}
        disabled={disabled}
      >
        <Text style={[styles.selectButtonText, !value && { color: colors.textLight }]}>
          {value || placeholder}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          !disabled && <FontAwesome6 name="chevron-down" size={16} color={colors.textLight} iconStyle="solid" />
        )}
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione {label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <FontAwesome6 name="xmark" size={24} color={colors.text} iconStyle="solid" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSize.m,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  selectButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: fontSize.m,
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: spacing.m,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
    paddingBottom: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.l,
    fontWeight: 'bold',
    color: colors.primary,
  },
  modalItem: {
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemText: {
    fontSize: fontSize.m,
    color: colors.text,
  }
});

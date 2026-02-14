import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, fontSize } from '../../theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<StackNavigationProp<any>>();

  function handleEdit() {
    const userType = user?.role === 'professor' ? 'teacher' : 'student';
    navigation.navigate('UserForm', { id: user?.id, userType });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{user?.name || 'Usuário'}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || 'email@exemplo.com'}</Text>

        <Text style={styles.label}>Tipo:</Text>
        <Text style={styles.value}>{user?.role === 'professor' ? 'Professor' : 'Aluno'}</Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.editButtonText}>Editar Informações</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.m,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.l,
    marginTop: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing.m,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: fontSize.s,
    color: colors.textLight,
    marginBottom: 4,
  },
  value: {
    fontSize: fontSize.m,
    color: colors.text,
    fontWeight: '500',
    marginBottom: spacing.m,
  },
  editButton: {
    backgroundColor: colors.primary,
    padding: spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: fontSize.m,
  },
  logoutButton: {
    backgroundColor: '#FFE5E5',
    padding: spacing.m,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: colors.error,
    fontWeight: 'bold',
    fontSize: fontSize.m,
  }
});

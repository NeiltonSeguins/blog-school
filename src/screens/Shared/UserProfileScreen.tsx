import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import api from '../../services/api';
import { colors, spacing, fontSize } from '../../theme';
import { User } from '../../types';

interface Props {
  route: RouteProp<any, any>;
}

export default function UserProfileScreen({ route }: Props) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { userId } = route.params as { userId: number };

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [userId]);

  async function loadUser() {
    try {
      const response = await api.get(`/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Usuário não encontrado.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isProfessor = user.role === 'professor';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <FontAwesome6 name="arrow-left" size={24} color={colors.primary} iconStyle="solid" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil do {isProfessor ? 'Professor' : 'Aluno'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <FontAwesome6 name={isProfessor ? "chalkboard-user" : "user-graduate"} size={64} color={colors.primary} iconStyle="solid" />
        </View>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.tagContainer}>
          <View style={[styles.tag, isProfessor ? styles.tagProfessor : styles.tagStudent]}>
            <Text style={styles.tagText}>{isProfessor ? 'PROFESSOR' : 'ALUNO'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.bioText}>
            {user.bio || "Este usuário ainda não adicionou uma bio."}
          </Text>
        </View>

        {isProfessor && user.subject && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disciplina</Text>
            <Text style={styles.infoText}>{user.subject}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.m,
  },
  errorText: {
    fontSize: fontSize.m,
    color: colors.text,
    marginBottom: spacing.m,
  },
  backButton: {
    padding: spacing.m,
  },
  backButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    height: 56,
  },
  headerButton: {
    padding: spacing.s,
  },
  headerTitle: {
    fontSize: fontSize.l,
    fontWeight: 'bold',
    color: colors.primary,
  },
  content: {
    alignItems: 'center',
    padding: spacing.l,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  name: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  email: {
    fontSize: fontSize.m,
    color: colors.textLight,
    marginBottom: spacing.m,
  },
  tagContainer: {
    marginBottom: spacing.xl,
  },
  tag: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  tagProfessor: {
    backgroundColor: '#DBEAFE', // Light blue
  },
  tagStudent: {
    backgroundColor: '#DCFCE7', // Light green
  },
  tagText: {
    fontSize: fontSize.s,
    fontWeight: 'bold',
    color: colors.primary,
  },
  section: {
    width: '100%',
    marginBottom: spacing.l,
    backgroundColor: '#FFF',
    padding: spacing.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: fontSize.m,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.s,
  },
  bioText: {
    fontSize: fontSize.m,
    color: colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  infoText: {
    fontSize: fontSize.m,
    color: colors.text,
  },
});

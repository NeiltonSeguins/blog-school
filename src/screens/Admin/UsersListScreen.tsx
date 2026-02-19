import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, fontSize } from '../../theme';
import { User } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  navigation: StackNavigationProp<any>;
  route: RouteProp<any, any>;
}

import { usersService } from '../../services/usersService';

export default function UsersListScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const { role } = route.params as { role: 'teacher' | 'student' };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Determine if the current user has permission to edit/add
  // Only 'teacher' (Admin) can edit/add.
  const canEdit = user?.role === 'teacher';

  const title = role === 'teacher' ? 'Professores' : 'Alunos';
  const emptyMessage = role === 'teacher' ? 'Nenhum professor encontrado.' : 'Nenhum aluno encontrado.';
  const userTypeParam = role;

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [role])
  );

  async function fetchUsers() {
    try {
      setLoading(true);
      let data: User[] = [];

      if (role === 'teacher') {
        data = await usersService.getTeachers();
      } else {
        data = await usersService.getStudents();
      }

      setUsers(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', `Não foi possível carregar os ${title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    Alert.alert('Confirmar', 'Deseja excluir este usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            if (role === 'teacher') {
              await usersService.deleteTeacher(id);
            } else {
              await usersService.deleteStudent(id);
            }
            fetchUsers();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
        }
      }
    ]);
  }

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.headerTitle}>{role === 'teacher' ? 'Lista de Professores' : 'Lista de Alunos'}</Text>

      {canEdit && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('UserForm', { userType: userTypeParam })}
        >
          <Text style={styles.fabText}>+ Novo {role === 'teacher' ? 'Professor' : 'Aluno'}</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={users}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View
            style={styles.card}
          >
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            {canEdit && (
              <View style={styles.actions}>
                <TouchableOpacity onPress={(e) => {
                  e.stopPropagation();
                  navigation.navigate('UserForm', { id: item.id, userType: userTypeParam });
                }}>
                  <Text style={styles.editAction}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}>
                  <Text style={styles.deleteAction}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>{emptyMessage}</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.m,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  fab: {
    backgroundColor: colors.primary,
    padding: spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  fabText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: fontSize.l,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing.m,
    marginBottom: spacing.s,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.m,
    fontWeight: 'bold',
    color: colors.text,
  },
  email: {
    fontSize: fontSize.s,
    color: colors.textLight,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  editAction: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  deleteAction: {
    color: colors.error,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: colors.textLight,
    marginTop: spacing.xl,
  }
});

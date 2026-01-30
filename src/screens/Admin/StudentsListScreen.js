import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';
import { colors, spacing, fontSize } from '../../theme';

export default function StudentsListScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchStudents();
    }, [])
  );

  async function fetchStudents() {
    try {
      setLoading(true);
      // json-server filtering
      const response = await api.get('/users?role=aluno');
      setStudents(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os alunos.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    Alert.alert('Confirmar', 'Deseja excluir este aluno?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/users/${id}`);
            fetchStudents();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
      }}
    ]);
  }

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('UserForm', { userType: 'student' })}
      >
        <Text style={styles.fabText}>+ Novo Aluno</Text>
      </TouchableOpacity>

      <FlatList
        data={students}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => navigation.navigate('UserForm', { id: item.id, userType: 'student' })}>
                <Text style={styles.editAction}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteAction}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum aluno encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.m,
    backgroundColor: colors.background,
  },
  fab: {
    backgroundColor: colors.secondary, // Different color to distinguish? Kept similar for consistency or change here. Let's use secondary for Students.
    padding: spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  fabText: {
    color: colors.text,
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

import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';
import { colors, spacing, fontSize } from '../../theme';

export default function TeachersListScreen({ navigation }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchTeachers();
    }, [])
  );

  async function fetchTeachers() {
    try {
      setLoading(true);
      // json-server filtering
      const response = await api.get('/users?role=professor');
      setTeachers(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os professores.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    Alert.alert('Confirmar', 'Deseja excluir este professor?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/users/${id}`);
            fetchTeachers();
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
        onPress={() => navigation.navigate('UserForm', { userType: 'teacher' })}
      >
        <Text style={styles.fabText}>+ Novo Professor</Text>
      </TouchableOpacity>

      <FlatList
        data={teachers}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => navigation.navigate('UserForm', { id: item.id, userType: 'teacher' })}>
                <Text style={styles.editAction}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteAction}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum professor encontrado.</Text>}
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

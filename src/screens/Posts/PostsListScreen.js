import { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { colors, spacing, fontSize } from '../../theme';
import PostCard from '../../components/PostCard';

export default function PostsListScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  async function fetchPosts() {
    try {
      setLoading(true);
      const response = await api.get('/posts');
      setPosts(response.data);
      setFilteredPosts(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os posts.');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(text) {
    setSearch(text);
    if (!text) {
      setFilteredPosts(posts);
      return;
    }
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(text.toLowerCase()) ||
      post.description.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPosts(filtered);
  }

  async function handleDelete(id) {
    Alert.alert('Confirmar', 'Deseja excluir este post?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/posts/${id}`);
            fetchPosts();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
      }}
    ]);
  }

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />;
  }

  const isProfessor = user?.role === 'professor';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput 
          style={styles.search}
          placeholder="Buscar posts..."
          value={search}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {isProfessor && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => navigation.navigate('PostForm')}
        >
          <Text style={styles.fabText}>+ Novo Post</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={filteredPosts}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <PostCard 
            post={item} 
            onPress={() => navigation.navigate('PostDetail', { id: item.id })}
            onEdit={() => navigation.navigate('PostForm', { id: item.id })}
            onDelete={() => handleDelete(item.id)}
            canEdit={isProfessor}
          />
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum post encontrado.</Text>}
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
  header: {
    flexDirection: 'row',
    marginBottom: spacing.m,
    gap: spacing.s,
  },
  search: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutButton: {
    justifyContent: 'center',
    paddingHorizontal: spacing.s,
  },
  logoutText: {
    color: colors.error,
    fontWeight: 'bold',
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
  empty: {
    textAlign: 'center',
    color: colors.textLight,
    marginTop: spacing.xl,
  }
});

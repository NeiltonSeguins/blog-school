import { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { postsService } from '../../services/postsService';
import { colors, spacing, fontSize } from '../../theme';
import PostCard from '../../components/PostCard';
import { Post } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

// Define generic navigation type for now, will refine later
interface Props {
  navigation: StackNavigationProp<any>;
}

export default function PostsListScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const [categories, setCategories] = useState<string[]>(['Todos']);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );


  async function fetchPosts() {
    try {
      setLoading(true);
      // Use service instead of direct api call
      const data = await postsService.getPosts();

      // API returns { total, items: [...] } based on service definition
      // If items is undefined, fallback to empty array (or data itself if it turns out to be an array)
      const postsList = Array.isArray(data) ? data : (data.items || []);

      // Sort posts by date (newest first)
      const sortedPosts = postsList.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Descending order (newest first)
      });

      setPosts(sortedPosts);

      // Extract unique categories from posts
      const uniqueCategories = Array.from(new Set(sortedPosts.map(p => p.category || 'Geral')));
      setCategories(['Todos', ...uniqueCategories]);

      filterPosts(selectedCategory, searchQuery, sortedPosts);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os posts.');
    } finally {
      setLoading(false);
    }
  }

  function filterPosts(category: string, search: string, currentPosts: Post[]) {
    let filtered = currentPosts;

    if (category !== 'Todos') {
      filtered = filtered.filter(post => (post.category || 'Geral') === category);
    }

    if (search.trim()) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }

  function handleCategorySelect(category: string) {
    setSelectedCategory(category);
    filterPosts(category, searchQuery, posts);
  }

  function handleSearch(text: string) {
    setSearchQuery(text);
    filterPosts(selectedCategory, text, posts);
  }

  function toggleSearch() {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      handleSearch(''); // Clear search when closing
    }
  }

  async function handleDelete(id: number) {
    Alert.alert('Confirmar', 'Deseja excluir este post?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/ posts / ${id} `);
            fetchPosts();
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

  const isProfessor = user?.role === 'teacher';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <FontAwesome6 name="graduation-cap" size={24} color={colors.primary} iconStyle="solid" />
          </View>
          <Text style={styles.headerTitle}>EducaBlog</Text>
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={toggleSearch}>
          <FontAwesome6 name={isSearchVisible ? "xmark" : "magnifying-glass"} size={20} color={colors.text} iconStyle="solid" />
        </TouchableOpacity>
      </View>

      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por título..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>
      )}

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterItem,
                selectedCategory === item && styles.filterItemActive
              ]}
              onPress={() => handleCategorySelect(item)}
            >
              <Text style={[
                styles.filterText,
                selectedCategory === item && styles.filterTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
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
        refreshing={loading}
        onRefresh={fetchPosts}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
    paddingTop: spacing.s,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  logoContainer: {
    backgroundColor: '#E0F2FE', // Light blue background for logo
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  searchButton: {
    padding: spacing.s,
    backgroundColor: colors.card,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainer: {
    paddingHorizontal: spacing.s,
    marginBottom: spacing.m,
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.m,
    fontSize: fontSize.m,
  },
  logoutButton: {
    padding: spacing.s,
  },
  filtersContainer: {
    marginBottom: spacing.l,
  },
  filterItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: colors.surface,
    marginRight: spacing.s,
    borderWidth: 1,
    borderColor: 'transparent', // Cleaner look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textLight,
    fontWeight: '600',
    fontSize: fontSize.m,
  },
  filterTextActive: {
    color: '#FFF',
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

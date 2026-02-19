import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize } from '../../theme';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { postsService } from '../../services/postsService';
import { usersService } from '../../services/usersService';
import { categoriesService, Category } from '../../services/categoriesService';
import { User } from '../../types';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

interface Props {
  route: RouteProp<any, any>;
  navigation: StackNavigationProp<any>;
}

interface SelectProps {
  label: string;
  value: string;
  placeholder: string;
  items: { id: number | string; name: string }[];
  onSelect: (item: any) => void;
  loading?: boolean;
  disabled?: boolean;
}

function SelectGroup({ label, value, placeholder, items, onSelect, loading, disabled }: SelectProps) {
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

export default function PostFormScreen({ route, navigation }: Props) {
  const { id } = route.params || {};

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [selectedAuthor, setSelectedAuthor] = useState<{ id: number; name: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string } | null>(null);

  const [teachers, setTeachers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(!!id);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDependencies();
  }, []);

  useEffect(() => {
    if (id && !loadingData) {
      loadPost();
    }
  }, [id, loadingData]);

  async function loadDependencies() {
    try {
      try {
        const teachersData = await usersService.getTeachers();
        setTeachers(teachersData);
      } catch (e) {
        console.error("Failed to load teachers:", e);
      }

      try {
        const categoriesData = await categoriesService.getAll();
        setCategories(categoriesData);
      } catch (e) {
        console.error("Failed to load categories:", e);
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao carregar dados iniciais.');
    } finally {
      setLoadingData(false);
    }
  }

  async function loadPost() {
    try {
      const post = await postsService.getPostById(id);
      setTitle(post.title);
      setContent(post.content);

      let foundTeacher: User;

      if (post.teacherId) {
        foundTeacher = teachers.find(t => t.id === post.teacherId);
      }

      if (!foundTeacher && post.author) {
        foundTeacher = teachers.find(t => t.name === post.author);
      }

      if (foundTeacher) {
        setSelectedAuthor({ id: foundTeacher.id, name: foundTeacher.name });
      } else if (post.author) {
        setSelectedAuthor({ id: 0, name: post.author });
      }

      if (post.categoryId) {
        try {
          const categoryDetails = await categoriesService.getCategoryById(post.categoryId);
          setSelectedCategory(categoryDetails);
        } catch (catError) {
          console.error("Failed to fetch category details:", catError);
          const found = categories.find(c => c.id === post.categoryId);
          if (found) setSelectedCategory(found);
          else if (post.category) setSelectedCategory({ id: post.categoryId, name: post.category });
        }
      } else if (post.category) {
        const foundCategory = categories.find(c => c.name === post.category);
        if (foundCategory) setSelectedCategory(foundCategory);
      }

    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar dados do post.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!title || !content || !selectedAuthor || !selectedCategory) {
      Alert.alert('Atenção', 'Preencha todos os campos, incluindo Autor e Categoria.');
      return;
    }

    setSaving(true);

    const data: any = {
      title,
      content,
      author: selectedAuthor.name,
      teacherId: selectedAuthor.id,
      categoryId: selectedCategory.id,
    };

    try {
      if (id) {
        await postsService.updatePost(id, { ...data, updatedAt: new Date().toISOString() });
      } else {
        await postsService.createPost({ ...data, createdAt: new Date().toISOString() });
      }
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao salvar o post.');
    } finally {
      setSaving(false);
    }
  }

  if (loading || loadingData) return <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>{id ? 'Editar Post' : 'Novo Post'}</Text>

          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Título do post"
          />

          <SelectGroup
            label="Autor"
            value={selectedAuthor?.name || ''}
            placeholder="Selecione o autor"
            items={teachers.map(t => ({ id: t.id, name: t.name }))}
            onSelect={setSelectedAuthor}
            loading={loadingData}
            disabled={!!id} // Disable if editing
          />

          <SelectGroup
            label="Categoria"
            value={selectedCategory?.name || ''}
            placeholder="Selecione a categoria"
            items={categories}
            onSelect={setSelectedCategory}
            loading={loadingData}
          />


          <Text style={styles.label}>Conteúdo</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={content}
            onChangeText={setContent}
            placeholder="Conteúdo completo..."
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Salvar Post</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.m,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  label: {
    fontSize: fontSize.m,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.m,
    marginBottom: spacing.l,
    fontSize: fontSize.m,
  },
  selectButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.m,
    marginBottom: spacing.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: fontSize.m,
    color: colors.text,
  },
  textArea: {
    height: 150,
  },
  button: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#FFF',
    fontSize: fontSize.l,
    fontWeight: 'bold',
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

import { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, fontSize } from '../../theme';
import { formatDate, parseDate } from '../../utils/date';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
  route: RouteProp<any, any>;
  navigation: StackNavigationProp<any>;
}

export default function PostFormScreen({ route, navigation }: Props) {
  const { id } = route.params || {};
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(user?.name || '');
  const [category, setCategory] = useState('');
  const [createdAt, setCreatedAt] = useState(formatDate(new Date().toISOString()));
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  async function loadPost() {
    try {
      const response = await api.get(`/posts/${id}`);
      const { title, description, content, author, category, createdAt } = response.data;
      setTitle(title);
      setDescription(description);
      setContent(content);
      if (author) setAuthor(author);
      if (category) setCategory(category);
      if (createdAt) setCreatedAt(formatDate(createdAt));
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar dados do post.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!title || !description || !content) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    setSaving(true);
    const data = {
      title,
      description,
      content,
      author: author || user?.name || 'Professor',
      category: category || 'Geral',
      createdAt: parseDate(createdAt)
    };

    try {
      if (id) {
        await api.put(`/posts/${id}`, data);
      } else {
        await api.post('/posts', data);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar o post.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />;

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

          <Text style={styles.label}>Autor</Text>
          <TextInput
            style={styles.input}
            value={author}
            onChangeText={setAuthor}
            placeholder="Nome do autor"
          />

          <Text style={styles.label}>Categoria</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Ex: Tecnologia, Carreira..."
          />

          <View style={styles.chipsContainer}>
            {['Carreira', 'Estudos', 'Tecnologia', 'Ciências'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.chip, category === item && styles.chipActive]}
                onPress={() => setCategory(item)}
              >
                <Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Data de Criação</Text>
          <TextInput
            style={styles.input}
            value={createdAt}
            onChangeText={setCreatedAt}
            placeholder="DD/MM/AAAA"
          />

          <Text style={styles.label}>Resumo</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Breve descrição"
            multiline
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
    marginBottom: spacing.l,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: fontSize.s,
    color: colors.textLight,
  },
  chipTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
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
  }
});

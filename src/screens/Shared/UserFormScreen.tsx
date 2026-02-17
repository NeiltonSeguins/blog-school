import { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { colors, spacing, fontSize } from '../../theme';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
  route: RouteProp<any, any>;
  navigation: StackNavigationProp<any>;
}

export default function UserFormScreen({ route, navigation }: Props) {
  const { id, userType } = route.params || {}; // userType: 'teacher' | 'student'

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  async function loadUser() {
    try {
      const response = await api.get(`/users/${id}`);
      const { name, email, password, bio, subject } = response.data;
      setName(name);
      setEmail(email);
      setPassword(password);
      if (bio) setBio(bio);
      if (subject) setSubject(subject);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar dados do usuário.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!name || !email || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    setSaving(true);
    const role = userType === 'teacher' ? 'professor' : 'aluno';

    const data = {
      name,
      email,
      password,
      role,
      bio,
      subject
    };

    try {
      if (id) {
        await api.put(`/users/${id}`, data);
      } else {
        await api.post('/users', data);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar o usuário.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.headerTitle}>
            {userType === 'teacher' ? 'Professor' : 'Aluno'}
          </Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nome completo"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="E-mail de acesso"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Senha de acesso"
            secureTextEntry={false}
          />

          {/* Bio Field - For everyone */}
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            placeholder="Conte um pouco sobre você"
            multiline
            numberOfLines={3}
          />

          {/* Subject Field - Only for Teachers */}
          {(userType === 'teacher' || (id && route.params?.userType === 'teacher')) && (
            <>
              <Text style={styles.label}>Disciplina</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="Ex: Matemática, História"
              />
            </>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Salvar</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: spacing.m,
    paddingBottom: 100, // Ensure space for scrolling above keyboard
  },
  headerTitle: {
    fontSize: fontSize.xl,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.s,
  },
  buttonText: {
    color: '#FFF',
    fontSize: fontSize.l,
    fontWeight: 'bold',
  }
});

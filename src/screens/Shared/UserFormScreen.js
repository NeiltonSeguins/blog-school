import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import api from '../../services/api';
import { colors, spacing, fontSize } from '../../theme';

export default function UserFormScreen({ route, navigation }) {
  const { id, userType } = route.params || {}; // userType: 'teacher' | 'student'
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const { name, email, password } = response.data;
      setName(name);
      setEmail(email);
      setPassword(password); // In a real app, we wouldn't show the password
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
    
    // Simple validation logic for email as per requirements (fake api logic)
    // Professor email must contain "prof" if we were strictly enforcing it, 
    // but the requirements imply that validation is on login. 
    // We will just save whatever is entered.

    const data = {
      name,
      email,
      password,
      role
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
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>
        {id ? 'Editar' : 'Novo'} {userType === 'teacher' ? 'Professor' : 'Aluno'}
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
        secureTextEntry={false} // Showing password for simplicity as per "simple login" requirement often implies visibility in test apps, but let's keep it visible for editing in this mock context or hidden if preferred. Let's keep it visible for easy testing.
      />

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Salvar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.m,
    backgroundColor: colors.background,
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

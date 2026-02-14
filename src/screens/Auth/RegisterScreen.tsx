import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, fontSize } from '../../theme';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
  navigation: StackNavigationProp<any>;
}

export default function RegisterScreen({ navigation }: Props) {
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'aluno' | 'professor'>('aluno');

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    const error = await signUp(name, email, password, role);
    setLoading(false);

    if (error) {
      Alert.alert('Erro no cadastro', error);
    }
    // If no error, AuthContext will update state and AppNavigator will switch to AppStack automatically
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome6 name="arrow-left" size={24} color={colors.primary} iconStyle="solid" />
          </TouchableOpacity>

          <View style={styles.logoCircle}>
            <FontAwesome6 name="user-plus" size={32} color={colors.primary} iconStyle="solid" />
          </View>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Junte-se ao EducaBlog</Text>
        </View>

        <View style={styles.form}>

          {/* Role Selection */}
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Eu sou:</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[styles.roleButton, role === 'aluno' && styles.roleButtonActive]}
                onPress={() => setRole('aluno')}
              >
                <FontAwesome6 name="user-graduate" size={16} color={role === 'aluno' ? '#FFF' : colors.primary} iconStyle="solid" style={{ marginRight: 8 }} />
                <Text style={[styles.roleButtonText, role === 'aluno' && styles.roleButtonTextActive]}>Aluno</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleButton, role === 'professor' && styles.roleButtonActive]}
                onPress={() => setRole('professor')}
              >
                <FontAwesome6 name="chalkboard-user" size={16} color={role === 'professor' ? '#FFF' : colors.primary} iconStyle="solid" style={{ marginRight: 8 }} />
                <Text style={[styles.roleButtonText, role === 'professor' && styles.roleButtonTextActive]}>Professor</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome6 name="user" size={20} color={colors.textLight} iconStyle="solid" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={colors.textLight}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome6 name="envelope" size={20} color={colors.textLight} iconStyle="solid" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome6 name="lock" size={20} color={colors.textLight} iconStyle="solid" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <FontAwesome6 name={showPassword ? "eye" : "eye-slash"} size={20} color={colors.textLight} iconStyle="solid" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OU</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.goBack()}>
            <Text style={styles.loginButtonText}>Já tenho uma conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.l,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.l,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: spacing.s,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
    marginTop: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.m,
    color: colors.textLight,
  },
  form: {
    width: '100%',
  },
  roleContainer: {
    marginBottom: spacing.l,
  },
  roleLabel: {
    fontSize: fontSize.m,
    color: colors.text,
    marginBottom: spacing.s,
    fontWeight: '600',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  roleButtonActive: {
    backgroundColor: colors.primary,
  },
  roleButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: fontSize.m,
  },
  roleButtonTextActive: {
    color: '#FFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.m,
    paddingHorizontal: spacing.m,
    height: 56,
  },
  inputIcon: {
    marginRight: spacing.s,
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.text,
    fontSize: fontSize.m,
  },
  eyeIcon: {
    padding: spacing.s,
  },
  button: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: spacing.m,
  },
  buttonText: {
    color: '#FFF',
    fontSize: fontSize.m,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.l,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.m,
    color: colors.textLight,
    fontWeight: '600',
  },
  loginButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  loginButtonText: {
    color: colors.primary,
    fontSize: fontSize.m,
    fontWeight: 'bold',
  },
});

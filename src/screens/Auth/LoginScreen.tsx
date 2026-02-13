import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, fontSize } from '../../theme';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    const error = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Erro no login', error);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <FontAwesome6 name="graduation-cap" size={40} color={colors.primary} iconStyle="solid" />
          </View>
          <Text style={styles.title}>Bem-vindo(a)</Text>
          <Text style={styles.subtitle}>Faça login para acessar o EducaBlog</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <FontAwesome6 name="envelope" size={20} color={colors.textLight} iconStyle="solid" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
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
              placeholder="Digite sua senha"
              placeholderTextColor={colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <FontAwesome6 name={showPassword ? "eye" : "eye-slash"} size={20} color={colors.textLight} iconStyle="solid" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OU</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={() => Alert.alert('Em breve', 'Funcionalidade de cadastro será implementada.')}>
            <Text style={styles.registerButtonText}>Criar nova conta</Text>
          </TouchableOpacity>
        </View>

        {/* Keeping helper for dev/demo purposes but making it subtle */}
        <View style={styles.helperContainer}>
          <Text style={styles.helperTitle}>Acesso Rápido (Demo):</Text>
          <Text style={styles.helperText}>Admin: admin@blog.com / 123</Text>
          <Text style={styles.helperText}>Aluno: student@blog.com / 123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // colors.surface if available, else light gray
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.l,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F2FE', // Light blue
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  title: {
    fontSize: 28,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.l,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: fontSize.s,
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
  },
  buttonText: {
    color: '#FFF',
    fontSize: fontSize.m,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
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
  registerButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  registerButtonText: {
    color: colors.primary,
    fontSize: fontSize.m,
    fontWeight: 'bold',
  },
  helperContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
    opacity: 0.6,
  },
  helperTitle: {
    fontSize: fontSize.s,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.textLight,
  },
  helperText: {
    fontSize: fontSize.s,
    color: colors.textLight,
  },
});

import React, { useState, useContext } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { colors, spacing } from '../theme/colors';
import Button from '../components/Button';
import Input from '../components/Input';

export default function SignInScreen({ navigation }) {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email || !password) return 'Please enter email and password';
    return null;
  };

  const handleSignIn = async () => {
    const error = validate();
    if (error) return Alert.alert('Validation error', error);

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (e) {
      Alert.alert('Sign In Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue to EventHub</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <Button 
          title="Sign In" 
          onPress={handleSignIn}
          loading={loading}
          style={styles.signInButton}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 2,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  signInButton: {
    marginTop: spacing.md,
  },
  footer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  linkText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  linkTextBold: {
    color: colors.primary,
    fontWeight: '600',
  },
});
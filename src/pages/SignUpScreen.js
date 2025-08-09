import React, { useState, useContext } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { colors, spacing } from '../theme/colors';
import Button from '../components/Button';
import Input from '../components/Input';

export default function SignUpScreen({ navigation }) {
  const { signUp } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email || !password || !confirmPassword) return 'Fill all fields';
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) return 'Enter valid email';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSignUp = async () => {
    const error = validate();
    if (error) return Alert.alert('Validation error', error);

    setLoading(true);
    try {
      await signUp(email, password);
    } catch (e) {
      Alert.alert('Sign Up Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us to discover amazing events</Text>
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
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
        />

        <Button 
          title="Create Account" 
          onPress={handleSignUp}
          loading={loading}
          style={styles.signUpButton}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
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
  signUpButton: {
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
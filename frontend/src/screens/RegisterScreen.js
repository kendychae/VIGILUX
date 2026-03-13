import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { authService } from '../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.password || !formData.firstName.trim() || !formData.lastName.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await authService.register({
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        userType: 'citizen',
      });

      if (result.success) {
        Alert.alert(
          'Success',
          'Account created successfully!',
          [{ text: 'OK', onPress: () => navigation.replace('Main') }]
        );
      } else {
        if (result.errors) {
          const errorMessages = result.errors.map(e => e.message).join('\n');
          Alert.alert('Registration Failed', errorMessages);
        } else {
          Alert.alert('Registration Failed', result.message || 'Unable to create account');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the iSPY community</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="First Name *"
            placeholderTextColor="#999"
            value={formData.firstName}
            onChangeText={(value) => updateField('firstName', value)}
            autoCapitalize="words"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name *"
            placeholderTextColor="#999"
            value={formData.lastName}
            onChangeText={(value) => updateField('lastName', value)}
            autoCapitalize="words"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Email *"
            placeholderTextColor="#999"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number (optional)"
            placeholderTextColor="#999"
            value={formData.phoneNumber}
            onChangeText={(value) => updateField('phoneNumber', value)}
            keyboardType="phone-pad"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password *"
            placeholderTextColor="#999"
            value={formData.password}
            onChangeText={(value) => updateField('password', value)}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password *"
            placeholderTextColor="#999"
            value={formData.confirmPassword}
            onChangeText={(value) => updateField('confirmPassword', value)}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#1a1a1a',
  },
  registerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  registerButtonDisabled: {
    backgroundColor: '#007AFF80',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
    padding: 16,
  },
  loginLinkText: {
    color: '#666',
    fontSize: 14,
  },
  loginLinkBold: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default RegisterScreen;

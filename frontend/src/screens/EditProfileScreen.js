import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { authService } from '../services/authService';

const EditProfileScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await authService.getCachedUser();
      if (user) {
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phoneNumber: user.phoneNumber || '',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (formData.phoneNumber && !/^[\d\s\-\+\(\)]*$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const result = await authService.updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
      });

      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Profile update error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Edit Your Profile</Text>

          {/* First Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[
                styles.input,
                errors.firstName && styles.inputError,
              ]}
              placeholder="Enter your first name"
              value={formData.firstName}
              onChangeText={(value) => updateField('firstName', value)}
              editable={!saving}
              placeholderTextColor="#ccc"
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
          </View>

          {/* Last Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[
                styles.input,
                errors.lastName && styles.inputError,
              ]}
              placeholder="Enter your last name"
              value={formData.lastName}
              onChangeText={(value) => updateField('lastName', value)}
              editable={!saving}
              placeholderTextColor="#ccc"
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
          </View>

          {/* Phone Number */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number (Optional)</Text>
            <TextInput
              style={[
                styles.input,
                errors.phoneNumber && styles.inputError,
              ]}
              placeholder="e.g., (555) 123-4567"
              value={formData.phoneNumber}
              onChangeText={(value) => updateField('phoneNumber', value)}
              keyboardType="phone-pad"
              editable={!saving}
              placeholderTextColor="#ccc"
            />
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}
          </View>

          <View style={styles.spacer} />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  flex: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1a1a1a',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  spacer: {
    height: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
});

export default EditProfileScreen;

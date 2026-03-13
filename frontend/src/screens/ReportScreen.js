import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';

const ReportScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentType, setIncidentType] = useState('');

  const incidentTypes = [
    { id: 'theft', label: 'Theft', icon: '💼' },
    { id: 'vandalism', label: 'Vandalism', icon: '🔨' },
    { id: 'suspicious', label: 'Suspicious Activity', icon: '👀' },
    { id: 'noise', label: 'Noise Complaint', icon: '🔊' },
    { id: 'traffic', label: 'Traffic Issue', icon: '🚗' },
    { id: 'other', label: 'Other', icon: '📌' },
  ];

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !incidentType) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Here you would call the API to submit the report
    Alert.alert(
      'Success',
      'Your report has been submitted successfully',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Submit a Report</Text>
        <Text style={styles.subheader}>Help keep your neighborhood safe</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Incident Type</Text>
          <View style={styles.typeGrid}>
            {incidentTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  incidentType === type.id && styles.typeCardSelected,
                ]}
                onPress={() => setIncidentType(type.id)}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text style={[
                  styles.typeLabel,
                  incidentType === type.id && styles.typeLabelSelected,
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Brief summary of the incident"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Provide details about what happened..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  typeCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  typeCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  typeLabelSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReportScreen;


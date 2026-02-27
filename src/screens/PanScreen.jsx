import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function PanScreen() {
  const [panNumber, setPanNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const navigation = useNavigation();

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = () => {
    console.log('PAN:', panNumber, 'DOB:', formatDate(dateOfBirth));
    navigation.navigate('AadharVerification');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          <Text style={styles.panHighlight}>PAN</Text> Verification
        </Text>
        
        <Text style={styles.infoText}>
          Kindly keep your valid pan linked aadhar card handy as you will be asked to authenticate it via Aadhaar OTP.
        </Text>

        {/* PAN Card Image */}
        <View style={styles.cardImageContainer}>
          <View style={styles.panCardMock}>
            <View style={styles.panCardHeader}>
              <Text style={styles.panCardHeaderText}>INCOME TAX DEPARTMENT</Text>
              <Text style={styles.panCardSubText}>GOVT. OF INDIA</Text>
            </View>
            <View style={styles.panCardBody}>
              <View style={styles.photoPlaceholder} />
              <View style={styles.panCardDetails}>
                <Text style={styles.panCardLabel}>Permanent Account Number</Text>
                <Text style={styles.panCardNumber}>ABCDE1234F</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.infoNote}>
          The Aadhaar Details will be encrypted in accordance with the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016 and UIDAI Regulations. The Details entered will be used by Aadhaar Number for e-KYC or E-sign of material on your PAN.
        </Text>
      </View>

      {/* Form Section */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>PAN</Text>
        <Text style={styles.formSubtitle}>
          Your name will be taken as per ITD (Income Tax Department).
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Enter Pan Number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={panNumber}
            onChangeText={setPanNumber}
            placeholder=""
            maxLength={10}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Enter Date of Birth <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(dateOfBirth)}</Text>
            <Icon name="calendar-today" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
          />
        )}

        {Platform.OS === 'ios' && showDatePicker && (
          <View style={styles.iosPickerButtons}>
            <TouchableOpacity 
              style={styles.iosButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.iosButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  panHighlight: {
    color: '#4A90E2',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  panCardMock: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#E8F4F8',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B3D9E8',
  },
  panCardHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  panCardHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2C5F7C',
    letterSpacing: 0.5,
  },
  panCardSubText: {
    fontSize: 10,
    color: '#2C5F7C',
    marginTop: 2,
  },
  panCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 60,
    height: 70,
    backgroundColor: '#C5E1ED',
    borderRadius: 4,
    marginRight: 12,
  },
  panCardDetails: {
    flex: 1,
  },
  panCardLabel: {
    fontSize: 10,
    color: '#2C5F7C',
    marginBottom: 4,
  },
  panCardNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A4A61',
    letterSpacing: 1,
  },
  infoNote: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginTop: 16,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  formSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: '#E74C3C',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#333',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 15,
    color: '#333',
  },
  iosPickerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  iosButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#4A90E2',
    borderRadius: 6,
  },
  iosButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#A8C8E1',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
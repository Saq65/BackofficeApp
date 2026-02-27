import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';

export default function BankDetails() {
  const [ifsc, setIfsc] = useState('');
  const [micr, setMicr] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [bankAddress, setBankAddress] = useState('');
  const [accountType, setAccountType] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = () => {
    if (!ifsc || !micr || !accountNumber || !confirmAccountNumber || !accountType) {
      alert('Please fill all required fields');
      return;
    }
    
    if (accountNumber !== confirmAccountNumber) {
      alert('Account numbers do not match');
      return;
    }
    setShowPopup(true);
    navigation.navigate('BankProof');
  };

  const handleModify = () => {
    setShowPopup(false);
  };

  const handleProceed = () => {
    setShowPopup(false);
    console.log('Proceeding with bank details');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          <Text style={styles.label}> 
            IFSC <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={ifsc}
            onChangeText={setIfsc}
            placeholder=""
            autoCapitalize="characters"
            placeholderTextColor="#ccc"
          />

          <Text style={styles.label}>
            MICR <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={micr}
            onChangeText={setMicr}
            placeholder=""
            keyboardType="numeric"
            placeholderTextColor="#ccc"
          />

          {/* Account Number */}
          <Text style={styles.label}>
            Account Number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder=""
            keyboardType="numeric"
            placeholderTextColor="#ccc"
          />

          {/* Confirm Account Number */}
          <Text style={styles.label}>
            Confirm Account Number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={confirmAccountNumber}
            onChangeText={setConfirmAccountNumber}
            placeholder=""
            keyboardType="numeric"
            placeholderTextColor="#ccc"
          />

          {/* Bank Address */}
          <Text style={styles.label}>Bank Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bankAddress}
            onChangeText={setBankAddress}
            placeholder=""
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#ccc"
          />

          {/* Account Type */}
          <Text style={styles.label}>
            Account Type <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={accountType}
              onValueChange={(itemValue) => setAccountType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="--Select--" value="" />
              <Picker.Item label="Savings" value="savings" />
              <Picker.Item label="Current" value="current" />
            </Picker>
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Popup Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showPopup}
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Bank Details in Grey Box */}
            <View style={styles.detailsBox}>
              <Text style={styles.finNumber}>F-IND0001157</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>IFSC Code</Text>
                <Text style={styles.detailValue}>{ifsc || '0000'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account Number</Text>
                <Text style={styles.detailValue}>
                  {accountNumber ? '***' + accountNumber.slice(-4) : '********'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>MICR Code</Text>
                <Text style={styles.detailValue}>{micr || '203041'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bank Name</Text>
                <Text style={styles.detailValue}>FINO PAYMENTS BANK, CEN-676, PL</Text>
              </View>
            </View>

            {/* Error Message */}
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>Penny Drop</Text>
              <Text style={styles.errorMessage}>Pennydrip failed due to insufficient funds</Text>
            </View>

            {/* Modify Button */}
            <TouchableOpacity 
              style={styles.modifyButton}
              onPress={handleModify}
            >
              <Text style={styles.modifyButtonText}>Modify</Text>
            </TouchableOpacity>

            {/* Proceed Button */}
            <TouchableOpacity 
              style={styles.proceedButton}
              onPress={handleProceed}
            >
              <Text style={styles.proceedButtonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 18,
    fontWeight: '400',
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    color: '#A0A0A0',
    marginBottom: 6,
    marginTop: 12,
  },
  required: {
    color: '#ff0000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 70,
    paddingTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  picker: {
    height: responsiveHeight(7),
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#B8D9F3',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 25,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 0,
    width: '100%',
    maxWidth: 350,
  },
  detailsBox: {
    backgroundColor: '#E8E8E8',
    padding: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  finNumber: {
    fontSize: 13,
    color: '#333',
    marginBottom: 12,
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: '#666',
  },
  detailValue: {
    fontSize: 11,
    color: '#333',
    fontWeight: '500',
  },
  errorBox: {
    padding: 15,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 12,
    color: '#E74C3C',
    fontWeight: '500',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 11,
    color: '#E74C3C',
    textAlign: 'center',
  },
  modifyButton: {
    backgroundColor: '#B8D9F3',
    paddingVertical: 12,
    marginHorizontal: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  modifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  proceedButton: {
    backgroundColor: '#B8D9F3',
    paddingVertical: 12,
    marginHorizontal: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 15,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
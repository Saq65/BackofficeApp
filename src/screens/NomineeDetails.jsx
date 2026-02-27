import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';

export default function NomineeDetails() {
  const [nomineeOption, setNomineeOption] = useState('');
  const navigation = useNavigation();

  const handleSubmit = () => {
    console.log('Form submitted with option:', nomineeOption);
    navigation.navigate('BankDetails');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>
          Add Nominee Details <Text style={styles.required}>*</Text>
        </Text>
        
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={nomineeOption}
            onValueChange={(itemValue) => setNomineeOption(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="--Select--" value="" />
            <Picker.Item label="Yes" value="yes" />
            <Picker.Item label="No" value="no" />
          </Picker>
        </View>

        {nomineeOption === 'no' && (
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            <Text style={styles.confirmationText}>
              I/We hereby confirm that I/We do not wish to appoint any nominee(s) in my/our 
              demat/trading account and understand the issues involved in non-appointment 
              of nominee(s) and further are aware that in case of death of all the account 
              holder(s), my/our legal heirs would need to submit all requisite 
              documents/information for claiming of assets held in demat/trading account, 
              which may also include documents issued by court or other such competent authority, 
              based on the value of such demat/trading account.
            </Text>
          </View>
        )}

        {nomineeOption === 'yes' && (
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Add Nominee Details</Text>
            <Text style={styles.subtext}>Yahan nominee ke details add karo</Text>
          </View>
        )}

        {nomineeOption !== '' && (
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: responsiveHeight(2.2),
    color: '#7FB3D5',
    marginBottom: 8,
    fontWeight: '400',
  },
  required: {
    color: '#7FB3D5',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: responsiveHeight(7),
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingRight: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#555',
    backgroundColor: '#555',
    marginRight: 12,
    marginTop: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  confirmationText: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
    textAlign: 'left',
  },
  submitButton: {
    backgroundColor: '#A8D5F5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  formContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  subtext: {
    fontSize: 14,
    color: '#666',
  },
});
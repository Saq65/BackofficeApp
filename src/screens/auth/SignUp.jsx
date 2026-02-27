import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export default function SignUp() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();

  // Proper validation: 10 digits AND checkbox checked
  const isButtonActive = mobileNumber.length === 10 && isChecked;

  const handleMobileChange = (text) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 10) {
      setMobileNumber(numericText);
    }
  };

  const handleSendOTP = () => {
    if (mobileNumber.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!isChecked) {
      alert('Please accept Terms & Conditions');
      return;
    }
    navigation.navigate('Otp');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Lottie Animation */}
        <View style={styles.lottieContainer}>
          <LottieView
            source={require('../../../assets/KyCJson.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>

        <Text style={styles.subtitle}>
          Or resume/track your existing application
        </Text>

        {/* Mobile Number Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter your Mobile number *"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={mobileNumber}
          onChangeText={handleMobileChange}
          maxLength={10}
        />

        {/* Show validation message */}
        {mobileNumber.length > 0 && mobileNumber.length < 10 && (
          <Text style={styles.errorText}>
            Please enter a valid 10-digit mobile number
          </Text>
        )}

        {/* Send OTP Button */}
        <TouchableOpacity
          onPress={handleSendOTP}
          style={[
            styles.button,
            isButtonActive && styles.buttonActive
          ]}
          disabled={!isButtonActive}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.buttonText,
            isButtonActive && styles.buttonTextActive
          ]}>
            SEND OTP
          </Text>
        </TouchableOpacity>

        {/* Terms & Conditions Checkbox */}
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isChecked}
            onValueChange={setIsChecked}
            tintColors={{ true: '#1976D2', false: '#999' }}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>
            Please accept the{' '}
            <Text style={styles.linkText}>Terms & Conditions</Text>
          </Text>
        </View>

        {/* Note Section */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteText}>
            *Online account opening requires your number to be linked with Aadhaar. 
            You can check if your mobile number is linked to Aadhaar{' '}
            <Text style={styles.linkText}>here</Text>. If your mobile number isn't 
            linked to Aadhaar, please open your account offline
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  contentContainer: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(3),
    paddingBottom: responsiveHeight(4),
    flexGrow: 1,
  },
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(2),
  },
  lottie: {
    width: responsiveWidth(50),
    height: responsiveHeight(20),
  },
  title: {
    fontSize: responsiveFontSize(3.2),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: responsiveHeight(1),
    color: '#000',
  },
  subtitle: {
    fontSize: responsiveFontSize(1.8),
    color: '#666',
    textAlign: 'center',
    marginBottom: responsiveHeight(3),
    paddingHorizontal: responsiveWidth(5),
  },
  input: {
    borderWidth: 1,
    borderColor: '#9E9E9E',
    borderRadius: 4,
    padding: responsiveHeight(1.8),
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveHeight(1),
    color: '#000',
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#F44336',
    fontSize: responsiveFontSize(1.6),
    marginBottom: responsiveHeight(1.5),
    marginLeft: responsiveWidth(1),
  },
  button: {
    backgroundColor: '#BBDEFB',
    padding: responsiveHeight(2),
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
  },
  buttonActive: {
    backgroundColor: '#1976D2',
  },
  buttonText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  buttonTextActive: {
    color: '#FFFFFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: responsiveHeight(3),
    paddingRight: responsiveWidth(2),
  },
  checkbox: {
    marginRight: responsiveWidth(2),
    marginTop: Platform.OS === 'android' ? -6 : 2,
    transform: Platform.OS === 'ios' ? [{ scaleX: 0.9 }, { scaleY: 0.9 }] : [],
  },
  checkboxLabel: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    lineHeight: responsiveHeight(2.8),
    flex: 1,
    flexWrap: 'wrap',
  },
  linkText: {
    color: '#1976D2',
    textDecorationLine: 'underline',
  },
  noteContainer: {
    marginTop: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(1),
  },
  noteTitle: {
    fontWeight: 'bold',
    marginBottom: responsiveHeight(1),
    fontSize: responsiveFontSize(1.8),
    color: '#000',
  },
  noteText: {
    fontSize: responsiveFontSize(1.6),
    color: '#333',
    lineHeight: responsiveHeight(2.5),
  },
});
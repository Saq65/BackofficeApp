import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

const { width, height } = Dimensions.get('window');

export default function Otp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(178);
  const navigation = useNavigation();
  const inputRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      navigation.navigate('EmailVerfication');
    }
  };

  const handleResendOtp = () => {
    setTimer(178);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const isOtpComplete = otp.every(digit => digit !== '');

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
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/otpImage.jpg')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Enter Mobile OTP</Text>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>
            {timer > 0 ? (
              <>Resend OTP in: <Text style={styles.timerBold}>{formatTime(timer)}</Text></>
            ) : (
              <TouchableOpacity onPress={handleResendOtp}>
                <Text style={styles.resendLink}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </Text>
        </View>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                digit !== '' && styles.otpInputFilled
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity 
          style={[
            styles.verifyButton,
            isOtpComplete && styles.verifyButtonActive
          ]} 
          onPress={handleVerify}
          disabled={!isOtpComplete}
        >
          <Text style={[
            styles.verifyButtonText,
            isOtpComplete && styles.verifyButtonTextActive
          ]}>
            Verify OTP
          </Text>
        </TouchableOpacity>

        <View style={styles.footerTextContainer}>
          <Text style={styles.footerText}>
            You already have a valid OTP to login for next 180 secs.
          </Text>
          <Text style={styles.footerText}>Please use the same OTP.</Text>
        </View>

        {/* Note */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteText}>
            *Online account opening requires your number to be linked with Aadhaar. You can check if your mobile number is linked with Aadhaar on UIDAI website. If your number is not linked to Aadhaar, please open your account offline.
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
    alignItems: 'center',
    flexGrow: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
    width: '100%',
  },
  illustration: {
    width: width > 768 ? responsiveWidth(60) : responsiveWidth(85),
    height: height > 800 ? responsiveHeight(25) : responsiveHeight(22),
    maxWidth: 400,
    maxHeight: 350,
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: responsiveHeight(1.5),
    textAlign: 'center',
  },
  timerContainer: {
    marginBottom: responsiveHeight(3),
    alignItems: 'center',
  },
  timer: {
    fontSize: responsiveFontSize(1.8),
    color: '#666',
    textAlign: 'center',
  },
  timerBold: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  resendLink: {
    fontSize: responsiveFontSize(1.8),
    color: '#1976D2',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: responsiveWidth(2),
    marginBottom: responsiveHeight(3),
    width: '100%',
    paddingHorizontal: responsiveWidth(2),
  },
  otpInput: {
    width: responsiveWidth(12),
    height: responsiveHeight(6.5),
    maxWidth: 55,
    maxHeight: 60,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: responsiveFontSize(2.5),
    fontWeight: '600',
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  otpInputFilled: {
    borderColor: '#1976D2',
    backgroundColor: '#E3F2FD',
  },
  verifyButton: {
    width: '100%',
    backgroundColor: '#BBDEFB',
    padding: responsiveHeight(2),
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
    opacity: 0.6,
  },
  verifyButtonActive: {
    backgroundColor: '#1976D2',
    opacity: 1,
  },
  verifyButtonText: {
    color: '#1976D2',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  verifyButtonTextActive: {
    color: '#fff',
  },
  footerTextContainer: {
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  footerText: {
    fontSize: responsiveFontSize(1.5),
    color: '#666',
    textAlign: 'center',
    marginBottom: responsiveHeight(0.5),
    lineHeight: responsiveHeight(2.2),
  },
  noteContainer: {
    marginTop: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(2),
    width: '100%',
  },
  noteTitle: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: responsiveHeight(0.8),
  },
  noteText: {
    fontSize: responsiveFontSize(1.5),
    color: '#666',
    lineHeight: responsiveHeight(2.2),
  },
});
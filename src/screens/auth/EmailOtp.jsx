import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import colors from '../../styles/colours';

const { width, height } = Dimensions.get('window');

export default function EmailOtp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(118); 
  const inputRefs = useRef([]);
  const navigation = useNavigation();

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
    console.log('Verifying Email OTP:', otpValue);
    navigation.navigate('SegmentScreen');
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>

      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/otpImage.jpg')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Enter Email OTP</Text>

      {/* Timer */}
      <Text style={styles.timer}>Resend OTP in: {formatTime(timer)}</Text>

      {/* OTP Input Boxes */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyButtonText}>Verify OTP</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        You already have a valid OTP to login for next 180 secs.
      </Text>
      <Text style={styles.footerText}>Please use the same OTP.</Text>

      {/* Note */}
      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>
          *Keep the photocopies of the following documents handy to complete account opening process seamlessly.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  illustrationContainer: {
    marginTop: 20,
    marginBottom: 30,
    height: 150,
  },
  illustration: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: 90,
    height: 140,
    borderWidth: 3,
    borderColor: '#2C3E50',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 15,
  },
  phoneButton: {
    backgroundColor: '#4A7BA7',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 10,
  },
  phoneButtonText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 70,
    gap: 3,
  },
  key: {
    width: 20,
    height: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 9,
    color: '#333',
  },
  personIllustration: {
    marginLeft: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  personHead: {
    width: 50,
    height: 60,
    backgroundColor: '#2C3E50',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  personBody: {
    width: 70,
    height: 55,
    backgroundColor: '#5B7C99',
    borderRadius: 10,
    marginTop: 5,
  },
  phoneInHand: {
    position: 'absolute',
    bottom: 5,
    right: -5,
    width: 25,
    height: 40,
    backgroundColor: '#34495E',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#2C3E50',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  timer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: '#f9f9f9',
  },
  verifyButton: {
    width: '100%',
    backgroundColor:  colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  noteContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 6,
  },
  noteText: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
    textAlign: 'center',
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
});
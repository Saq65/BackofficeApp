import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import colors from '../../styles/colours';

const { width, height } = Dimensions.get('window');

export default function EmailVerification() {
  const [emailId, setEmailId] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const navigation = useNavigation();

  const handleGoogleSignIn = () => {
    console.log('Sign in with Google');
  };

  const handleSubmit = () => {
    console.log('Email ID:', emailId);
    console.log('Branch Code:', branchCode);
    navigation.navigate('EmailOtp')
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

      {/* Title */}
      <Text style={styles.title}>Email Address</Text>

      {/* Google Sign In Button */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <View style={styles.googleIcon}>
          <Text style={styles.googleG}>G</Text>
        </View>
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      {/* OR Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Email ID Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email ID *</Text>
        <TextInput
          style={styles.input}
          value={emailId}
          onChangeText={setEmailId}
          placeholder=""
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Branch/Reference Code Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Branch/Reference Code</Text>
        <TextInput
          style={styles.input}
          value={branchCode}
          onChangeText={setBranchCode}
          placeholder=""
        />
      </View>

      {/* Note */}
      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>
          <Text style={styles.noteBold}>Note:</Text> If you are not aware on Branch Code, Please type{' '}
          <Text style={styles.noteHighlight}>"HCN"</Text>
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Send OTP</Text>
      </TouchableOpacity>
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
    height: responsiveHeight(26),
  },
  illustration: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'relative',
  },
  phoneFrame: {
    width: responsiveWidth(25),
    height: responsiveHeight(22),
    borderWidth: 3,
    borderColor: '#2C3E50',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 8,
    alignItems: 'center',
  },
  phoneTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
    marginBottom: 5,
  },
  shieldIcon: {
    width: 30,
    backgroundColor: '#4A90E2',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  checkmark: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  otpBoxes: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 2,
  },
  miniBox: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  phoneButton: {
    backgroundColor: '#2C3E50',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 8,
  },
  phoneButtonText: {
    color: '#fff',
    fontSize: 7,
    fontWeight: 'bold',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: responsiveWidth(26),
    gap: 3,
  },
  key: {
    width: 22,
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 10,
    color: '#333',
  },
  envelope: {
    position: 'absolute',
    top: -10,
    right: 80,
    transform: [{ rotate: '15deg' }],
  },
  envelopeTop: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  envelopeBody: {
    width: 40,
    height: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    marginTop: -1,
  },
  personIllustration: {
    marginLeft: 15,
    alignItems: 'center',
    marginTop: 20,
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
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  googleButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleG: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  googleButtonText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#999',
    fontSize: 14,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
  },
  noteContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    marginTop: 5,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  noteBold: {
    fontWeight: 'bold',
    color: '#333',
  },
  noteHighlight: {
    fontWeight: 'bold',
    color: '#4A7BA7',
  },
  submitButton: {
    width: '100%',
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
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
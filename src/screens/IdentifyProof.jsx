import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
  Modal,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import SignatureScreen from 'react-native-signature-canvas';

function UploadSignature() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState(null);
  const signatureRef = React.useRef(null);
  const navigation = useNavigation();

  const requestPermission = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }

    try {
      const androidVersion = Platform.Version;
      console.log('🔍 Android Version:', androidVersion);

      let permissions = [];

      if (androidVersion >= 33) {
        permissions = [
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ];
        console.log('📋 Trying Android 13+ permissions');
      } else {
        permissions = [
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ];
        console.log('📋 Trying legacy permissions');
      }

      const results = await PermissionsAndroid.requestMultiple(permissions);
      console.log('📝 Permission results:', results);

      const anyGranted = Object.values(results).some(
        result => result === PermissionsAndroid.RESULTS.GRANTED || result === 'granted'
      );

      console.log('✓ Any permission granted?', anyGranted);

      if (anyGranted) {
        return true;
      }

      Alert.alert(
        'Permission Required',
        'Please enable photo/storage access in Settings to upload documents.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings()
          }
        ]
      );

      return false;

    } catch (err) {
      console.error('❌ Permission error:', err);
      Alert.alert('Error', 'Failed to request permission: ' + err.message);
      return false;
    }
  };

  const handleUpload = async () => {
    console.log('📸 Starting image picker...');

    try {
      const hasPermission = await requestPermission();
      console.log('🔓 Has permission:', hasPermission);

      if (!hasPermission) {
        return;
      }

      const options = {
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
        includeBase64: false,
      };

      console.log('🚀 Launching image library...');

      const result = await launchImageLibrary(options);

      console.log('📦 Result:', JSON.stringify(result, null, 2));

      if (result.didCancel) {
        console.log('👤 User cancelled');
        return;
      }

      if (result.errorCode) {
        console.error('❌ Error:', result.errorCode, result.errorMessage);
        Alert.alert('Error', result.errorMessage || 'Failed to pick image');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log('📄 File selected:', file.fileName, file.fileSize);

        if (file.fileSize && file.fileSize > 5 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select a file smaller than 5MB');
          return;
        }

        setSelectedFile(file);
        Alert.alert('Success', 'File uploaded successfully!');
      } else {
        console.log('⚠️ No assets in result');
      }

    } catch (error) {
      console.error('❌ Picker error:', error);
      Alert.alert('Error', 'Failed to open image picker: ' + error.message);
    }
  };

  const handleDigitalSignature = () => {
    setSignatureModalVisible(true);
  };

  const handleClearSignature = () => {
    signatureRef.current?.clearSignature();
    setDigitalSignature(null);
  };

  const handleConfirmSignature = () => {
    signatureRef.current?.readSignature();
  };

  const handleSignatureOK = (signatureData) => {
    if (signatureData) {
      setDigitalSignature(signatureData);
      setSignatureModalVisible(false);
      Alert.alert('Success', 'Signature captured successfully!');
    } else {
      Alert.alert('Error', 'Please provide a signature');
    }
  };

  const handleSignatureEmpty = () => {
    Alert.alert('Warning', 'Please provide a signature');
  };

  const webStyle = `.m-signature-pad {
    box-shadow: none;
    border: none;
  }
  .m-signature-pad--body {
    border: none;
  }
  .m-signature-pad--footer {
    display: none;
  }
  body,html {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }`;

  const handleNext = () => {
    console.log('➡️ Navigating with file:', selectedFile?.fileName || 'No file selected');
    
    if (!selectedFile && !digitalSignature) {
      Alert.alert('Warning', 'Please upload a signature proof or provide a digital signature');
      return;
    }
    
    navigation.navigate('NextScreen', {
      signatureFile: selectedFile || null,
      digitalSignature: digitalSignature || null,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Text style={styles.header}>Upload Signature</Text>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustration}>
          <View style={styles.documentCard}>
            <Text style={styles.documentTitle}>Informed Consent</Text>
            <View style={styles.documentLines}>
              {[1, 2, 3, 4, 5, 6].map((_, i) => (
                <View key={i} style={styles.line} />
              ))}
            </View>
            <View style={styles.signatureArea}>
              <Text style={styles.signatureText}>Signature</Text>
            </View>
          </View>
          <View style={styles.personIcon}>
            <View style={styles.personCircle} />
            <View style={styles.personBody} />
          </View>
          <View style={styles.checkmarkBadge}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>
      </View>

      {/* Upload Section */}
      <View style={styles.uploadSection}>
        <Text style={styles.sectionTitle}>Upload Signature Proof</Text>
        <Text style={styles.description}>
          Please upload any of the documents asked below in order for us to verify your signature proof
        </Text>

        <Text style={styles.fileInfo}>
          Signed paper (File must be in JPEG, PNG, or PDF format (max size 5MB))
        </Text>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUpload}
          activeOpacity={0.7}
        >
          <Text style={styles.uploadButtonText}>
            {selectedFile ? '✓ File Selected' : 'Upload*'}
          </Text>
        </TouchableOpacity>

        {selectedFile && (
          <View style={styles.fileInfo}>
            <Text style={styles.fileIcon}>✓</Text>
            <View style={styles.fileDetails}>
              <Text style={styles.fileName} numberOfLines={1}>
                {selectedFile.fileName || 'Signature Document'}
              </Text>
              <Text style={styles.fileSize}>
                {selectedFile.fileSize ? `${(selectedFile.fileSize / 1024).toFixed(2)} KB` : 'Size: Unknown'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedFile(null)}>
              <Text style={styles.removeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.orText}>OR</Text>

        <TouchableOpacity
          style={styles.digitalSignatureButton}
          onPress={handleDigitalSignature}
          activeOpacity={0.7}
        >
          <Text style={styles.digitalSignatureText}>Digital Signature</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Digital Signature Modal */}
      <Modal
        visible={signatureModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSignatureModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSignatureModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {/* Header */}
            <Text style={styles.modalTitle}>Digital Signature</Text>
            <View style={styles.divider} />

            {/* Instructions */}
            <Text style={styles.modalInstructions}>
              Please sign on screen, this will be captured as your authorized signature
            </Text>

            {/* Signature Canvas */}
            <View style={styles.signatureContainer}>
              <SignatureScreen
                ref={signatureRef}
                onOK={handleSignatureOK}
                onEmpty={handleSignatureEmpty}
                webStyle={webStyle}
                autoClear={false}
                descriptionText=""
              />
            </View>

            {/* Buttons */}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearSignature}
                activeOpacity={0.7}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmSignature}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  illustration: {
    position: 'relative',
    width: 280,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentCard: {
    width: 180,
    backgroundColor: '#f8f9ff',
    borderWidth: 3,
    borderColor: '#6b9bd1',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  documentLines: {
    marginBottom: 12,
  },
  line: {
    height: 2,
    backgroundColor: '#d0d0d0',
    marginBottom: 4,
    borderRadius: 1,
  },
  signatureArea: {
    borderTopWidth: 1,
    borderTopColor: '#6b9bd1',
    paddingTop: 6,
  },
  signatureText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6b9bd1',
    fontWeight: '600',
  },
  personIcon: {
    position: 'absolute',
    right: 10,
    top: 40,
  },
  personCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f5d7c8',
    marginBottom: 4,
    alignSelf: 'center',
  },
  personBody: {
    width: 40,
    height: 50,
    backgroundColor: '#87ceeb',
    borderRadius: 20,
  },
  checkmarkBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6b9bd1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  uploadSection: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: '#F9F9F9',
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 15,
  },
  fileInfo: {
    fontSize: 11,
    color: '#888',
    marginBottom: 20,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#6b9bd1',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#6b9bd1',
    fontWeight: '600',
  },
  fileInfo: {
    marginTop: 5,
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    fontSize: 20,
    color: '#4CAF50',
    marginRight: 10,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 11,
    color: '#66BB6A',
  },
  removeIcon: {
    fontSize: 18,
    color: '#999',
    paddingHorizontal: 8,
  },
  orText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  digitalSignatureButton: {
    backgroundColor: '#6b9bd1',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 15,
  },
  digitalSignatureText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#B8D9F3',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 2,
    backgroundColor: '#4FC3F7',
    marginBottom: 15,
  },
  modalInstructions: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  signatureContainer: {
    height: 250,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4FC3F7',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
});

export default UploadSignature;
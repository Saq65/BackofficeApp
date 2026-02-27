import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    Alert, 
    ScrollView, 
    Platform, 
    PermissionsAndroid,
    Linking 
} from 'react-native';
import { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

export default function BankProof() {
    const [selectedFile, setSelectedFile] = useState(null);
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

    const pickDocument = async () => {
        console.log('📸 Starting image picker...');
        
        try {
            // Request permission first
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
            
            // Launch image picker
            const result = await launchImageLibrary(options);
            
            console.log('📦 Result:', JSON.stringify(result, null, 2));

            // Handle result
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

                // Check file size
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

    const handleNext = () => {
        console.log('➡️ Navigating with file:', selectedFile?.fileName || 'No file selected');
        
        navigation.navigate('IdentifyProof', {
            bankProofFile: selectedFile || null
        });
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.subtitle}>
                    Please upload any of the documents asked below in order{'\n'}
                    for us to verify your bank account
                </Text>
            </View>

            <View style={styles.lottieContainer}>
                <LottieView
                    source={require('../../assets/BankProof.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
            </View>

            <View style={styles.uploadSection}>
                <Text style={styles.uploadTitle}>Upload Bank Proof</Text>
                <Text style={styles.uploadSubtitle}>
                    Please upload any of the documents asked below in{'\n'}
                    order for us to verify your bank account
                </Text>
                <Text style={styles.uploadInfo}>
                    Upload Pass Book (First page in JPEG, PNG format{'\n'}
                    (max size 5MB))
                </Text>

                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={pickDocument}
                    activeOpacity={0.7}
                >
                    <Text style={styles.uploadButtonText}>
                        {selectedFile ? '✓ File Selected' : 'Upload'}
                    </Text>
                </TouchableOpacity>

                {selectedFile && (
                    <View style={styles.fileInfo}>
                        <Text style={styles.fileIcon}>✓</Text>
                        <View style={styles.fileDetails}>
                            <Text style={styles.fileName} numberOfLines={1}>
                                {selectedFile.fileName || 'Bank Document'}
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
            </View>

            <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                activeOpacity={0.7}
            >
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    lottieContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    lottie: {
        width: 200,
        height: 200,
    },
    uploadSection: {
        paddingHorizontal: 20,
        paddingVertical: 25,
        backgroundColor: '#F9F9F9',
        marginHorizontal: 20,
        borderRadius: 8,
        marginBottom: 30,
    },
    uploadTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    uploadSubtitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 15,
    },
    uploadInfo: {
        fontSize: 11,
        color: '#888',
        textAlign: 'center',
        lineHeight: 16,
        marginBottom: 20,
    },
    uploadButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    uploadButtonText: {
        fontSize: 14,
        color: '#666',
    },
    fileInfo: {
        marginTop: 15,
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
    nextButton: {
        backgroundColor: '#B8D9F3',
        paddingVertical: 14,
        marginHorizontal: 20,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 30,
    },
    nextButtonDisabled: {
        opacity: 0.5,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
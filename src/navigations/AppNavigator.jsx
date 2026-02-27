import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import SplashScreen from '../screens/SpalshScreen';
import Login from '../screens/auth/Login';
import SignUp from '../screens/auth/SignUp';
import Otp from '../screens/auth/Otp';
import EmailVerfication from '../screens/auth/EmailVerfication';
import EmailOtp from '../screens/auth/EmailOtp';
import SegmentScreen from '../screens/SegmentScreen';
import PanScreen from '../screens/PanScreen';
import ConfirmDetails from '../screens/ConfirmDetails';
import PersonalDetails from '../screens/PersonalDetails';
import NomineeDetails from '../screens/NomineeDetails';
import BankDetails from '../screens/BankDetails';
import BankProof from '../screens/BankProof';
import IdentifyProof from '../screens/IdentifyProof';
import UploadSignature from '../screens/UploadSignature';
import WebCam from '../screens/WebCamScreen';
import Aadhar from '../screens/verification/AadharValidation';
import MainLayout from '../mainlayout/MainLayout';
import Logo from '../../assets/logo.png';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Icons from 'react-native-vector-icons/Feather';

const Stack = createNativeStackNavigator();

const HeaderLogo = () => {
    return (
        <View style={styles.logoContainer}>
            <Image
                source={Logo}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
};

const BackButton = ({ navigation, canGoBack }) => {
    if (!canGoBack) return <View style={styles.backButtonPlaceholder} />;

    return (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
        >
            {/* <Text style={styles.backArrow}>

            </Text> */}

            <Icons name="arrow-left" style={styles.backArrow} />
        </TouchableOpacity>
    );
};

const AppNavigator = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            setIsAuthenticated(!!userToken);
        } catch (error) {
            console.log('Auth check error:', error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    };

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={({ navigation }) => ({
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#FFFFFF',
                        elevation: 2,
                        shadowOpacity: 0.1,
                        height: 70,
                    },
                    headerTintColor: '#333',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontWeight: '600',
                        fontSize: 18,
                    },
                    headerLeft: () => (
                        <BackButton
                            navigation={navigation}
                            canGoBack={navigation.canGoBack()}
                        />
                    ),
                    headerLeftContainerStyle: {
                        paddingLeft: 15,
                    },
                    headerRightContainerStyle: {
                        paddingRight: 15,
                    },
                })}
            >
                {isAuthenticated ? (
                    <Stack.Screen
                        name="Main"
                        component={MainLayout}
                        options={{ headerShown: false }}
                    />
                ) : (
                    <>
                        <Stack.Screen
                            name="SignUp"
                            component={SignUp}
                            options={{
                                title: 'Sign Up',
                                headerLeft: () => <HeaderLogo />
                            }}
                        />
                        <Stack.Screen
                            name="Login"
                            component={Login}
                            options={{ title: 'Login' }}
                        />
                        <Stack.Screen
                            name="Otp"
                            component={Otp}
                            options={{ title: 'Verify OTP' }}
                        />
                        <Stack.Screen
                            name="EmailVerfication"
                            component={EmailVerfication}
                            options={{ title: 'Email Verification' }}
                        />
                        <Stack.Screen
                            name="EmailOtp"
                            component={EmailOtp}
                            options={{ title: 'Verify Email OTP' }}
                        />
                        <Stack.Screen
                            name="SegmentScreen"
                            component={SegmentScreen}
                            options={{ title: 'Select Segment' }}
                        />
                        <Stack.Screen
                            name="PanScreen"
                            component={PanScreen}
                            options={{ title: 'PAN Verification' }}
                        />
                        <Stack.Screen
                            name="ConfirmDetails"
                            component={ConfirmDetails}
                            options={{ title: 'Confirm Details' }}
                        />

                        <Stack.Screen
                            name="PersonalDetails"
                            component={PersonalDetails}
                            options={{ title: 'Personal Details' }}
                        />

                        <Stack.Screen
                            name="NomineeDetails"
                            component={NomineeDetails}
                            options={{ title: 'Nominee Details' }}
                        />


                        <Stack.Screen
                            name="BankDetails"
                            component={BankDetails}
                            options={{ title: 'Bank Details' }}
                        />

                        <Stack.Screen
                            name="BankProof"
                            component={BankProof}
                            options={{ title: 'Bank Proof' }}
                        />

                        <Stack.Screen
                            name="IdentifyProof"
                            component={IdentifyProof}
                            options={{ title: 'Identify Proof' }}
                        />

                        <Stack.Screen
                            name="UploadSignature"
                            component={UploadSignature}
                            options={{ title: 'Upload Signature' }}
                        />

                         <Stack.Screen
                            name="WebCam"
                            component={WebCam}
                            options={{ title: 'WebCam' }}
                        />

                        <Stack.Screen 
                            name="AadharVerification"
                            component={Aadhar}
                            options={{title:'Aadhar Verification'}}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: responsiveWidth(25),
        height: responsiveHeight(6),
    },
    backButton: {
        padding: 5,
    },
    backArrow: {
        fontSize: responsiveFontSize(3),
        color: '#333',
        fontWeight: 'bold',
    },
    backButtonPlaceholder: {
        width: 34,
    },
});

export default AppNavigator;
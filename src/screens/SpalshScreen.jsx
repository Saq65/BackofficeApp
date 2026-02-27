import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import colors from '../styles/colours';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        let isMounted = true;

        const bootstrapAsync = async () => {
            let destination = 'Login';

            try {
                const splashPromise = new Promise(resolve => setTimeout(resolve, 2000));
                const [token, user] = await Promise.all([
                    AsyncStorage.getItem('token'),
                    AsyncStorage.getItem('user'),
                    splashPromise
                ]);

                if (token && user && isMounted) {
                    destination = 'Main';
                }
            } catch (err) {
                console.warn('Splash error:', err);
            }

            if (isMounted && navigation) {
                navigation.replace(destination);
            }
        };

        bootstrapAsync();

        return () => { 
            isMounted = false; 
        };

    }, [navigation]);

    return (
        <View style={styles.container}>
            <StatusBar 
                backgroundColor="#fff" 
                barStyle="dark-content" 
                translucent={false} 
            />

            {/* <Image
                source={require('../../assets/logo-stackart.png')}
                style={styles.logo}
                resizeMode="contain"
            /> */}

            <ActivityIndicator
                size="large"
                color={colors.primary || '#007AFF'}
                style={styles.loader}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: wp('70%'),
        height: hp('12%'),
        maxWidth: 300,
        maxHeight: 120,
    },
    loader: {
        marginTop: 40,
    },
});
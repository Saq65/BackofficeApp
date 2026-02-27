import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainLayout from '../mainlayout/MainLayout'
import Login from './auth/Login'

export default function HomeScreen() {
    return (
        <View>
            <SafeAreaView>
                <MainLayout>
                    <Login />
                </MainLayout>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({})
import { StyleSheet, Text, View } from 'react-native'
import { Image } from 'react-native-svg'

export default function Header() {
    return (
        <View>
            <Text>Header</Text>
            <Image source={require('../../assets/logo.png')} style={{width: 100, height: 50}} />
        </View> 
    )
}

const styles = StyleSheet.create({})
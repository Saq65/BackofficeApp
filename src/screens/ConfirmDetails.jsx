import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import { responsiveHeight } from 'react-native-responsive-dimensions'

export default function ConfirmDetails() {
       
    const navigation = useNavigation();
    
  return (
    <View style={styles.container}>      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://static.vecteezy.com/system/resources/previews/067/619/141/non_2x/flat-style-cartoon-boy-avatar-smiling-male-profile-icon-for-app-web-and-social-media-vector.jpg' }}
              style={styles.profileImage}
            />
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>Shayam Kumar</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Date of birth</Text>
              <Text style={styles.value}>10-08-2004</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Father name</Text>
              <Text style={styles.value}>S/O: Shankar Kumar</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Aadhaar address</Text>
              <Text style={styles.value}>
                537 ek/88 naya purwa faizullabganj Nirale Nagar Lucknow Uttar Pradesh 226020
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Gender</Text>
                <Text style={styles.value}>Male</Text>
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Aadhaar no.</Text>
                <Text style={styles.value}>xxxxxxxxxxxx1175</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={()=>navigation.navigate('PersonalDetails')} style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirm & Proceed</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  value: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    flex: 1,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#2D8C4E',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
import { StyleSheet, Text, View, ScrollView } from 'react-native'

export default function WebCamScreen() {
  const instructions = [
    { id: 1, image: '👤', label: 'Face forward', isCorrect: true },
    { id: 2, image: '👤', label: 'Remove glasses', isCorrect: false },
    { id: 3, image: '👤', label: 'Good lighting', isCorrect: false },
    { id: 4, image: '👤', label: 'Neutral expression', isCorrect: false },
    { id: 5, image: '👤', label: 'Remove hat', isCorrect: false },
    { id: 6, image: '👤', label: 'Look at camera', isCorrect: false },
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Main Camera View */}
        <View style={styles.cameraContainer}>
          <View style={styles.cameraFrame}>
            <View style={styles.ovalFrame}>
              <View style={styles.ovalInner}>
                <View style={styles.facePlaceholder}>
                  <Text style={styles.faceEmoji}>👤</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Status Text */}
          <Text style={styles.statusText}>
            Please wait while we are{'\n'}detecting your face...
          </Text>
        </View>

        {/* Instructions Section */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>
            Webcam Client Image Instructions
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.instructionsScroll}
          >
            {instructions.map((instruction) => (
              <View 
                key={instruction.id} 
                style={[
                  styles.instructionCard,
                  instruction.isCorrect && styles.instructionCardActive
                ]}
              >
                <View style={styles.instructionImage}>
                  <Text style={styles.instructionEmoji}>{instruction.image}</Text>
                  {instruction.isCorrect && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.instructionLabel}>{instruction.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Powered by Footer */}
        <Text style={styles.footer}>Powered by <Text style={styles.footerBrand}>iProov</Text></Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E4F3',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  cameraContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cameraFrame: {
    width: '100%',
    aspectRatio: 0.75,
    backgroundColor: '#4A5568',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  ovalFrame: {
    width: '60%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ovalInner: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  facePlaceholder: {
    width: '95%',
    height: '95%',
    borderRadius: 1000,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceEmoji: {
    fontSize: 80,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#2D3748',
    lineHeight: 24,
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 15,
  },
  instructionsScroll: {
    flexDirection: 'row',
  },
  instructionCard: {
    width: 100,
    backgroundColor: '#FFE5E5',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  instructionCardActive: {
    backgroundColor: '#C6F6D5',
  },
  instructionImage: {
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  instructionEmoji: {
    fontSize: 30,
  },
  checkmark: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: '#48BB78',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    color: '#2D3748',
  },
  footer: {
    textAlign: 'right',
    fontSize: 12,
    color: '#718096',
    marginTop: 10,
  },
  footerBrand: {
    fontWeight: '700',
    color: '#4A5568',
  },
})
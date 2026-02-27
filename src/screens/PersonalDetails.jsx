import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import colors from '../styles/colours'
import { useNavigation } from '@react-navigation/native';

export default function PersonalDetails() {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        fatherName: 'D/O: Gauri Shankar',
        motherName: '',
        gender: '',
        maritalStatus: '',
        education: '',
        annualIncome: '',
        tradingExperience: '',
        politicallyExposed: '',
        occupation: '',
        citizenOfIndia: '',
        sendEmail: '',
        shareEmailWithRTA: '',
        receiveAnnualReport: '',
    })

    const [checkboxes, setCheckboxes] = useState({
        transferSecurities: false,
        pledging: false,
        mutualFund: false,
        tendering: false,
    })

    const handleCheckbox = (key) => {
        setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleSubmit = () => {
        console.log('Form Data:', formData)
        console.log('Checkboxes:', checkboxes);
        navigation.navigate('NomineeDetails');
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Personal Details</Text>
            </View>

            <View style={styles.formContainer}>
                {/* Father's Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Father's Name <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={formData.fatherName}
                        onChangeText={(text) => setFormData({ ...formData, fatherName: text })}
                    />
                </View>

                {/* Mother's Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mother's Name <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={formData.motherName}
                        onChangeText={(text) => setFormData({ ...formData, motherName: text })}
                        placeholder=""
                    />
                </View>

                {/* Gender */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Gender <Text style={styles.required}>*</Text></Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.gender}
                            onValueChange={(value) => setFormData({ ...formData, gender: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="--Select--" value="" />
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                            <Picker.Item label="Other" value="other" />
                        </Picker>
                    </View>
                </View>

                {/* Marital Status */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Marital Status <Text style={styles.required}>*</Text></Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.maritalStatus}
                            onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="--Select--" value="" />
                            <Picker.Item label="Single" value="single" />
                            <Picker.Item label="Married" value="married" />
                            <Picker.Item label="Divorced" value="divorced" />
                            <Picker.Item label="Widowed" value="widowed" />
                        </Picker>
                    </View>
                </View>

                {/* Education */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Education <Text style={styles.required}>*</Text></Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.education}
                            onValueChange={(value) => setFormData({ ...formData, education: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="--Select--" value="" />
                            <Picker.Item label="High School" value="highschool" />
                            <Picker.Item label="Graduate" value="graduate" />
                            <Picker.Item label="Post Graduate" value="postgraduate" />
                            <Picker.Item label="Professional" value="professional" />
                        </Picker>
                    </View>
                </View>

                {/* Annual Income */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Annual Income <Text style={styles.required}>*</Text></Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.annualIncome}
                            onValueChange={(value) => setFormData({ ...formData, annualIncome: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="--Select--" value="" />
                            <Picker.Item label="Below 1 Lakh" value="below1" />
                            <Picker.Item label="1-5 Lakhs" value="1to5" />
                            <Picker.Item label="5-10 Lakhs" value="5to10" />
                            <Picker.Item label="10-25 Lakhs" value="10to25" />
                            <Picker.Item label="Above 25 Lakhs" value="above25" />
                        </Picker>
                    </View>
                </View>

                {/* Trading Experience */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Trading Experience (in years) <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={formData.tradingExperience}
                        onChangeText={(text) => setFormData({ ...formData, tradingExperience: text })}
                        placeholder=""
                        keyboardType="numeric"
                    />
                </View>

                {/* Politically Exposed */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Politically Exposed <Text style={styles.required}>*</Text></Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.politicallyExposed}
                            onValueChange={(value) => setFormData({ ...formData, politicallyExposed: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="--Select--" value="" />
                            <Picker.Item label="Yes" value="yes" />
                            <Picker.Item label="No" value="no" />
                        </Picker>
                    </View>
                </View>

                {/* Occupation */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Occupation <Text style={styles.required}>*</Text></Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.occupation}
                            onValueChange={(value) => setFormData({ ...formData, occupation: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="--Select--" value="" />
                            <Picker.Item label="Salaried" value="salaried" />
                            <Picker.Item label="Self Employed" value="self-employed" />
                            <Picker.Item label="Business Owner" value="business-owner" />
                            <Picker.Item label="Retired" value="retired" />
                        </Picker>
                    </View>
                </View>

                {/* Citizen of India */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Are you citizen of India <Text style={styles.required}>*</Text></Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.citizenOfIndia}
                            onValueChange={(value) => setFormData({ ...formData, citizenOfIndia: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="--Select--" value="" />
                            <Picker.Item label="Yes" value="yes" />
                            <Picker.Item label="No" value="no" />
                        </Picker>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Email Preferences */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        I/ We request you to send Electronic Transaction-cum-Holding Statement in the email ID <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.sendEmail}
                            onValueChange={(value) => setFormData({ ...formData, sendEmail: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="--Select--" value="" />
                            <Picker.Item label="YES" value="yes" />
                            <Picker.Item label="NO" value="no" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        I/We would like to share the email ID with the RTA <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.shareEmailWithRTA}
                            onValueChange={(value) => setFormData({ ...formData, shareEmailWithRTA: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="--Select--" value="" />
                            <Picker.Item label="YES" value="yes" />
                            <Picker.Item label="NO" value="no" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        I/We would like to receive the Annual Report. <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.receiveAnnualReport}
                            onValueChange={(value) => setFormData({ ...formData, receiveAnnualReport: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="--Select--" value="" />
                            <Picker.Item label="Physical" value="Physical" />
                            <Picker.Item label="Electronic" value="Electronic" />
                            <Picker.Item label="Both" value="Both" />
                        </Picker>
                    </View>
                </View>

                {/* Checkboxes Section */}
                <View style={styles.checkboxSection}>
                    <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => handleCheckbox('transferSecurities')}
                    >
                        <View style={[styles.checkbox, checkboxes.transferSecurities && styles.checkboxChecked]}>
                            {checkboxes.transferSecurities && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxText}>
                            Transfer of securities held in the beneficial owner accounts of the client towards Stock Exchange related deliveries / settlement obligations arising out of trades executed by clients on the Stock Exchange through the same stock broker
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => handleCheckbox('pledging')}
                    >
                        <View style={[styles.checkbox, checkboxes.pledging && styles.checkboxChecked]}>
                            {checkboxes.pledging && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxText}>
                            Pledging / re-pledging of securities in favour of trading member (TM) / clearing member (CM) for the purpose of meeting margin requirements of the clients and/or clients with the trades executed by the clients on the Stock Exchange.
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => handleCheckbox('mutualFund')}
                    >
                        <View style={[styles.checkbox, checkboxes.mutualFund && styles.checkboxChecked]}>
                            {checkboxes.mutualFund && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxText}>
                            Mutual Fund transactions being executed on Stock Exchange order entry platforms
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => handleCheckbox('tendering')}
                    >
                        <View style={[styles.checkbox, checkboxes.tendering && styles.checkboxChecked]}>
                            {checkboxes.tendering && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxText}>
                            Tendering shares in open offers through Stock Exchange platforms
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: colors.primary,
        padding: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    formContainer: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 6,
    },
    required: {
        color: '#E74C3C',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        backgroundColor: '#fff',
        color: '#333',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 20,
    },
    checkboxSection: {
        marginTop: 10,
        marginBottom: 20,
    },
    checkboxRow: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 3,
        marginRight: 10,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: colors.primary,
    },
    checkmark: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    checkboxText: {
        flex: 1,
        fontSize: 13,
        color: '#333',
        lineHeight: 20,
    },
    submitButton: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Pressable,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import colors from '../styles/colours';

const SEGMENTS = [
    { id: 1, label: 'NSEI Cash', value: 'nsei_cash' },
    { id: 2, label: 'NSEI F&O', value: 'nsei_fo' },
    { id: 3, label: 'NSE FX', value: 'nse_fx' },
    { id: 4, label: 'NSE CD', value: 'nse_cd' },
    { id: 5, label: 'NSEI SLBM EQ', value: 'nsei_slbm_eq' },
    { id: 6, label: 'NSEI SLBM FO', value: 'nsei_slbm_fo' },
    { id: 7, label: 'NSEI COMDTY', value: 'nsei_comdty' },
    { id: 8, label: 'NSEI GOVTSEC', value: 'nsei_govtsec' },
    { id: 9, label: 'MCX CASH', value: 'mcx_cash' },
];

const BROKERAGE_PLANS = [
    {
        category: 'Equities - NSE / BSE',
        items: [
            { type: 'Delivery', rate: '0.5%', charge: 'Rs. 0.10 per unit' },
            { type: 'Trading', rate: '0.05%', charge: 'Rs. 0.10 per unit' },
        ],
    },
    {
        category: 'NSE FNO / BSE FNO / NSE COMMODITY / BSE COMMODITY / MCX COMMODITY / NSE CURRENCY / BSE CURRENCY',
        items: [
            { type: 'Futures', rate: '0.05%', charge: 'Rs. 150 per unit' },
            { type: 'Options', rate: '0.05%', charge: 'Rs. 100 per unit' },
        ],
    },
];

export default function SegmentScreen() {
    const navigation = useNavigation();
    const [selectedSegments, setSelectedSegments] = useState({
        nsei_cash: true,
        nsei_fo: true,
        nse_fx: true,
        nse_cd: true,
    });
    const [showBrokeragePlan, setShowBrokeragePlan] = useState(false);

    const handleCheckboxToggle = (value) => {
        setSelectedSegments((prev) => ({
            ...prev,
            [value]: !prev[value],
        }));
    };

    const handleNext = () => {
        const selected = Object.keys(selectedSegments).filter(
            (key) => selectedSegments[key]
        );
        console.log('Selected segments:', selected);
        navigation.navigate('PanScreen');
    };

    const isAnySelected = Object.values(selectedSegments).some((val) => val);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Title */}
                <Text style={styles.title}>Choose your Segment</Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>Select your trading preferences.</Text>

                {/* Segment Checkboxes */}
                <View style={styles.segmentsContainer}>
                    {SEGMENTS.map((segment) => (
                        <View key={segment.id} style={styles.checkboxRow}>
                            <CheckBox
                                value={selectedSegments[segment.value] || false}
                                onValueChange={() => handleCheckboxToggle(segment.value)}
                                tintColors={{ true: '#1976D2', false: '#999' }}
                                style={styles.checkbox}
                            />
                            <Text style={styles.checkboxLabel}>{segment.label}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.brokerageLink}
                    onPress={() => setShowBrokeragePlan(true)}
                >
                    <Text style={styles.brokerageLinkText}>View Brokerage Plan</Text>
                </TouchableOpacity>

                {/* Next Button */}
                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        isAnySelected && styles.nextButtonActive,
                    ]}
                    onPress={handleNext}
                    disabled={!isAnySelected}
                >
                    <Text
                        style={[
                            styles.nextButtonText,
                            isAnySelected && styles.nextButtonTextActive,
                        ]}
                    >
                        Next
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Enhanced Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showBrokeragePlan}
                onRequestClose={() => setShowBrokeragePlan(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={styles.modalBackdrop}
                        onPress={() => setShowBrokeragePlan(false)}
                    />
                    <View style={styles.modalContent}>
                        {/* Modal Header with Icon */}
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHeaderLeft}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.iconText}>💰</Text>
                                </View>
                                <View>
                                    <Text style={styles.modalTitle}>Brokerage Plan</Text>
                                    <Text style={styles.modalSubtitle}>Trading charges breakdown</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowBrokeragePlan(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Info Banner */}
                        <View style={styles.infoBanner}>
                            <Text style={styles.infoBannerIcon}>ℹ️</Text>
                            <Text style={styles.infoBannerText}>
                                Competitive rates for all trading segments
                            </Text>
                        </View>

                        <ScrollView
                            style={styles.tableScrollView}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Enhanced Table */}
                            <View style={styles.tableContainer}>
                                {/* Table Header */}
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderText, styles.categoryColumn]}>
                                        Category
                                    </Text>
                                    <Text style={[styles.tableHeaderText, styles.typeColumn]}>
                                        Type
                                    </Text>
                                    <Text style={[styles.tableHeaderText, styles.rateColumn]}>
                                        Rate
                                    </Text>
                                    <Text style={[styles.tableHeaderText, styles.chargeColumn]}>
                                        Min. Charge
                                    </Text>
                                </View>

                                {/* Table Rows with Enhanced Styling */}
                                {BROKERAGE_PLANS.map((plan, planIndex) => (
                                    <View key={planIndex} style={styles.planSection}>
                                        {plan.items.map((item, itemIndex) => (
                                            <View
                                                key={itemIndex}
                                                style={[
                                                    styles.tableRow,
                                                    itemIndex === plan.items.length - 1 && styles.lastRow,
                                                ]}
                                            >
                                                {itemIndex === 0 && (
                                                    <View style={[styles.categoryColumn, styles.categoryCell]}>
                                                        <Text style={styles.categoryText}>
                                                            {plan.category}
                                                        </Text>
                                                    </View>
                                                )}
                                                {itemIndex !== 0 && <View style={styles.categoryColumn} />}
                                                
                                                <View style={styles.typeColumn}>
                                                    <Text style={styles.tableCellText}>{item.type}</Text>
                                                </View>
                                                
                                                <View style={styles.rateColumn}>
                                                    <View style={styles.rateTag}>
                                                        <Text style={styles.rateText}>{item.rate}</Text>
                                                    </View>
                                                </View>
                                                
                                                <View style={styles.chargeColumn}>
                                                    <Text style={styles.chargeText}>{item.charge}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>

                            <View style={styles.footerInfo}>
                                <Text style={styles.footerInfoText}>
                                    * All charges are exclusive of GST and regulatory fees
                                </Text>
                            </View>
                        </ScrollView>

                        {/* Action Buttons */}
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.outlineButton}
                                onPress={() => setShowBrokeragePlan(false)}
                            >
                                <Text style={styles.outlineButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.selectButton}
                                onPress={() => setShowBrokeragePlan(false)}
                            >
                                <Text style={styles.selectButtonText}>Accept Plan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveHeight(3),
        paddingBottom: responsiveHeight(4),
        alignItems: 'center',
    },
    title: {
        fontSize: responsiveFontSize(3),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: responsiveHeight(1),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: responsiveFontSize(2),
        color: '#333',
        marginBottom: responsiveHeight(3),
        textAlign: 'center',
        fontWeight: '500',
    },
    segmentsContainer: {
        width: '100%',
        marginBottom: responsiveHeight(2),
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(2),
        borderBottomWidth: 0.5,
        borderBottomColor: '#E0E0E0',
    },
    checkbox: {
        marginRight: responsiveWidth(3),
        transform: Platform.OS === 'ios' ? [{ scaleX: 0.9 }, { scaleY: 0.9 }] : [],
    },
    checkboxLabel: {
        fontSize: responsiveFontSize(2),
        color: '#333',
        fontWeight: '500',
    },
    brokerageLink: {
        marginTop: responsiveHeight(2),
        marginBottom: responsiveHeight(3),
        paddingVertical: responsiveHeight(1.2),
        paddingHorizontal: responsiveWidth(6),
        backgroundColor: '#1A237E',
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    brokerageLinkText: {
        fontSize: responsiveFontSize(1.8),
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
    nextButton: {
        width: '100%',
        backgroundColor: '#BBDEFB',
        paddingVertical: responsiveHeight(2),
        borderRadius: 8,
        alignItems: 'center',
        opacity: 0.6,
    },
    nextButtonActive: {
        backgroundColor: colors.primary,
        opacity: 1,
    },
    nextButtonText: {
        fontSize: responsiveFontSize(2.2),
        fontWeight: '600',
        color: '#1976D2',
        letterSpacing: 0.5,
    },
    nextButtonTextActive: {
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: responsiveHeight(2.5),
        paddingBottom: responsiveHeight(3),
        paddingHorizontal: responsiveWidth(4),
        maxHeight: responsiveHeight(85),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: responsiveHeight(2),
    },
    modalHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: responsiveWidth(12),
        height: responsiveWidth(12),
        borderRadius: responsiveWidth(6),
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: responsiveWidth(3),
    },
    iconText: {
        fontSize: responsiveFontSize(3),
    },
    modalTitle: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 2,
    },
    modalSubtitle: {
        fontSize: responsiveFontSize(1.6),
        color: '#666',
    },
    closeButton: {
        padding: 8,
        marginTop: -4,
    },
    closeButtonText: {
        fontSize: responsiveFontSize(3),
        color: '#666',
        fontWeight: '300',
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingVertical: responsiveHeight(1.2),
        paddingHorizontal: responsiveWidth(3),
        borderRadius: 8,
        marginBottom: responsiveHeight(2),
    },
    infoBannerIcon: {
        fontSize: responsiveFontSize(2),
        marginRight: responsiveWidth(2),
    },
    infoBannerText: {
        fontSize: responsiveFontSize(1.6),
        color: '#2E7D32',
        fontWeight: '500',
        flex: 1,
    },
    tableScrollView: {
        maxHeight: responsiveHeight(45),
    },
    tableContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1A237E',
        paddingVertical: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(2),
    },
    tableHeaderText: {
        fontSize: responsiveFontSize(1.5),
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    planSection: {
        backgroundColor: '#fff',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingVertical: responsiveHeight(1.8),
        paddingHorizontal: responsiveWidth(2),
        minHeight: responsiveHeight(7),
        alignItems: 'center',
    },
    lastRow: {
        borderBottomWidth: 2,
        borderBottomColor: '#E0E0E0',
    },
    categoryColumn: {
        flex: 2.5,
        justifyContent: 'center',
    },
    categoryCell: {
        paddingRight: responsiveWidth(2),
    },
    categoryText: {
        fontSize: responsiveFontSize(1.5),
        color: '#1A237E',
        fontWeight: '600',
        lineHeight: responsiveFontSize(2),
    },
    typeColumn: {
        flex: 1.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rateColumn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chargeColumn: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableCellText: {
        fontSize: responsiveFontSize(1.5),
        color: '#333',
        textAlign: 'center',
        fontWeight: '500',
    },
    rateTag: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(0.5),
        borderRadius: 6,
    },
    rateText: {
        fontSize: responsiveFontSize(1.5),
        color: '#1976D2',
        fontWeight: '700',
    },
    chargeText: {
        fontSize: responsiveFontSize(1.4),
        color: '#666',
        textAlign: 'center',
        fontWeight: '500',
    },
    footerInfo: {
        marginTop: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(2),
    },
    footerInfoText: {
        fontSize: responsiveFontSize(1.4),
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    modalActions: {
        flexDirection: 'row',
        marginTop: responsiveHeight(2.5),
        gap: responsiveWidth(3),
    },
    outlineButton: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#1976D2',
        paddingVertical: responsiveHeight(1.6),
        borderRadius: 8,
        alignItems: 'center',
    },
    outlineButtonText: {
        fontSize: responsiveFontSize(1.9),
        fontWeight: '600',
        color: '#1976D2',
    },
    selectButton: {
        flex: 1,
        backgroundColor: '#1976D2',
        paddingVertical: responsiveHeight(1.8),
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#1976D2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    selectButtonText: {
        fontSize: responsiveFontSize(1.9),
        fontWeight: '600',
        color: '#fff',
    },
});
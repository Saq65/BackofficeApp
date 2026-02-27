import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Linking,
  Alert,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
z
// ─── THEME ──
const C = {
  primary:      '#004aad',
  primaryDark:  '#003080',
  primaryLight: '#E8F0FC',
  secondary:    '#ffffff',
  bg:           '#F5F7FF',
  card:         '#ffffff',
  text:         '#0D1B3E',
  sub:          '#6B7280',
  border:       '#D1D9F0',
  success:      '#10B981',
  danger:       '#EF4444',
};

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const DIGILOCKER_CONFIG = {
  CLIENT_ID:    'YOUR_CLIENT_ID',
  REDIRECT_URI: 'yourapp://digilocker',
  AUTH_URL:     'https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize',
  TOKEN_URL:    'https://digilocker.meripehchaan.gov.in/public/oauth2/1/token',
  AADHAAR_URI:  'in.gov.uidai.aadhaar-reg',
};

const STEPS = {
  ENTER_AADHAAR: 'ENTER_AADHAAR',
  VERIFY_OTP:    'VERIFY_OTP',
  SUCCESS:       'SUCCESS',
};

function maskAadhaar(num) {
  if (!num) return '';
  const clean = num.replace(/\s/g, '');
  if (clean.length <= 4) return clean;
  return 'XXXX XXXX ' + clean.slice(-4);
}

function generateCodeVerifier() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  for (let i = 0; i < 64; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

function formatTime(s) {
  const m   = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function AadharValidation({ navigation }) {
  const [step, setStep]             = useState(STEPS.ENTER_AADHAAR);
  const [aadhaarNumber, setAadhaar] = useState('');
  const [otp, setOtp]               = useState(['', '', '', '', '', '']);
  const [loading, setLoading]       = useState(false);
  const [timer, setTimer]           = useState(0);
  const [kycData, setKycData]       = useState(null);
  const [method, setMethod]         = useState('otp');

  const otpRefs      = useRef([]);
  const fadeAnim     = useRef(new Animated.Value(0)).current;
  const slideAnim    = useRef(new Animated.Value(24)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const timerRef     = useRef(null);

  useEffect(() => {
    animateIn();
    return () => clearInterval(timerRef.current);
  }, [step]);

  useEffect(() => {
    const handleUrl = ({ url }) => handleDeepLink(url);
    const sub = Linking.addEventListener('url', handleUrl);
    Linking.getInitialURL().then(url => { if (url) handleDeepLink(url); });
    return () => sub?.remove();
  }, []);

  function animateIn() {
    fadeAnim.setValue(0);
    slideAnim.setValue(24);
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start();
  }

  function handleAadhaarChange(text) {
    const digits    = text.replace(/\D/g, '').slice(0, 12);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setAadhaar(formatted);
  }

  function startTimer(seconds = 60) {
    clearInterval(timerRef.current);
    setTimer(seconds);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  function handleOtpChange(text, index) {
    const val    = text.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyPress(e, index) {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  async function handleSendOtp() {
    const clean = aadhaarNumber.replace(/\s/g, '');
    if (clean.length !== 12) {
      Alert.alert('Invalid Aadhaar', 'Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    setLoading(true);
    try {
      // TODO: POST https://your-backend.com/send-otp  { aadhaar: clean }
      await new Promise(r => setTimeout(r, 1500));
      setStep(STEPS.VERIFY_OTP);
      startTimer(60);
    } catch {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    const code = otp.join('');
    if (code.length !== 6) {
      Alert.alert('Incomplete OTP', 'Please enter all 6 digits.');
      return;
    }
    setLoading(true);
    try {
      // TODO: POST https://your-backend.com/verify-otp  { aadhaar, otp: code }
      await new Promise(r => setTimeout(r, 1500));
      setKycData({
        name: 'Rahul Kumar', dob: '15/08/1995', gender: 'Male',
        address: '42, MG Road, Bengaluru, Karnataka - 560001',
        aadhaar: aadhaarNumber,
      });
      setStep(STEPS.SUCCESS);
      Animated.spring(successScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    } catch {
      Alert.alert('Invalid OTP', 'The OTP you entered is incorrect.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDigilockerRedirect() {
    const verifier = generateCodeVerifier();
    const state    = Math.random().toString(36).substring(2, 15);
    const params   = new URLSearchParams({
      response_type: 'code', client_id: DIGILOCKER_CONFIG.CLIENT_ID,
      redirect_uri: DIGILOCKER_CONFIG.REDIRECT_URI, state,
      code_challenge: verifier, code_challenge_method: 'plain', dl_flow: 'signup',
    });
    const authUrl = `${DIGILOCKER_CONFIG.AUTH_URL}?${params.toString()}`;
    try {
      const supported = await Linking.canOpenURL(authUrl);
      if (supported) await Linking.openURL(authUrl);
      else Alert.alert('Error', 'Cannot open DigiLocker. Please install the DigiLocker app.');
    } catch {
      Alert.alert('Error', 'Failed to open DigiLocker.');
    }
  }

  async function handleDeepLink(url) {
    if (!url?.startsWith('yourapp://digilocker')) return;
    const urlObj = new URL(url);
    const code   = urlObj.searchParams.get('code');
    const error  = urlObj.searchParams.get('error');
    if (error) { Alert.alert('DigiLocker Error', 'Access denied.'); return; }
    if (code) {
      setLoading(true);
      try {
        // TODO: exchange code for Aadhaar data via your backend
        await new Promise(r => setTimeout(r, 2000));
        setKycData({
          name: 'Rahul Kumar', dob: '15/08/1995', gender: 'Male',
          address: '42, MG Road, Bengaluru, Karnataka - 560001',
          aadhaar: aadhaarNumber, source: 'DigiLocker',
        });
        setStep(STEPS.SUCCESS);
        Animated.spring(successScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
      } catch {
        Alert.alert('Error', 'Failed to fetch Aadhaar from DigiLocker.');
      } finally {
        setLoading(false);
      }
    }
  }

  // ── Progress ─────────────────────────────────────────────────────────────────
  function renderProgress() {
    const steps   = [
      { key: STEPS.ENTER_AADHAAR, label: 'Aadhaar' },
      { key: STEPS.VERIFY_OTP,    label: 'OTP' },
      { key: STEPS.SUCCESS,       label: 'Done' },
    ];
    const current = steps.findIndex(s => s.key === step);
    return (
      <View style={styles.progressWrap}>
        {steps.map((s, i) => (
          <React.Fragment key={s.key}>
            <View style={styles.progressItem}>
              <View style={[
                styles.progressCircle,
                i <= current && styles.progressCircleActive,
                i < current  && styles.progressCircleDone,
              ]}>
                {i < current
                  ? <Text style={styles.progressCheck}>✓</Text>
                  : <Text style={[styles.progressNum, i <= current && { color: '#fff' }]}>{i + 1}</Text>
                }
              </View>
              <Text style={[styles.progressLabel, i <= current && styles.progressLabelActive]}>
                {s.label}
              </Text>
            </View>
            {i < steps.length - 1 && (
              <View style={[styles.progressLine, i < current && styles.progressLineDone]} />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  }

  // ── Header ───────────────────────────────────────────────────────────────────
  function renderHeader() {
    const titles = {
      [STEPS.ENTER_AADHAAR]: 'Aadhaar KYC',
      [STEPS.VERIFY_OTP]:    'Verify OTP',
      [STEPS.SUCCESS]:       'KYC Complete',
    };
    return (
      <View style={styles.headerBar}>
        {step !== STEPS.ENTER_AADHAAR ? (
          <TouchableOpacity onPress={() => setStep(STEPS.ENTER_AADHAAR)} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
        <Text style={styles.headerTitle}>{titles[step]}</Text>
        <View style={{ width: 40 }} />
      </View>
    );
  }

  // ── Step 1: Enter Aadhaar ────────────────────────────────────────────────────
  function renderEnterAadhaar() {
    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Text style={{ fontSize: 40 }}>🪪</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>
              <Text style={{ color: C.primary, fontWeight: '800' }}>Aadhaar </Text>
              Verification
            </Text>
            <Text style={styles.bannerSub}>Secure · UIDAI Certified · Govt. of India</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {[
            { key: 'otp',        label: ' OTP Verification' },
            { key: 'digilocker', label: ' DigiLocker' },
          ].map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, method === t.key && styles.tabActive]}
              onPress={() => setMethod(t.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, method === t.key && styles.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Aadhaar Number</Text>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="XXXX  XXXX  XXXX"
              placeholderTextColor="#B0BAD0"
              keyboardType="numeric"
              maxLength={14}
              value={aadhaarNumber}
              onChangeText={handleAadhaarChange}
            />
          </View>

          {method === 'otp' ? (
            <>
              <Text style={styles.infoText}>
                An OTP will be sent to your Aadhaar-linked mobile number.
              </Text>
              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.btnDisabled]}
                onPress={handleSendOtp}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Send OTP</Text>}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.infoText}>
                You'll be redirected to DigiLocker to securely share your Aadhaar. No OTP required.
              </Text>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: '#0D47A1' }, loading && styles.btnDisabled]}
                onPress={handleDigilockerRedirect}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>Open DigiLocker  →</Text>
              </TouchableOpacity>
              <View style={styles.chipRow}>
                {['✅ No OTP', '🔒 Encrypted', '🇮🇳 Govt. Verified'].map(c => (
                  <View key={c} style={styles.chip}><Text style={styles.chipText}>{c}</Text></View>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Security badges */}
        <View style={styles.secRow}>
          {['🔒 256-bit SSL', '🇮🇳 UIDAI Certified', '✅ DPDP Act'].map(b => (
            <View key={b} style={styles.secBadge}><Text style={styles.secBadgeText}>{b}</Text></View>
          ))}
        </View>
      </Animated.View>
    );
  }

  // ── Step 2: Verify OTP ───────────────────────────────────────────────────────
  function renderVerifyOtp() {
    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Text style={{ fontSize: 40 }}>📱</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>
              <Text style={{ color: C.primary, fontWeight: '800' }}>OTP </Text>Verification
            </Text>
            <Text style={styles.bannerSub}>
              Sent to mobile linked with {maskAadhaar(aadhaarNumber)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.otpCardTitle}>Enter Email OTP</Text>
          <Text style={styles.timerText}>
            {timer > 0 ? `Resend OTP in: ${formatTime(timer)}` : ''}
          </Text>

          {/* OTP boxes */}
          <View style={styles.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={r => otpRefs.current[i] = r}
                style={[styles.otpBox, digit && styles.otpBoxFilled]}
                value={digit}
                onChangeText={t => handleOtpChange(t, i)}
                onKeyPress={e => handleOtpKeyPress(e, i)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
                textContentType="oneTimeCode"
              />
            ))}
          </View>

          {timer === 0 && (
            <TouchableOpacity style={styles.resendBtn} onPress={() => { startTimer(60); handleSendOtp(); }}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleVerifyOtp}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Verify OTP</Text>}
          </TouchableOpacity>

          {/* Valid OTP note */}
          <Text style={styles.validMsg}>
            You already have a valid OTP to login for next 180 secs.{'\n'}Please use the same OTP.
          </Text>

          <View style={styles.hintBox}>
            <Text style={styles.hintText}>
              *Keep the photocopies of the following documents handy to complete account opening process seamlessly.
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  // ── Step 3: Success ──────────────────────────────────────────────────────────
  function renderSuccess() {
    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: successScale }] }}>
        <View style={styles.successCard}>
          <View style={styles.successBanner}>
            <Text style={{ fontSize: 52 }}>✅</Text>
            <Text style={styles.successTitle}>KYC Verified!</Text>
            <Text style={styles.successSub}>Your identity has been verified successfully</Text>
            {kycData?.source === 'DigiLocker' && (
              <View style={styles.digiBadge}>
                <Text style={styles.digiBadgeText}> Verified via DigiLocker</Text>
              </View>
            )}
          </View>
          <View style={styles.kycTable}>
            {[
              ['Full Name',     kycData?.name],
              ['Date of Birth', kycData?.dob],
              ['Gender',        kycData?.gender],
              ['Aadhaar No.',   maskAadhaar(kycData?.aadhaar)],
              ['Address',       kycData?.address],
            ].map(([label, value]) => (
              <View key={label} style={styles.kycRow}>
                <Text style={styles.kycLabel}>{label}</Text>
                <Text style={styles.kycValue}>{value}</Text>
              </View>
            ))}
          </View>
          <View style={{ padding: 20, paddingTop: 4 }}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('ConfirmDetails')}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Continue  →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.secondary} />
      {renderHeader()}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderProgress()}
        {step === STEPS.ENTER_AADHAAR && renderEnterAadhaar()}
        {step === STEPS.VERIFY_OTP    && renderVerifyOtp()}
        {step === STEPS.SUCCESS       && renderSuccess()}
        <Text style={styles.footer}>
          By proceeding, you consent to Aadhaar-based eKYC as per UIDAI guidelines & DPDP Act 2023.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── STYLES ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: C.secondary },
  scroll:    { flex: 1, backgroundColor: C.bg },
  container: { padding: 16, paddingBottom: 40 },

  // Header
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: C.secondary,
    borderBottomWidth: 1, borderBottomColor: '#E5E9F5',
    elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  backBtn:     { width: 40, height: 40, justifyContent: 'center' },
  backArrow:   { fontSize: 22, color: C.primary, fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: C.text, letterSpacing: 0.2 },

  // Progress
  progressWrap: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 20, paddingHorizontal: 8, marginBottom: 4,
    backgroundColor: C.secondary, borderRadius: 14, marginBottom: 16,
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  progressItem:        { alignItems: 'center', gap: 4 },
  progressCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#E8F0FC', borderWidth: 2, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  progressCircleActive: { backgroundColor: C.primary, borderColor: C.primary },
  progressCircleDone:   { backgroundColor: C.success,  borderColor: C.success },
  progressNum:          { fontSize: 13, fontWeight: '700', color: C.sub },
  progressCheck:        { fontSize: 13, fontWeight: '700', color: '#fff' },
  progressLabel:        { fontSize: 11, fontWeight: '600', color: C.sub },
  progressLabelActive:  { color: C.primary },
  progressLine:         { flex: 1, height: 2, backgroundColor: C.border, marginBottom: 14 },
  progressLineDone:     { backgroundColor: C.success },

  // Banner
  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.primaryLight, borderRadius: 14, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: '#C5D5F5',
  },
  bannerIcon: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 3,
  },
  bannerTitle: { fontSize: 18, fontWeight: '700', color: C.text, marginBottom: 4 },
  bannerSub:   { fontSize: 12, color: C.sub, lineHeight: 17 },

  // Tabs
  tabRow:        { flexDirection: 'row', gap: 10, marginBottom: 14 },
  tab:           { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: C.border },
  tabActive:     { backgroundColor: C.primary, borderColor: C.primary },
  tabText:       { fontSize: 13, fontWeight: '600', color: C.sub },
  tabTextActive: { color: '#fff' },

  // Card
  card: {
    backgroundColor: C.card, borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: C.border, marginBottom: 16,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  fieldLabel: {
    fontSize: 12, fontWeight: '700', color: C.primary,
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10,
  },
  inputWrap: {
    backgroundColor: C.bg, borderRadius: 10, paddingHorizontal: 16,
    borderWidth: 1.5, borderColor: C.border, marginBottom: 14,
  },
  input: { color: C.text, fontSize: 20, letterSpacing: 4, paddingVertical: 13, fontWeight: '700' },
  infoText: { color: C.sub, fontSize: 13, lineHeight: 19, marginBottom: 16 },

  // Button
  primaryBtn: {
    backgroundColor: C.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 5,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.4 },
  btnDisabled:    { opacity: 0.65 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 12 },
  chip:    { backgroundColor: C.primaryLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#C5D5F5' },
  chipText:{ color: C.primary, fontSize: 11, fontWeight: '600' },

  // Security badges
  secRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  secBadge:     { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: C.border },
  secBadgeText: { color: C.sub, fontSize: 11, fontWeight: '500' },

  // OTP
  otpCardTitle: { fontSize: 20, fontWeight: '800', color: C.text, textAlign: 'center', marginBottom: 6 },
  timerText:    { fontSize: 13, color: C.sub, textAlign: 'center', marginBottom: 22 },
  otpRow:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  otpBox: {
    width: 48, height: 58, borderRadius: 10,
    borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg,
    fontSize: 24, fontWeight: '800', color: C.text, textAlign: 'center',
  },
  otpBoxFilled: { borderColor: C.primary, borderWidth: 2, backgroundColor: C.primaryLight, color: C.primary },
  resendBtn:  { alignItems: 'center', marginBottom: 14 },
  resendText: { color: C.primary, fontSize: 14, fontWeight: '700' },
  validMsg:   { color: C.sub, fontSize: 12, textAlign: 'center', lineHeight: 18, marginTop: 14, marginBottom: 14 },
  hintBox:    { backgroundColor: '#F5F7FF', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: C.border },
  hintText:   { fontSize: 12, color: C.sub, lineHeight: 18, textAlign: 'center' },

  // Success
  successCard:   { backgroundColor: C.card, borderRadius: 20, borderWidth: 1, borderColor: '#C5D5F5', overflow: 'hidden', marginBottom: 16, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  successBanner: { backgroundColor: C.primaryLight, alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#C5D5F5', gap: 6 },
  successTitle:  { fontSize: 24, fontWeight: '800', color: C.text },
  successSub:    { fontSize: 13, color: C.sub, textAlign: 'center' },
  digiBadge:     { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: '#C5D5F5', marginTop: 4 },
  digiBadgeText: { color: C.primary, fontSize: 12, fontWeight: '700' },
  kycTable:      { padding: 20, gap: 14 },
  kycRow:        { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  kycLabel:      { color: C.sub, fontSize: 12, fontWeight: '600', flex: 1.1, marginTop: 1 },
  kycValue:      { color: C.text, fontSize: 13, fontWeight: '700', flex: 2, textAlign: 'right' },

  footer: { color: '#9BA8C0', fontSize: 11, textAlign: 'center', lineHeight: 17, marginTop: 8, paddingHorizontal: 16 },
});
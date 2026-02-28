import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControl
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { 
  Home, 
  User, 
  Settings, 
  Plus, 
  Users, 
  History, 
  QrCode, 
  ArrowLeft,
  LogOut,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight,
  Share2
} from 'lucide-react-native';
import * as Sharing from 'expo-sharing';
import QRCode from 'react-native-qrcode-svg';
import { 
  useFonts, 
  Cairo_400Regular, 
  Cairo_600SemiBold, 
  Cairo_700Bold 
} from '@expo-google-fonts/cairo';
import { nativeTokens } from '@gate-access/ui/src/tokens';
import { login, logout, getValidAccessToken } from './src/lib/auth-client';
import { apiRequest } from './src/lib/api-client';
import { format } from 'date-fns';

// ─── Authentication Hook ──────────────────────────────────────────────────────

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const token = await getValidAccessToken();
    setIsAuthenticated(!!token);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
  };

  const handleLogin = async (email: string, pass: string) => {
    const result = await login(email, pass);
    if (result.success) {
      setIsAuthenticated(true);
    }
    return result;
  };

  return { isAuthenticated, isLoading, handleLogin, handleLogout, checkAuth };
}

// ─── Components ───────────────────────────────────────────────────────────────

const Header = ({ title, showBack = false, onBack, rightAction }: any) => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      {showBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={nativeTokens.colors.foreground} />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
    {rightAction && <TouchableOpacity onPress={rightAction.onPress}>{rightAction.icon}</TouchableOpacity>}
  </View>
);

// ─── Main Screens ─────────────────────────────────────────────────────────────

export default function App() {
  const { isAuthenticated, isLoading: authLoading, handleLogin, handleLogout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedVisitor, setSelectedVisitor] = useState<any>(null);
  
  // Data State
  const [unit, setUnit] = useState<any>(null);
  const [quota, setQuota] = useState<any>(null);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [fontsLoaded] = useFonts({ Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold });

  const fetchData = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    
    try {
      // Parallel fetch for speed
      const [unitRes, quotaRes, visitorsRes] = await Promise.all([
        apiRequest('/resident/units'),
        apiRequest('/resident/quota'),
        apiRequest('/resident/visitors')
      ]);

      if (unitRes.data?.[0]) setUnit(unitRes.data[0]);
      if (quotaRes.data) setQuota(quotaRes.data);
      if (visitorsRes.data) setVisitors(visitorsRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (!fontsLoaded || authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // ─── Auth Guard (Login Screen) ─────────────────────────────────────────────

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // ─── Screen Router ──────────────────────────────────────────────────────────

  const navigateTo = (screen: string, params?: any) => {
    if (params?.visitor) setSelectedVisitor(params.visitor);
    setCurrentScreen(screen);
  };

  const renderContent = () => {
    if (currentScreen === 'home') {
      return <HomeScreen 
        unit={unit} 
        quota={quota} 
        visitors={visitors} 
        onRefresh={() => { setIsRefreshing(true); fetchData(); }}
        isRefreshing={isRefreshing}
        onAddVisitor={() => navigateTo('add_visitor')}
        onOpenQR={() => navigateTo('add_open_qr')}
        onVisitorPress={(v: any) => navigateTo('visitor_detail', { visitor: v })}
      />;
    }
    if (currentScreen === 'add_visitor') {
      return <AddVisitorScreen onBack={() => setCurrentScreen('home')} unitId={unit?.id} onSuccess={fetchData} />;
    }
    if (currentScreen === 'add_open_qr') {
      return <AddOpenQRScreen onBack={() => setCurrentScreen('home')} unitId={unit?.id} onSuccess={fetchData} />;
    }
    if (currentScreen === 'visitor_detail') {
      return <VisitorDetailScreen 
        visitor={selectedVisitor} 
        onBack={() => { setCurrentScreen('home'); setSelectedVisitor(null); }} 
      />;
    }
    return null;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        {renderContent()}
        
        {/* Simple Tab Bar */}
        {currentScreen === 'home' && (
          <View style={styles.tabBar}>
            <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('home')}>
              <Home size={24} color={activeTab === 'home' ? '#2563eb' : '#94a3b8'} />
              <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('visitors')}>
              <Users size={24} color={activeTab === 'visitors' ? '#2563eb' : '#94a3b8'} />
              <Text style={[styles.tabText, activeTab === 'visitors' && styles.activeTabText]}>Visitors</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab} onPress={() => { handleLogout(); }}>
              <LogOut size={24} color="#94a3b8" />
              <Text style={styles.tabText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ─── Sub-Screens ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginPress = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill all fields');
    setLoading(true);
    const result = await onLogin(email, password);
    setLoading(false);
    if (!result.success) Alert.alert('Login Failed', result.error);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authContainer}>
      <View style={styles.authHeader}>
        <Text style={styles.authTitle}>GateFlow</Text>
        <Text style={styles.authSubtitle}>Resident Portal</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            style={styles.input} 
            placeholder="resident@example.com" 
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="••••••••" 
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Login</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function HomeScreen({ unit, quota, visitors, onRefresh, isRefreshing, onAddVisitor, onOpenQR, onVisitorPress }: any) {
  return (
    <View style={styles.flex1}>
      <Header title="GateFlow" rightAction={{ icon: <Settings size={22} color="#475569" />, onPress: () => {} }} />
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {/* Unit Card */}
        <View style={styles.card}>
          <View style={styles.unitHeader}>
            <View style={styles.unitIcon}><Home size={28} color="#2563eb" /></View>
            <View>
              <Text style={styles.unitNumber}>{unit?.name || 'Loading...'}</Text>
              <Text style={styles.unitType}>
                {unit?.type?.replace('_', ' ') || 'Resident'} • {unit?.building || 'Building'}
              </Text>
            </View>
          </View>
          <View style={styles.unitStatus}>
            <Text style={styles.statusLabel}>Status</Text>
            <Text style={styles.statusValue}>{unit?.isActive ? 'Active' : 'Inactive'}</Text>
          </View>
        </View>

        {/* Quota */}
        {quota && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Monthly Quota</Text>
            <View style={styles.quotaCircle}>
              <Text style={styles.quotaText}>{quota.used}/{quota.quota}</Text>
            </View>
            <Text style={styles.quotaSubtext}>{quota.remaining} visitors remaining</Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={onAddVisitor}>
            <Plus size={24} color="#fff" />
            <Text style={styles.actionText}>Add Visitor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.darkButton]} onPress={onOpenQR}>
            <Users size={24} color="#fff" />
            <Text style={styles.actionText}>Open QR</Text>
          </TouchableOpacity>
        </View>

        {/* Active Visitors */}
        <View style={styles.listCard}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Active Visitors</Text>
            <TouchableOpacity><Text style={styles.viewAll}>View all</Text></TouchableOpacity>
          </View>
          {visitors.slice(0, 5).map((v: any) => (
            <TouchableOpacity key={v.id} style={styles.visitorItem} onPress={() => onVisitorPress(v)}>
              <View style={styles.visitorAvatar}>
                {v.isOpenQR ? <QrCode size={20} color="#7c3aed" /> : <User size={20} color="#2563eb" />}
              </View>
              <View style={styles.visitorInfo}>
                <Text style={styles.visitorName}>{v.visitorName || 'Open Access QR'}</Text>
                <Text style={styles.visitorTime}>
                  {v.accessRule?.type === 'ONETIME' ? 'One-time' : 'Recurring'}
                </Text>
              </View>
              <View style={[styles.statusBadge, v.isOpenQR && styles.purpleBadge]}>
                <Text style={[styles.statusBadgeText, v.isOpenQR && styles.purpleText]}>
                  {v.isOpenQR ? 'Open' : 'Active'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {visitors.length === 0 && (
            <Text style={styles.emptyText}>No active visitors found</Text>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function AddVisitorScreen({ onBack, unitId, onSuccess }: any) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name) return Alert.alert('Error', 'Visitor name is required');
    setLoading(true);
    const { error } = await apiRequest('/resident/visitors', {
      method: 'POST',
      body: JSON.stringify({
        unitId,
        visitorName: name,
        accessType: 'ONETIME',
        startDate: new Date().toISOString().split('T')[0],
      })
    });
    setLoading(false);
    if (error) return Alert.alert('Error', error);
    onSuccess();
    onBack();
  };

  return (
    <View style={styles.flex1}>
      <Header title="Add Visitor" showBack onBack={onBack} />
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Visitor Name</Text>
          <TextInput style={styles.input} placeholder="John Doe" value={name} onChangeText={setName} />
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Generate Pass</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AddOpenQRScreen({ onBack, unitId, onSuccess }: any) {
  const [maxUses, setMaxUses] = useState('10');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await apiRequest('/resident/visitors', {
      method: 'POST',
      body: JSON.stringify({
        unitId,
        isOpenQR: true,
        visitorName: 'Open Access Pass',
        accessType: 'DATERANGE',
        maxUses: parseInt(maxUses),
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
      })
    });
    setLoading(false);
    if (error) return Alert.alert('Error', error);
    onSuccess();
    onBack();
  };

  return (
    <View style={styles.flex1}>
      <Header title="Open Access QR" showBack onBack={onBack} />
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Max Visitors</Text>
          <TextInput style={styles.input} value={maxUses} onChangeText={setMaxUses} keyboardType="numeric" />
        </View>
        <TouchableOpacity style={styles.darkSubmitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Generate Open QR</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function VisitorDetailScreen({ visitor, onBack }: any) {
  const handleShare = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      return Alert.alert('Error', 'Sharing is not available on this device');
    }
    await Sharing.shareAsync(`Pass for ${visitor.visitorName || 'Visitor'}: ${visitor.qrCode.code}`);
  };

  return (
    <View style={styles.flex1}>
      <Header title="Pass Details" showBack onBack={onBack} />
      <ScrollView style={styles.content}>
        <View style={styles.qrCard}>
          <Text style={styles.qrVisitorName}>{visitor.visitorName || 'Open Access Pass'}</Text>
          <Text style={styles.qrVisitorSub}>One-time visitor pass</Text>
          
          <View style={styles.qrWrapper}>
            <QRCode value={visitor.qrCode.code} size={200} />
          </View>

          <View style={styles.qrInfoGrid}>
            <View style={styles.qrInfoItem}>
              <Calendar size={16} color="#64748b" />
              <Text style={styles.qrInfoText}>{format(new Date(), 'MMM dd, yyyy')}</Text>
            </View>
            <View style={styles.qrInfoItem}>
              <Clock size={16} color="#64748b" />
              <Text style={styles.qrInfoText}>24/7 Access</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.sharePassButton} onPress={handleShare}>
            <Share2 size={20} color="#fff" />
            <Text style={styles.sharePassText}>Share Pass</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Uses Used</Text>
            <Text style={styles.detailValue}>{visitor.qrCode.currentUses} / {visitor.qrCode.maxUses || '∞'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{visitor.accessRule?.type || 'ONETIME'}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  flex1: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 12, padding: 4 },
  headerTitle: { fontSize: 20, fontFamily: 'Cairo_700Bold', color: '#0f172a' },
  content: { flex: 1, padding: 16 },
  
  // Cards
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  unitHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  unitIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' },
  unitNumber: { fontSize: 18, fontFamily: 'Cairo_600SemiBold', color: '#1e293b' },
  unitType: { fontSize: 14, color: '#64748b' },
  unitStatus: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  statusLabel: { fontSize: 14, color: '#64748b' },
  statusValue: { fontSize: 14, fontFamily: 'Cairo_600SemiBold', color: '#16a34a' },
  
  sectionTitle: { fontSize: 16, fontFamily: 'Cairo_600SemiBold', color: '#1e293b', marginBottom: 12 },
  quotaCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 8, borderColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 8 },
  quotaText: { fontSize: 24, fontFamily: 'Cairo_700Bold', color: '#1e293b' },
  quotaSubtext: { fontSize: 13, color: '#64748b', textAlign: 'center' },
  
  actions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 12 },
  primaryButton: { backgroundColor: '#2563eb' },
  darkButton: { backgroundColor: '#1e293b' },
  actionText: { fontSize: 15, fontFamily: 'Cairo_600SemiBold', color: '#fff' },
  
  listCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  listHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { fontSize: 14, color: '#2563eb', fontWeight: '500' },
  visitorItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  visitorAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  visitorInfo: { flex: 1, marginLeft: 12 },
  visitorName: { fontSize: 15, fontFamily: 'Cairo_600SemiBold', color: '#1e293b' },
  visitorTime: { fontSize: 12, color: '#64748b' },
  statusBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusBadgeText: { fontSize: 11, fontWeight: '700', color: '#166534', textTransform: 'uppercase' },
  purpleBadge: { backgroundColor: '#f3e8ff' },
  purpleText: { color: '#6b21a8' },
  emptyText: { padding: 32, textAlign: 'center', color: '#94a3b8' },

  // Auth
  authContainer: { flex: 1, backgroundColor: '#fff', padding: 32, justifyContent: 'center' },
  authHeader: { marginBottom: 40 },
  authTitle: { fontSize: 32, fontFamily: 'Cairo_700Bold', color: '#2563eb' },
  authSubtitle: { fontSize: 18, color: '#64748b' },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontFamily: 'Cairo_600SemiBold', color: '#1e293b' },
  input: { height: 52, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 16, fontSize: 16, backgroundColor: '#f8fafc' },
  loginButton: { height: 52, backgroundColor: '#2563eb', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  loginButtonText: { color: '#fff', fontSize: 16, fontFamily: 'Cairo_600SemiBold' },

  // Forms
  formContainer: { flex: 1, padding: 20, gap: 24 },
  submitButton: { height: 56, backgroundColor: '#2563eb', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 'auto' },
  darkSubmitButton: { height: 56, backgroundColor: '#1e293b', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 'auto' },
  submitButtonText: { color: '#fff', fontSize: 18, fontFamily: 'Cairo_600SemiBold' },

  // Detail
  qrCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  qrVisitorName: { fontSize: 24, fontFamily: 'Cairo_700Bold', color: '#1e293b' },
  qrVisitorSub: { fontSize: 14, color: '#64748b', marginBottom: 24 },
  qrWrapper: { padding: 20, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 24 },
  qrInfoGrid: { flexDirection: 'row', gap: 20, marginBottom: 32 },
  qrInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f8fafc', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  qrInfoText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  sharePassButton: { width: '100%', height: 56, backgroundColor: '#2563eb', borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  sharePassText: { color: '#fff', fontSize: 17, fontFamily: 'Cairo_600SemiBold' },
  detailsCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginTop: 16, gap: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: 14, color: '#64748b' },
  detailValue: { fontSize: 14, fontFamily: 'Cairo_600SemiBold', color: '#1e293b' },

  // Tab Bar
  tabBar: { height: 72, flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingBottom: Platform.OS === 'ios' ? 20 : 0 },
  tab: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  tabText: { fontSize: 11, color: '#94a3b8', fontWeight: '500' },
  activeTabText: { color: '#2563eb' }
});

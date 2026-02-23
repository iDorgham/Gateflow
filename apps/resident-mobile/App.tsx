import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { nativeTokens } from '@gate-access/ui/src/tokens';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import {
  Home,
  User,
  Settings,
  Plus,
  Users,
  History,
  QrCode,
} from 'lucide-react-native';

// Placeholder component for icons
const Icon = ({
  name,
  size = 24,
  color = '#000',
}: {
  name: string;
  size?: number;
  color?: string;
}) => {
  const icons: Record<string, string> = {
    home: '🏠',
    user: '👤',
    settings: '⚙️',
    plus: '+',
    users: '👥',
    history: '📋',
    qrcode: '📱',
  };
  return <Text style={{ fontSize: size }}>{icons[name] || '•'}</Text>;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderHome = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Unit Card */}
      <View style={styles.card}>
        <View style={styles.unitHeader}>
          <View style={styles.unitIcon}>
            <Icon name="home" size={28} color="#2563eb" />
          </View>
          <View>
            <Text style={styles.unitNumber}>Unit A-101</Text>
            <Text style={styles.unitType}>3 Bedroom • Building A</Text>
          </View>
        </View>
        <View style={styles.unitStatus}>
          <Text style={styles.statusLabel}>Status</Text>
          <Text style={styles.statusValue}>Active</Text>
        </View>
      </View>

      {/* Quota */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Monthly Quota</Text>
        <View style={styles.quotaCircle}>
          <Text style={styles.quotaText}>8/15</Text>
        </View>
        <Text style={styles.quotaSubtext}>7 visitors remaining</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
          <Icon name="plus" size={24} color="#fff" />
          <Text style={styles.actionText}>Add Visitor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.greenButton]}>
          <Icon name="users" size={24} color="#fff" />
          <Text style={styles.actionText}>Open QR</Text>
        </TouchableOpacity>
      </View>

      {/* Active Visitors */}
      <View style={styles.listCard}>
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Active Visitors</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>
        <View style={styles.visitorItem}>
          <View style={styles.visitorAvatar}>
            <Icon name="user" size={20} color="#64748b" />
          </View>
          <View style={styles.visitorInfo}>
            <Text style={styles.visitorName}>John Doe</Text>
            <Text style={styles.visitorTime}>Today until 6 PM</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>Active</Text>
          </View>
        </View>
        <View style={styles.visitorItem}>
          <View style={styles.visitorAvatar}>
            <Icon name="user" size={20} color="#64748b" />
          </View>
          <View style={styles.visitorInfo}>
            <Text style={styles.visitorName}>Jane Smith</Text>
            <Text style={styles.visitorTime}>Sat-Sun</Text>
          </View>
          <View style={[styles.statusBadge, styles.recurringBadge]}>
            <Text style={[styles.statusBadgeText, styles.recurringText]}>
              Recurring
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.historyButton}>
        <Icon name="history" size={20} color="#475569" />
        <Text style={styles.historyText}>View Visitor History</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GateFlow</Text>
        <TouchableOpacity>
          <Icon name="settings" size={24} color="#475569" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderHome()}

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'home' && styles.activeTab]}
          onPress={() => setActiveTab('home')}
        >
          <Icon
            name="home"
            size={24}
            color={activeTab === 'home' ? '#2563eb' : '#94a3b8'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'home' && styles.activeTabText,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'visitors' && styles.activeTab]}
          onPress={() => setActiveTab('visitors')}
        >
          <Icon
            name="users"
            size={24}
            color={activeTab === 'visitors' ? '#2563eb' : '#94a3b8'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'visitors' && styles.activeTabText,
            ]}
          >
            Visitors
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Icon
            name="history"
            size={24}
            color={activeTab === 'history' ? '#2563eb' : '#94a3b8'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'history' && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Icon
            name="user"
            size={24}
            color={activeTab === 'profile' ? '#2563eb' : '#94a3b8'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'profile' && styles.activeTabText,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: nativeTokens.borderRadius.md,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  unitIcon: {
    width: 48,
    height: 48,
    borderRadius: nativeTokens.borderRadius.xl,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  unitType: {
    fontSize: 14,
    color: '#64748b',
  },
  unitStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statusLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#16a34a',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  quotaCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  quotaText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  quotaSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: nativeTokens.borderRadius.md,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  greenButton: {
    backgroundColor: '#16a34a',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  listCard: {
    backgroundColor: '#fff',
    borderRadius: nativeTokens.borderRadius.md,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 14,
    color: '#2563eb',
  },
  visitorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  visitorAvatar: {
    width: 40,
    height: 40,
    borderRadius: nativeTokens.borderRadius.lg,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
  visitorTime: {
    fontSize: 12,
    color: '#64748b',
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: nativeTokens.borderRadius.md,
  },
  statusBadgeText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '500',
  },
  recurringBadge: {
    backgroundColor: '#dbeafe',
  },
  recurringText: {
    color: '#2563eb',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: nativeTokens.borderRadius.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 80,
  },
  historyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#475569',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingBottom: 20,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    // styles for active tab
  },
  tabText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  activeTabText: {
    color: '#2563eb',
  },
});

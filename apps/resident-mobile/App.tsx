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
    backgroundColor: nativeTokens.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: nativeTokens.spacing.lg,
    paddingVertical: nativeTokens.spacing.md,
    backgroundColor: nativeTokens.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: nativeTokens.colors.border,
  },
  headerTitle: {
    fontSize: nativeTokens.typography.xl.fontSize,
    fontWeight: '700',
    color: nativeTokens.colors.foreground,
  },
  content: {
    flex: 1,
    padding: nativeTokens.spacing.lg,
  },
  card: {
    backgroundColor: nativeTokens.colors.card,
    borderRadius: nativeTokens.borderRadius.md,
    padding: nativeTokens.spacing.lg,
    marginBottom: nativeTokens.spacing.md,
    ...nativeTokens.shadows.sm,
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: nativeTokens.spacing.md,
    marginBottom: nativeTokens.spacing.md,
  },
  unitIcon: {
    width: 48,
    height: 48,
    borderRadius: nativeTokens.borderRadius.xl,
    backgroundColor: nativeTokens.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitNumber: {
    fontSize: nativeTokens.typography.base.fontSize,
    fontWeight: '600',
    color: nativeTokens.colors.foreground,
  },
  unitType: {
    fontSize: nativeTokens.typography.sm.fontSize,
    color: nativeTokens.colors.mutedForeground,
  },
  unitStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: nativeTokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: nativeTokens.colors.border,
  },
  statusLabel: {
    fontSize: nativeTokens.typography.sm.fontSize,
    color: nativeTokens.colors.mutedForeground,
  },
  statusValue: {
    fontSize: nativeTokens.typography.sm.fontSize,
    fontWeight: '500',
    color: nativeTokens.colors.success,
  },
  sectionTitle: {
    fontSize: nativeTokens.typography.base.fontSize,
    fontWeight: '600',
    color: nativeTokens.colors.foreground,
    marginBottom: nativeTokens.spacing.md,
  },
  quotaCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: nativeTokens.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: nativeTokens.spacing.sm,
  },
  quotaText: {
    fontSize: nativeTokens.typography['2xl'].fontSize,
    fontWeight: '700',
    color: nativeTokens.colors.foreground,
  },
  quotaSubtext: {
    fontSize: nativeTokens.typography.sm.fontSize,
    color: nativeTokens.colors.mutedForeground,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: nativeTokens.spacing.md,
    marginBottom: nativeTokens.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: nativeTokens.spacing.sm,
    paddingVertical: nativeTokens.spacing.lg,
    borderRadius: nativeTokens.borderRadius.md,
  },
  primaryButton: {
    backgroundColor: nativeTokens.colors.foreground,
  },
  greenButton: {
    backgroundColor: nativeTokens.colors.success,
  },
  actionText: {
    fontSize: nativeTokens.typography.base.fontSize,
    fontWeight: '600',
    color: nativeTokens.colors.primaryForeground,
  },
  listCard: {
    backgroundColor: nativeTokens.colors.card,
    borderRadius: nativeTokens.borderRadius.md,
    padding: nativeTokens.spacing.lg,
    marginBottom: nativeTokens.spacing.md,
    ...nativeTokens.shadows.sm,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: nativeTokens.spacing.md,
  },
  viewAll: {
    fontSize: nativeTokens.typography.sm.fontSize,
    color: nativeTokens.colors.info,
  },
  visitorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: nativeTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: nativeTokens.colors.border,
  },
  visitorAvatar: {
    width: 40,
    height: 40,
    borderRadius: nativeTokens.borderRadius.lg,
    backgroundColor: nativeTokens.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitorInfo: {
    flex: 1,
    marginLeft: nativeTokens.spacing.md,
  },
  visitorName: {
    fontSize: nativeTokens.typography.base.fontSize,
    fontWeight: '500',
    color: nativeTokens.colors.foreground,
  },
  visitorTime: {
    fontSize: nativeTokens.typography.xs.fontSize,
    color: nativeTokens.colors.mutedForeground,
  },
  statusBadge: {
    backgroundColor: nativeTokens.colors.secondary,
    paddingHorizontal: nativeTokens.spacing.sm,
    paddingVertical: nativeTokens.spacing.xs,
    borderRadius: nativeTokens.borderRadius.md,
  },
  statusBadgeText: {
    fontSize: nativeTokens.typography.xs.fontSize,
    color: nativeTokens.colors.success,
    fontWeight: '500',
  },
  recurringBadge: {
    backgroundColor: nativeTokens.colors.secondary,
  },
  recurringText: {
    color: nativeTokens.colors.info,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: nativeTokens.spacing.sm,
    paddingVertical: nativeTokens.spacing.lg,
    backgroundColor: nativeTokens.colors.card,
    borderRadius: nativeTokens.borderRadius.md,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
    marginBottom: 80,
  },
  historyText: {
    fontSize: nativeTokens.typography.base.fontSize,
    fontWeight: '500',
    color: nativeTokens.colors.mutedForeground,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: nativeTokens.colors.card,
    borderTopWidth: 1,
    borderTopColor: nativeTokens.colors.border,
    paddingBottom: 20,
    paddingTop: nativeTokens.spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: nativeTokens.spacing.sm,
  },
  activeTab: {
    // styles for active tab
  },
  tabText: {
    fontSize: nativeTokens.typography.xs.fontSize,
    color: nativeTokens.colors.zinc400,
    marginTop: nativeTokens.spacing.xs,
  },
  activeTabText: {
    color: nativeTokens.colors.foreground,
  },
});

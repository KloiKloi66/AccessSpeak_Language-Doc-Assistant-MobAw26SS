import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FunctionsCard from '../../components/functions-card.component';
import { COLORS, RADIUS, SPACING } from '../../theme';

import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useDocuments } from '../../utils/DataProvider';

const BADGE_COLORS: Record<string, { text: string; bg: string }> = {
  schwierig: { text: COLORS.badgeRed, bg: COLORS.badgeRedBg },
  mittel: { text: COLORS.badgeAmber, bg: COLORS.badgeAmberBg },
  leicht: { text: COLORS.badgeGreen, bg: COLORS.badgeGreenBg },
};

export default function HomePage() {
  const { entries } = useDocuments();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      {/* Profile row */}
      <View style={styles.profileRow}>
        <View style={styles.profileLeft}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={22} color={COLORS.textMuted} />
          </View>
          <Text style={styles.username}>Oliver</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* App Anleitung */}
      <Link href={{ pathname: '/pages/instructionsPage' }} asChild>
        <TouchableOpacity style={styles.instructionBtn} activeOpacity={0.7}>
          <Text style={styles.instructionText}>App Anleitung</Text>
          <Feather name="arrow-up-right" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </Link>

      {/* Function Cards 2×2 */}
      <View style={styles.cardsGrid}>
        <View style={styles.cardRow}>
          <FunctionsCard
            title="Kamera"
            icon={<Ionicons name="camera-outline" size={52} color={COLORS.text} />}
            onPress={() => router.push('/(tabs)/cameraPage')}
          />
          <Link href={{ pathname: '/(tabs)/chatBotPage' }} asChild>
            <FunctionsCard
              title="Chatbot"
              icon={<MaterialCommunityIcons name="robot-outline" size={52} color={COLORS.text} />}
            />
          </Link>
        </View>
        <View style={styles.cardRow}>
          <Link href={{ pathname: '/pages/translationPage' }} asChild>
            <FunctionsCard
              title="Verstehen"
              icon={
                <View style={styles.comboIcons}>
                  <MaterialCommunityIcons name="translate" size={44} color={COLORS.text} />
                  <Ionicons name="sparkles-outline" size={44} color={COLORS.text} />
                </View>
              }
            />
          </Link>
          <FunctionsCard
            title="Scan"
            icon={<Ionicons name="scan-outline" size={52} color={COLORS.text} />}
          />
        </View>
      </View>

      {/* Recent / Verlauf */}
      <View style={styles.recentCard}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Verlauf</Text>
          <Link href={{ pathname: '/(tabs)/historyPage' }} asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <Feather name="maximize-2" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </Link>
        </View>

        {[...entries]
          .sort((a, b) => b.id - a.id)
          .slice(0, 3)
          .map((item) => {
          const badge = BADGE_COLORS[item.difficulty] ?? BADGE_COLORS.mittel;
          return (
            <View key={item.id} style={styles.recentItem}>
              <Text style={styles.recentName} numberOfLines={1}>
                {item.title}
              </Text>
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeText, { color: badge.text }]}>
                  {item.difficulty}
                </Text>
              </View>
              {item.type === 'document' ? (
                <Ionicons name="document-text-outline" size={20} color={COLORS.textMuted} />
              ) : (
                <Ionicons name="image-outline" size={20} color={COLORS.textMuted} />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },

  // Profile
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Instruction button
  instructionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  instructionText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },

  // Function cards
  cardsGrid: {
    flex: 1,
    gap: 10,
    marginBottom: SPACING.md,
  },
  cardRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },

  // Combined icons (Verstehen card)
  comboIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },

  // Recent
  recentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  recentName: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

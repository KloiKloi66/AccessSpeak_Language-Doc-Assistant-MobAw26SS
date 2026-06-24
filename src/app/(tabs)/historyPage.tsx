import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PageTitle from '../../components/page-title.component';
import { COLORS, RADIUS, SPACING } from '../../theme';

import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

type Difficulty = 'schwierig' | 'mittel' | 'leicht';
type DocType = 'document' | 'image';

const ITEMS: { id: string; name: string; difficulty: Difficulty; date: string; type: DocType }[] = [
  { id: '1', name: 'Finanzamt', difficulty: 'schwierig', date: '12.2.2026', type: 'document' },
  { id: '2', name: 'Whatsapp', difficulty: 'leicht', date: '12.2.2026', type: 'document' },
  { id: '3', name: 'Sportkurs', difficulty: 'leicht', date: '12.2.2026', type: 'document' },
  { id: '4', name: 'Urlaub', difficulty: 'mittel', date: '12.2.2026', type: 'image' },
  { id: '5', name: 'Vertrag', difficulty: 'schwierig', date: '12.2.2026', type: 'document' },
  { id: '6', name: 'Hausordnung', difficulty: 'mittel', date: '12.2.2026', type: 'document' },
];

const BADGE: Record<Difficulty, { text: string; bg: string }> = {
  schwierig: { text: COLORS.badgeRed, bg: COLORS.badgeRedBg },
  mittel: { text: COLORS.badgeAmber, bg: COLORS.badgeAmberBg },
  leicht: { text: COLORS.badgeGreen, bg: COLORS.badgeGreenBg },
};

function HistoryCard({ item }: { item: typeof ITEMS[0] }) {
  const badge = BADGE[item.difficulty];
  return (
    <View style={styles.card}>
      <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>

      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
        <Text style={[styles.badgeText, { color: badge.text }]}>{item.difficulty}</Text>
      </View>

      <View style={styles.cardFooter}>
        {item.type === 'document' ? (
          <Ionicons name="document-text-outline" size={20} color={COLORS.textMuted} />
        ) : (
          <Ionicons name="image-outline" size={20} color={COLORS.textMuted} />
        )}
        <Text style={styles.cardDate}>{item.date}</Text>
      </View>
    </View>
  );
}

export default function HistoryPage() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      {/* Header */}
      <View style={styles.header}>
        <PageTitle>Verlauf</PageTitle>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
            <Text style={styles.editText}>Bearbeiten</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Feather name="list" size={22} color={COLORS.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="grid-outline" size={22} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {/* Render in pairs for 2-col grid */}
        {ITEMS.reduce<(typeof ITEMS[0])[][]>((rows, item, i) => {
          if (i % 2 === 0) rows.push([item]);
          else rows[rows.length - 1].push(item);
          return rows;
        }, []).map((row, i) => (
          <View key={i} style={styles.gridRow}>
            {row.map(item => <HistoryCard key={item.id} item={item} />)}
            {row.length === 1 && <View style={{ flex: 1 }} />}
          </View>
        ))}
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  editBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  editText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },

  // Grid
  grid: {
    gap: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  gridRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },

  // Card
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
    minHeight: 130,
    justifyContent: 'space-between',
  },
  cardName: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardDate: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});

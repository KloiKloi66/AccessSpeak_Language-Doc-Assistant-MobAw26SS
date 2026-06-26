import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';

import PageHeader from '../../components/page-header.component';
import HistoryEntryList from '../../components/history-entry-list.component';
import HistoryEntryGrid from '../../components/history-entry-grid.component';
import Button from '../../components/button.component';
import { COLORS, RADIUS, SPACING } from '../../theme';

import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';

const testData = [
  { title: 'Finanzamt', difficulty: 'mittel', type: 'document', date: '12.02.2026', id: 0 },
  { title: 'Whatsapp', difficulty: 'leicht', type: 'image', date: '22.11.2024', id: 1 },
  { title: 'Steuererklärung', difficulty: 'schwierig', type: 'document', date: '02.12.2025', id: 2 },
  { title: 'Personalausweis', difficulty: 'mittel', type: 'image', date: '19.04.2026', id: 3 },
  { title: 'Versicherungsvertrag', difficulty: 'schwierig', type: 'document', date: '11.07.2025', id: 4 },
  { title: 'Amazon', difficulty: 'leicht', type: 'image', date: '23.12.2024', id: 5 },
  { title: 'Gehaltsabrechnung', difficulty: 'mittel', type: 'document', date: '05.02.2026', id: 6 },
  { title: 'Führerschein', difficulty: 'mittel', type: 'image', date: '14.08.2025', id: 7 },
  { title: 'Kreditvertrag', difficulty: 'schwierig', type: 'document', date: '29.11.2025', id: 8 },
  { title: 'Facebook', difficulty: 'leicht', type: 'image', date: '17.06.2024', id: 9 },
  { title: 'Arbeitsvertrag', difficulty: 'mittel', type: 'document', date: '03.10.2025', id: 10 },
  { title: 'Reisepass', difficulty: 'mittel', type: 'image', date: '21.05.2026', id: 11 },
  { title: 'Nebenkostenabrechnung', difficulty: 'schwierig', type: 'document', date: '09.01.2026', id: 12 },
  { title: 'Telegram', difficulty: 'leicht', type: 'image', date: '13.02.2025', id: 13 },
  { title: 'Kontoauszug', difficulty: 'mittel', type: 'document', date: '18.12.2025', id: 14 },
  { title: 'Fahrzeugschein', difficulty: 'mittel', type: 'image', date: '07.04.2026', id: 15 },
  { title: 'Mahnung', difficulty: 'schwierig', type: 'document', date: '25.08.2025', id: 16 },
  { title: 'LinkedIn', difficulty: 'leicht', type: 'image', date: '30.07.2024', id: 17 },
  { title: 'Darlehensvertrag', difficulty: 'schwierig', type: 'document', date: '12.03.2026', id: 18 },
  { title: 'Sparkasse App', difficulty: 'leicht', type: 'image', date: '16.11.2025', id: 19 },
];

export default function HistoryPage() {
  const [isGridLayout, setIsGridLayout] = useState<boolean>(true);

  return (
    <View style={styles.mainView}>
      <PageHeader>Verlauf</PageHeader>

      <View style={styles.historyArea}>
        {/* Toggle buttons */}
        <View style={styles.displayOptions}>
          <Button
            onPress={() => setIsGridLayout(false)}
            style={[styles.toggleBtn, !isGridLayout && styles.toggleBtnActive]}
          >
            <Entypo name="list" size={22} color={COLORS.text} />
          </Button>
          <Button
            onPress={() => setIsGridLayout(true)}
            style={[styles.toggleBtn, isGridLayout && styles.toggleBtnActive]}
          >
            <Ionicons name="grid-outline" size={22} color={COLORS.text} />
          </Button>
        </View>

        <ScrollView
          style={styles.documentsList}
          contentContainerStyle={isGridLayout ? styles.grid : styles.list}
          showsVerticalScrollIndicator={false}
        >
          {isGridLayout
            ? testData.map((entry) => (
                <Link key={entry.id} href={``} asChild>
                  <TouchableOpacity activeOpacity={0.7} style={styles.gridItem}>
                    <HistoryEntryGrid
                      title={entry.title}
                      difficulty={entry.difficulty}
                      type={entry.type}
                      date={entry.date}
                    />
                  </TouchableOpacity>
                </Link>
              ))
            : testData.map((entry) => (
                <Link key={entry.id} href={``} asChild>
                  <TouchableOpacity activeOpacity={0.7} style={styles.listItem}>
                    <HistoryEntryList
                      title={entry.title}
                      difficulty={entry.difficulty}
                      type={entry.type}
                    />
                  </TouchableOpacity>
                </Link>
              ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  historyArea: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  displayOptions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  toggleBtn: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.surfaceLight,
  },
  documentsList: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  gridItem: {
    width: '48%',
  },
  list: {
    gap: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  listItem: {
    width: '100%',
  },
});

import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import PageHeader from '@components/page-header.component';
import HistoryEntryList from '@components/history-entry-list.component';
import HistoryEntryGrid from '@components/history-entry-grid.component';
import Button from '@components/button.component';
import { COLORS, RADIUS, SPACING } from '@theme';
import { useDocuments } from '@utils/DataProvider';

import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HistoryPage() {
  const [isGridLayout, setIsGridLayout] = useState<boolean>(true);

  const { entries } = useDocuments();

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
            ? entries.map((entry) => (
                <Link key={entry.id} href={`/pages/documentPage/${entry.id}`} asChild>
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
            : entries.map((entry) => (
                <Link key={entry.id} href={`/pages/documentPage/${entry.id}`} asChild>
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

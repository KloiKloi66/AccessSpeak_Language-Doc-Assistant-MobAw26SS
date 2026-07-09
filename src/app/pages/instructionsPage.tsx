import { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';

import { COLORS, RADIUS, SPACING } from '../../theme';
import Button from '../../components/button.component';

import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const RETURN_AREA_HEIGHT = 120;
const ICON_SIZE = 72;

type Step = {
  key: string;
  title: string;
  text: string;
  icon: React.ReactNode;
  mockup?: React.ReactNode;
};

/* ── Mini mockups ───────────────────────────────────────── */

function ShutterMockup() {
  return (
    <View style={mockup.shutter}>
      <Ionicons name="camera-outline" size={30} color={COLORS.text} />
    </View>
  );
}

function VerlaufMockup() {
  return (
    <View style={mockup.row}>
      <Text style={mockup.rowText} numberOfLines={1}>
        Brief vom Amt
      </Text>
      <View style={mockup.badge}>
        <Text style={mockup.badgeText}>leicht</Text>
      </View>
      <Ionicons name="document-text-outline" size={20} color={COLORS.textMuted} />
    </View>
  );
}

function OptionsMockup() {
  return (
    <View style={mockup.options}>
      <View style={mockup.optionPill}>
        <Ionicons name="sparkles-outline" size={18} color={COLORS.text} />
        <Text style={mockup.optionText}>Einfach</Text>
      </View>
      <View style={mockup.optionPill}>
        <MaterialCommunityIcons name="translate" size={18} color={COLORS.text} />
        <Text style={mockup.optionText}>Übersetzen</Text>
      </View>
      <View style={mockup.optionPill}>
        <MaterialCommunityIcons name="robot-outline" size={18} color={COLORS.text} />
        <Text style={mockup.optionText}>Chatbot</Text>
      </View>
    </View>
  );
}

/* ── Steps ──────────────────────────────────────────────── */

const STEPS: Step[] = [
  {
    key: 'willkommen',
    title: 'Willkommen!',
    text: 'Diese App hilft dir, Texte zu verstehen. Wische nach links, um mehr zu sehen.',
    icon: (
      <Image
        source={require('../../../assets/app_logo.png')}
        style={{ width: 96, height: 96, borderRadius: RADIUS.lg }}
        resizeMode="contain"
      />
    ),
  },
  {
    key: 'foto',
    title: 'Foto machen',
    text: 'Mach ein Foto von einem Brief oder Dokument. Das Foto wird gespeichert.',
    icon: <Ionicons name="camera-outline" size={ICON_SIZE} color={COLORS.text} />,
    mockup: <ShutterMockup />,
  },
  {
    key: 'scan',
    title: 'Text scannen',
    text: 'Du kannst auch Text scannen. Die App liest den Text für dich.',
    icon: <Ionicons name="scan-outline" size={ICON_SIZE} color={COLORS.text} />,
  },
  {
    key: 'verlauf',
    title: 'Verlauf',
    text: 'Alle deine Dokumente findest du im Verlauf.',
    icon: <Feather name="list" size={ICON_SIZE} color={COLORS.text} />,
    mockup: <VerlaufMockup />,
  },
  {
    key: 'dokument',
    title: 'Dokument öffnen',
    text: 'Öffne ein Dokument im Verlauf. Dann kannst du: den Text einfach machen, den Text übersetzen, oder dem Chatbot Fragen stellen.',
    icon: <Ionicons name="document-text-outline" size={ICON_SIZE} color={COLORS.text} />,
    mockup: <OptionsMockup />,
  },
  {
    key: 'fertig',
    title: 'Fertig!',
    text: 'Jetzt kannst du loslegen! Du findest diese Anleitung immer oben auf der Startseite.',
    icon: <Ionicons name="checkmark-circle-outline" size={ICON_SIZE} color={COLORS.badgeGreen} />,
  },
];

/* ── Page ───────────────────────────────────────────────── */

export default function InstructionsPage() {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === STEPS.length - 1;

  function close() {
    Speech.stop();
    router.back();
  }

  function goTo(i: number) {
    if (i < 0 || i >= STEPS.length) return;
    Speech.stop();
    listRef.current?.scrollToIndex({ index: i, animated: true });
    setIndex(i);
  }

  function speak(step: Step) {
    Speech.stop();
    Speech.speak(`${step.title}. ${step.text}`, { language: 'de' });
  }

  return (
    <View style={styles.mainView}>
      {/* Tap above the sheet to close */}
      <TouchableOpacity style={styles.transparentReturnArea} onPress={close} />

      <View style={styles.sheet}>
        {/* Header: title + X */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Anleitung</Text>
          <Button 
            style={styles.closeBtn} 
            onPress={close}
            shape="circle"
            size="small"
          >
            <Ionicons name="close" size={22} color={COLORS.text} />
          </Button>
        </View>

        {/* Cards */}
        <FlatList
          ref={listRef}
          data={STEPS}
          keyExtractor={(item) => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            Speech.stop();
            setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
          }}
          getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
          renderItem={({ item }) => (
            <View style={[styles.page, { width }]}>
              <View style={styles.card}>
                <View style={styles.iconArea}>{item.icon}</View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardText}>{item.text}</Text>

                {item.mockup && <View style={styles.mockupArea}>{item.mockup}</View>}

                <TouchableOpacity
                  style={styles.speakBtn}
                  onPress={() => speak(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="volume-medium-outline" size={22} color={COLORS.text} />
                  <Text style={styles.speakText}>Vorlesen</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Progress dots */}
        <View style={styles.dots}>
          {STEPS.map((step, i) => (
            <View key={step.key} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navBtn, index === 0 && styles.navBtnDisabled]}
            onPress={() => goTo(index - 1)}
            disabled={index === 0}
            activeOpacity={0.7}
          >
            <Text style={styles.navBtnText}>Zurück</Text>
          </TouchableOpacity>

          {isLast ? (
            <TouchableOpacity
              style={[styles.navBtn, styles.navBtnPrimary]}
              onPress={close}
              activeOpacity={0.7}
            >
              <Text style={styles.navBtnText}>Los geht's</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navBtn, styles.navBtnPrimary]}
              onPress={() => goTo(index + 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.navBtnText}>Weiter</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

/* ── Styles ─────────────────────────────────────────────── */

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  transparentReturnArea: {
    backgroundColor: 'rgba(26, 25, 41, 0.45)',
    height: RETURN_AREA_HEIGHT,
  },
  sheet: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingBottom: SPACING.xl,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '700',
  },
  closeBtn: {
    backgroundColor: COLORS.surface,
  },

  // Card
  page: {
    paddingHorizontal: SPACING.lg,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  iconArea: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  cardText: {
    color: COLORS.textSecondary,
    fontSize: 19,
    lineHeight: 30,
    textAlign: 'center',
  },
  mockupArea: {
    marginTop: SPACING.lg,
    width: '100%',
    alignItems: 'center',
  },
  speakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: 'auto',
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
  },
  speakText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '600',
  },

  // Dots
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceLight,
  },
  dotActive: {
    backgroundColor: COLORS.accent,
    width: 20,
  },

  // Navigation
  navRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  navBtn: {
    flex: 1,
    height: 54,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnPrimary: {
    backgroundColor: COLORS.accent,
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
});

/* ── Mockup styles ──────────────────────────────────────── */

const mockup = StyleSheet.create({
  shutter: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    width: '100%',
  },
  rowText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.badgeGreenBg,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.badgeGreen,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  optionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
  },
  optionText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
});

import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { colors, fonts, fontSize, spacing, tracking } from '../theme/theme';
import { loadQuests, saveQuests } from '../data/storage';
import type { Quest, QuestType } from '../data/quests';
import QuestList from '../components/QuestList';
import GradientBackground from '../components/GradientBackground';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'QuestList'>;

const questTypes: QuestType[] = ['Main Quest', 'Side Quest', 'Bounty', 'Errand'];
const emptyForm = { title: '', type: 'Side Quest' as QuestType, objective: '' };

export default function QuestListScreen() {
  const navigation = useNavigation<Nav>();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setQuests(await loadQuests());
  }, []);

  useEffect(() => { load(); }, [load]);

  function addQuest() {
    if (!form.title.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const quest: Quest = {
      id: Date.now(),
      title: form.title.trim(),
      type: form.type,
      status: 'active',
      location: '',
      objective: form.objective.trim(),
      details: '',
      tasks: [],
    };

    const next = [...quests, quest];
    setQuests(next);
    saveQuests(next);
    setForm(emptyForm);
    setShowForm(false);
  }

  return (
    <GradientBackground>
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={120}
      >
        <QuestList
          quests={quests}
          onSelect={(quest) =>
            navigation.navigate('QuestDetail', { questId: quest.id })
          }
        />

        {showForm && (
          <View style={styles.form}>
            <TextInput
              style={styles.formInputWide}
              value={form.title}
              onChangeText={(v) => setForm((f) => ({ ...f, title: v }))}
              placeholder="Quest title"
              placeholderTextColor={colors.grayMid}
              autoFocus
            />
            <TextInput
              style={styles.formInputWide}
              value={form.objective}
              onChangeText={(v) => setForm((f) => ({ ...f, objective: v }))}
              placeholder="Objective"
              placeholderTextColor={colors.grayMid}
            />
            <View style={styles.typeRow}>
              {questTypes.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setForm((f) => ({ ...f, type: t }))}
                  style={[styles.typeChip, form.type === t && styles.typeChipActive]}
                >
                  <Text
                    style={[styles.typeChipText, form.type === t && styles.typeChipTextActive]}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.formActions}>
              <Pressable onPress={() => { setShowForm(false); setForm(emptyForm); }}>
                <Text style={styles.cancelText}>CANCEL</Text>
              </Pressable>
              <Pressable onPress={addQuest}>
                <Text style={styles.addText}>ADD</Text>
              </Pressable>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>

      {!showForm && (
        <Pressable
          onPress={() => { Haptics.selectionAsync(); setShowForm(true); }}
          style={styles.fab}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      )}
    </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  body: {
    flex: 1,
  },
  form: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.grayBorder,
  },
  formInputWide: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBorder,
    paddingVertical: spacing.sm,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grayBorder,
    borderRadius: 4,
  },
  typeChipActive: {
    borderColor: colors.white,
    backgroundColor: colors.grayDim,
  },
  typeChipText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
  typeChipTextActive: {
    color: colors.white,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.xl,
    paddingTop: spacing.sm,
  },
  cancelText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
  addText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.white,
    letterSpacing: tracking.wide,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.heading,
    color: colors.black,
    marginTop: -1,
  },
});

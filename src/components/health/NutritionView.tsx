import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, fontSize, spacing, tracking } from '../../theme/theme';
import type { Macros, Meal, DailyNutrition } from '../../data/storage';
import { loadNutrition, saveNutrition, loadGoals, todayKey } from '../../data/storage';
import MacroBar from './MacroBar';

const emptyForm = { name: '', calories: '', protein: '', carbs: '', fat: '' };

export default function NutritionView() {
  const [nutrition, setNutrition] = useState<DailyNutrition>({ date: todayKey(), meals: [] });
  const [goals, setGoals] = useState<Macros>({ calories: 2000, protein: 150, carbs: 250, fat: 70 });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const date = todayKey();

  useEffect(() => {
    (async () => {
      const [n, g] = await Promise.all([loadNutrition(date), loadGoals()]);
      setNutrition(n);
      setGoals(g);
    })();
  }, [date]);

  const totals = nutrition.meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.macros.calories,
      protein: acc.protein + m.macros.protein,
      carbs: acc.carbs + m.macros.carbs,
      fat: acc.fat + m.macros.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  function addMeal() {
    if (!form.name.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const meal: Meal = {
      id: Date.now().toString(36),
      name: form.name.trim(),
      macros: {
        calories: parseInt(form.calories, 10) || 0,
        protein: parseInt(form.protein, 10) || 0,
        carbs: parseInt(form.carbs, 10) || 0,
        fat: parseInt(form.fat, 10) || 0,
      },
    };

    const next = { ...nutrition, meals: [...nutrition.meals, meal] };
    setNutrition(next);
    saveNutrition(next);
    setForm(emptyForm);
    setShowForm(false);
  }

  function removeMeal(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = { ...nutrition, meals: nutrition.meals.filter((m) => m.id !== id) };
    setNutrition(next);
    saveNutrition(next);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={120}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.macros}>
          <MacroBar label="Calories" current={totals.calories} goal={goals.calories} />
          <MacroBar label="Protein" current={totals.protein} goal={goals.protein} unit="g" />
          <MacroBar label="Carbs" current={totals.carbs} goal={goals.carbs} unit="g" />
          <MacroBar label="Fat" current={totals.fat} goal={goals.fat} unit="g" />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>MEALS</Text>
            <Text style={styles.mealCount}>{nutrition.meals.length}</Text>
          </View>

          {nutrition.meals.map((meal) => (
            <Pressable
              key={meal.id}
              onLongPress={() => removeMeal(meal.id)}
              style={styles.mealRow}
            >
              <Text style={styles.mealName}>{meal.name}</Text>
              <View style={styles.mealMacros}>
                <Text style={styles.mealCal}>{meal.macros.calories}</Text>
                <Text style={styles.mealDetail}>
                  P {meal.macros.protein} C {meal.macros.carbs} F {meal.macros.fat}
                </Text>
              </View>
            </Pressable>
          ))}

          {nutrition.meals.length === 0 && !showForm && (
            <View style={styles.emptyMeals}>
              <Text style={styles.emptyText}>NO MEALS LOGGED</Text>
            </View>
          )}
        </View>

        {showForm && (
          <View style={styles.form}>
            <TextInput
              style={styles.formInputWide}
              value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
              placeholder="Meal name"
              placeholderTextColor={colors.grayMid}
              autoFocus
            />
            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>CAL</Text>
                <TextInput
                  style={styles.formInput}
                  value={form.calories}
                  onChangeText={(v) => setForm((f) => ({ ...f, calories: v }))}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayMid}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>P</Text>
                <TextInput
                  style={styles.formInput}
                  value={form.protein}
                  onChangeText={(v) => setForm((f) => ({ ...f, protein: v }))}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayMid}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>C</Text>
                <TextInput
                  style={styles.formInput}
                  value={form.carbs}
                  onChangeText={(v) => setForm((f) => ({ ...f, carbs: v }))}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayMid}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>F</Text>
                <TextInput
                  style={styles.formInput}
                  value={form.fat}
                  onChangeText={(v) => setForm((f) => ({ ...f, fat: v }))}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayMid}
                />
              </View>
            </View>
            <View style={styles.formActions}>
              <Pressable onPress={() => { setShowForm(false); setForm(emptyForm); }}>
                <Text style={styles.cancelText}>CANCEL</Text>
              </Pressable>
              <Pressable onPress={addMeal}>
                <Text style={styles.addText}>ADD</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      {!showForm && (
        <Pressable
          onPress={() => { Haptics.selectionAsync(); setShowForm(true); }}
          style={styles.fab}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingBottom: spacing.xxl * 3,
  },
  macros: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayBorder,
  },
  section: {
    paddingTop: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.grayDim,
  },
  sectionTitle: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
  mealCount: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.loose,
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayBorder,
  },
  mealName: {
    fontFamily: fonts.medium,
    fontSize: fontSize.body,
    color: colors.white,
    flex: 1,
  },
  mealMacros: {
    alignItems: 'flex-end',
    gap: 2,
  },
  mealCal: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.grayLight,
    letterSpacing: tracking.loose,
  },
  mealDetail: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.loose,
  },
  emptyMeals: {
    paddingVertical: spacing.xxl * 2,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
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
  formRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  formField: {
    flex: 1,
    gap: 4,
  },
  formLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
  formInput: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBorder,
    paddingVertical: 4,
    textAlign: 'center',
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WorkoutDay, WorkoutSession } from './workouts';
import { initialProgram } from './workouts';

const KEYS = {
  program: 'health:program',
  weekNumber: 'health:week',
  workoutLog: (date: string) => `health:workout:${date}`,
  nutrition: (date: string) => `health:nutrition:${date}`,
  nutritionGoals: 'health:nutrition-goals',
} as const;

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  macros: Macros;
}

export interface DailyNutrition {
  date: string;
  meals: Meal[];
}

export const defaultGoals: Macros = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 70,
};

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// --- Program ---

export async function loadProgram(): Promise<WorkoutDay[]> {
  const raw = await AsyncStorage.getItem(KEYS.program);
  if (raw) return JSON.parse(raw);
  await AsyncStorage.setItem(KEYS.program, JSON.stringify(initialProgram));
  return initialProgram;
}

export async function saveProgram(program: WorkoutDay[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.program, JSON.stringify(program));
}

// --- Week ---

export async function loadWeek(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.weekNumber);
  return raw ? parseInt(raw, 10) : 1;
}

export async function saveWeek(week: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.weekNumber, String(week));
}

// --- Workout Log ---

export async function loadWorkoutLog(date: string): Promise<WorkoutSession | null> {
  const raw = await AsyncStorage.getItem(KEYS.workoutLog(date));
  return raw ? JSON.parse(raw) : null;
}

export async function saveWorkoutLog(session: WorkoutSession): Promise<void> {
  await AsyncStorage.setItem(KEYS.workoutLog(session.date), JSON.stringify(session));
}

// --- Nutrition ---

export async function loadNutrition(date: string): Promise<DailyNutrition> {
  const raw = await AsyncStorage.getItem(KEYS.nutrition(date));
  if (raw) return JSON.parse(raw);
  return { date, meals: [] };
}

export async function saveNutrition(data: DailyNutrition): Promise<void> {
  await AsyncStorage.setItem(KEYS.nutrition(data.date), JSON.stringify(data));
}

export async function loadGoals(): Promise<Macros> {
  const raw = await AsyncStorage.getItem(KEYS.nutritionGoals);
  return raw ? JSON.parse(raw) : defaultGoals;
}

export async function saveGoals(goals: Macros): Promise<void> {
  await AsyncStorage.setItem(KEYS.nutritionGoals, JSON.stringify(goals));
}

export interface Exercise {
  id: string;
  name: string;
  notes: string;
  sets: number;
  reps: string;
  load: string;
  rest: string;
  image?: string;
}

export interface WorkoutSection {
  title: string;
  exercises: Exercise[];
}

export interface WorkoutDay {
  id: string;
  label: string;
  sections: WorkoutSection[];
}

export interface SetLog {
  weight: string;
  reps: string;
}

export interface ExerciseLog {
  completed: boolean;
  sets: SetLog[];
}

export interface WorkoutSession {
  date: string;
  dayId: string;
  week: number;
  exercises: Record<string, ExerciseLog>;
}

export const initialProgram: WorkoutDay[] = [
  {
    id: 'day-a',
    label: 'A',
    sections: [
      {
        title: 'Warm-Up',
        exercises: [
          { id: 'a-mp-1', name: 'Pigeon Mob', notes: 'SMR (Glute - 30 sec), Pigeon Mob', sets: 1, reps: ':45 each', load: '', rest: '' },
          { id: 'a-mp-2', name: 'Side Lying T-Spine w/ Shoulder Sweep', notes: '', sets: 1, reps: ':45 each', load: '', rest: '' },
          { id: 'a-mp-3', name: 'Quadruped Handcuffs', notes: '', sets: 1, reps: ':45 each', load: '', rest: '' },
          { id: 'a-mp-4', name: 'Tall Plank w/ Shoulder Tap', notes: '', sets: 1, reps: ':45', load: '', rest: '' },
        ],
      },
      {
        title: 'Resistance Training',
        exercises: [
          { id: 'a-rt-1', name: 'DB Bench Press', notes: '', sets: 3, reps: '8-10', load: '70lb', rest: '-' },
          { id: 'a-rt-2', name: 'Bretzel', notes: '', sets: 2, reps: '6', load: '-', rest: '90+' },
          { id: 'a-rt-3', name: 'DB Chest Supported Row', notes: 'Seat: Lvl 3', sets: 3, reps: '10', load: '60lb', rest: '90+' },
          { id: 'a-rt-4', name: 'DB Incline Press', notes: 'Seat: Lvl 2', sets: 3, reps: '10-12', load: '50lb', rest: '90+' },
          { id: 'a-rt-5', name: 'Lat Pulldown', notes: 'Double D Handle, seat 3', sets: 2, reps: '12', load: '110lb', rest: '90+' },
          { id: 'a-rt-6', name: 'Cable Flys', notes: 'Seat: 6, Arms: 3', sets: 2, reps: '15', load: '105lb', rest: '60' },
          { id: 'a-rt-7', name: 'Straight Arm Pulldown', notes: 'Straight Bar', sets: 2, reps: '12', load: '40lb', rest: '60' },
        ],
      },
      {
        title: 'Steady State Cardio',
        exercises: [],
      },
    ],
  },
  {
    id: 'day-b',
    label: 'B',
    sections: [
      { title: 'Warm-Up', exercises: [] },
      { title: 'Resistance Training', exercises: [] },
      { title: 'Steady State Cardio', exercises: [] },
    ],
  },
  {
    id: 'day-c',
    label: 'C',
    sections: [
      { title: 'Warm-Up', exercises: [] },
      { title: 'Resistance Training', exercises: [] },
      { title: 'Steady State Cardio', exercises: [] },
    ],
  },
  {
    id: 'day-d',
    label: 'D',
    sections: [
      { title: 'Warm-Up', exercises: [] },
      { title: 'Resistance Training', exercises: [] },
      { title: 'Steady State Cardio', exercises: [] },
    ],
  },
  {
    id: 'day-e',
    label: 'E',
    sections: [
      { title: 'Warm-Up', exercises: [] },
      { title: 'Resistance Training', exercises: [] },
      { title: 'Steady State Cardio', exercises: [] },
    ],
  },
];

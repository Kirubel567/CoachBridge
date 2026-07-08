// Curated, evidence-based plan templates trainers can assign as-is or tweak.
// Programming reflects current hypertrophy/strength/nutrition research:
//  - 10–20 hard sets per muscle/week; reps 5–8 (heavy), 8–12 (hypertrophy),
//    15–30 (isolation), all taken near failure (RIR 0–3).
//  - Beginners: full-body 3×/week, linear progression, deload ~every 4 weeks.
//  - Fat loss: 300–500 kcal deficit, protein 1.8–2.2 g/kg.
//  - Lean bulk: +100–300 kcal surplus, protein 1.6–2.2 g/kg, 3–5 meals.
// Sources are cited to the user in chat, not stored here.

import type { NutritionContent, WorkoutContent } from './plan-content';

export interface WorkoutTemplate {
  key: string;
  type: 'workout';
  title: string;
  summary: string;
  content: WorkoutContent;
}
export interface NutritionTemplate {
  key: string;
  type: 'nutrition';
  title: string;
  summary: string;
  content: NutritionContent;
}
export type PlanTemplate = WorkoutTemplate | NutritionTemplate;

const workoutTemplates: WorkoutTemplate[] = [
  {
    key: 'foundations-full-body',
    type: 'workout',
    title: 'Foundations — Full Body 3×/Week',
    summary:
      'Beginner strength base built on the main compound lifts with simple linear progression. The fastest, most efficient way to start.',
    content: {
      goal: 'Build a strength & technique base',
      level: 'beginner',
      daysPerWeek: 3,
      durationWeeks: 8,
      progression:
        'Add the smallest increment (2.5 kg upper / 5 kg lower) to each main lift every session you hit all reps with good form. Deload 10% in week 4 and 8.',
      notes: [
        'Train on non-consecutive days (e.g. Mon/Wed/Fri).',
        'Leave 1–3 reps in reserve; form before weight (RPE 6–8).',
        'Warm up each lift with 2–3 lighter build-up sets.',
      ],
      days: [
        {
          name: 'Day A',
          focus: 'Squat-focused full body',
          exercises: [
            { name: 'Back Squat', sets: 3, reps: '5', restSec: 180, rir: 2 },
            { name: 'Bench Press', sets: 3, reps: '5', restSec: 150, rir: 2 },
            { name: 'Bent-Over Row', sets: 3, reps: '8-10', restSec: 120, rir: 2 },
            { name: 'Plank', sets: 3, reps: '30-45s', restSec: 60 },
          ],
        },
        {
          name: 'Day B',
          focus: 'Deadlift-focused full body',
          exercises: [
            { name: 'Deadlift', sets: 2, reps: '5', restSec: 210, rir: 2 },
            { name: 'Overhead Press', sets: 3, reps: '5-6', restSec: 150, rir: 2 },
            { name: 'Lat Pulldown / Pull-up', sets: 3, reps: '8-12', restSec: 120, rir: 1 },
            { name: 'Dumbbell Curl', sets: 2, reps: '10-15', restSec: 60, rir: 1 },
          ],
        },
        {
          name: 'Day C',
          focus: 'Volume full body',
          exercises: [
            { name: 'Front Squat / Goblet Squat', sets: 3, reps: '8-10', restSec: 150, rir: 2 },
            { name: 'Incline Dumbbell Press', sets: 3, reps: '8-12', restSec: 120, rir: 1 },
            { name: 'Seated Cable Row', sets: 3, reps: '10-12', restSec: 120, rir: 1 },
            { name: 'Romanian Deadlift', sets: 2, reps: '10-12', restSec: 120, rir: 2 },
          ],
        },
      ],
    },
  },
  {
    key: 'ppl-hypertrophy',
    type: 'workout',
    title: 'Push / Pull / Legs — Hypertrophy 6×/Week',
    summary:
      'Higher-volume intermediate split hitting each muscle twice weekly (~12–18 sets/muscle) for maximal muscle growth.',
    content: {
      goal: 'Maximise muscle growth',
      level: 'intermediate',
      daysPerWeek: 6,
      durationWeeks: 8,
      progression:
        'Double progression: when you hit the top of a rep range on all sets, add weight and drop back to the bottom of the range. Deload every 6–8 weeks.',
      notes: [
        'Order: Push / Pull / Legs / Push / Pull / Legs, then a rest day.',
        'Keep most sets at RIR 1–2; last set of isolation work to near failure.',
      ],
      days: [
        {
          name: 'Push',
          focus: 'Chest, shoulders, triceps',
          exercises: [
            { name: 'Barbell Bench Press', sets: 4, reps: '6-8', restSec: 150, rir: 1 },
            { name: 'Incline Dumbbell Press', sets: 3, reps: '8-12', restSec: 120, rir: 1 },
            { name: 'Overhead Press', sets: 3, reps: '8-10', restSec: 120, rir: 1 },
            { name: 'Cable Lateral Raise', sets: 4, reps: '12-20', restSec: 60, rir: 0 },
            { name: 'Triceps Rope Pushdown', sets: 3, reps: '10-15', restSec: 60, rir: 1 },
          ],
        },
        {
          name: 'Pull',
          focus: 'Back, rear delts, biceps',
          exercises: [
            { name: 'Weighted Pull-up / Lat Pulldown', sets: 4, reps: '6-10', restSec: 150, rir: 1 },
            { name: 'Chest-Supported Row', sets: 4, reps: '8-12', restSec: 120, rir: 1 },
            { name: 'Face Pull', sets: 3, reps: '15-20', restSec: 60, rir: 1 },
            { name: 'Incline Dumbbell Curl', sets: 3, reps: '10-15', restSec: 60, rir: 0 },
          ],
        },
        {
          name: 'Legs',
          focus: 'Quads, hamstrings, glutes, calves',
          exercises: [
            { name: 'Back Squat', sets: 4, reps: '6-8', restSec: 180, rir: 1 },
            { name: 'Romanian Deadlift', sets: 3, reps: '8-12', restSec: 150, rir: 1 },
            { name: 'Leg Press', sets: 3, reps: '10-15', restSec: 120, rir: 1 },
            { name: 'Seated Leg Curl', sets: 3, reps: '12-15', restSec: 90, rir: 0 },
            { name: 'Standing Calf Raise', sets: 4, reps: '10-15', restSec: 60, rir: 0 },
          ],
        },
      ],
    },
  },
  {
    key: 'upper-lower-strength',
    type: 'workout',
    title: 'Upper / Lower — Strength & Size 4×/Week',
    summary:
      'Balanced 4-day split blending heavy strength work with hypertrophy accessories. Great all-round intermediate program.',
    content: {
      goal: 'Strength and size',
      level: 'intermediate',
      daysPerWeek: 4,
      durationWeeks: 8,
      progression:
        'Main lifts: add weight weekly while keeping reps. Accessories: double progression in the listed range. Deload every 4th week.',
      notes: ['Run as Upper / Lower / rest / Upper / Lower / rest / rest.'],
      days: [
        {
          name: 'Upper (Strength)',
          focus: 'Heavy push & pull',
          exercises: [
            { name: 'Bench Press', sets: 4, reps: '4-6', restSec: 180, rir: 1 },
            { name: 'Weighted Pull-up / Row', sets: 4, reps: '5-8', restSec: 150, rir: 1 },
            { name: 'Overhead Press', sets: 3, reps: '6-8', restSec: 120, rir: 1 },
            { name: 'Barbell Curl + Skullcrusher (superset)', sets: 3, reps: '8-12', restSec: 75, rir: 1 },
          ],
        },
        {
          name: 'Lower (Strength)',
          focus: 'Squat & hinge',
          exercises: [
            { name: 'Back Squat', sets: 4, reps: '4-6', restSec: 180, rir: 1 },
            { name: 'Romanian Deadlift', sets: 3, reps: '6-8', restSec: 150, rir: 1 },
            { name: 'Bulgarian Split Squat', sets: 3, reps: '8-12', restSec: 90, rir: 1 },
            { name: 'Standing Calf Raise', sets: 4, reps: '10-15', restSec: 60, rir: 0 },
          ],
        },
        {
          name: 'Upper (Hypertrophy)',
          focus: 'Volume push & pull',
          exercises: [
            { name: 'Incline Dumbbell Press', sets: 4, reps: '8-12', restSec: 120, rir: 1 },
            { name: 'Chest-Supported Row', sets: 4, reps: '10-12', restSec: 120, rir: 1 },
            { name: 'Lateral Raise', sets: 4, reps: '12-20', restSec: 60, rir: 0 },
            { name: 'Cable Curl + Pushdown (superset)', sets: 3, reps: '12-15', restSec: 60, rir: 0 },
          ],
        },
        {
          name: 'Lower (Hypertrophy)',
          focus: 'Volume legs',
          exercises: [
            { name: 'Leg Press', sets: 4, reps: '10-15', restSec: 120, rir: 1 },
            { name: 'Seated Leg Curl', sets: 4, reps: '12-15', restSec: 90, rir: 0 },
            { name: 'Leg Extension', sets: 3, reps: '12-20', restSec: 75, rir: 0 },
            { name: 'Hanging Leg Raise', sets: 3, reps: '10-15', restSec: 60, rir: 1 },
          ],
        },
      ],
    },
  },
  {
    key: 'fat-loss-conditioning',
    type: 'workout',
    title: 'Lean & Conditioned — Fat Loss 4×/Week',
    summary:
      'Full-body strength to preserve muscle in a deficit, finished with short HIIT. Pair with the fat-loss nutrition plan.',
    content: {
      goal: 'Lose fat while keeping muscle',
      level: 'beginner',
      daysPerWeek: 4,
      durationWeeks: 8,
      progression:
        'Keep the weights heavy (lifting preserves muscle in a deficit) — progress load when you can. Add one HIIT round every two weeks. Aim 7k–10k daily steps.',
      notes: [
        'Two full-body strength days + two strength-plus-HIIT days.',
        'HIIT: 20s hard / 40s easy (bike, row, or hill sprints).',
      ],
      days: [
        {
          name: 'Strength A',
          focus: 'Full body',
          exercises: [
            { name: 'Goblet Squat', sets: 3, reps: '8-12', restSec: 90, rir: 2 },
            { name: 'Dumbbell Bench Press', sets: 3, reps: '8-12', restSec: 90, rir: 2 },
            { name: 'Lat Pulldown', sets: 3, reps: '10-12', restSec: 90, rir: 1 },
            { name: 'Plank', sets: 3, reps: '30-60s', restSec: 45 },
          ],
        },
        {
          name: 'Strength + HIIT B',
          focus: 'Full body + intervals',
          exercises: [
            { name: 'Romanian Deadlift', sets: 3, reps: '10-12', restSec: 90, rir: 2 },
            { name: 'Overhead Press', sets: 3, reps: '8-12', restSec: 90, rir: 1 },
            { name: 'Seated Row', sets: 3, reps: '10-12', restSec: 90, rir: 1 },
            { name: 'HIIT Intervals (20s/40s)', sets: 8, reps: '20s', restSec: 40 },
          ],
        },
      ],
    },
  },
  {
    key: 'home-bodyweight',
    type: 'workout',
    title: 'Home Bodyweight — No Equipment 3×/Week',
    summary:
      'Progressive calisthenics you can do anywhere. Progress by adding reps, slowing tempo, or advancing to harder variations.',
    content: {
      goal: 'Build strength with no equipment',
      level: 'beginner',
      daysPerWeek: 3,
      durationWeeks: 8,
      progression:
        'Add 1–2 reps per set each week. When you pass the top of the range on all sets, move to the harder variation (e.g. knee → full → decline push-up).',
      notes: ['Full body each session; rest a day between.'],
      days: [
        {
          name: 'Full Body',
          focus: 'Push, pull, legs, core',
          exercises: [
            { name: 'Push-up (progress: knee → full → decline)', sets: 3, reps: '8-20', restSec: 75, rir: 1 },
            { name: 'Inverted Row (under a table) / Doorway Row', sets: 3, reps: '8-15', restSec: 75, rir: 1 },
            { name: 'Bodyweight Squat / Split Squat', sets: 3, reps: '12-25', restSec: 75, rir: 2 },
            { name: 'Glute Bridge', sets: 3, reps: '12-20', restSec: 60, rir: 1 },
            { name: 'Plank / Hollow Hold', sets: 3, reps: '30-60s', restSec: 45 },
          ],
        },
      ],
    },
  },
];

const nutritionTemplates: NutritionTemplate[] = [
  {
    key: 'fat-loss-nutrition',
    type: 'nutrition',
    title: 'Fat-Loss Nutrition — Moderate Deficit',
    summary:
      'A sustainable 300–500 kcal deficit with high protein to strip fat while protecting muscle. Example targets for a ~75 kg person.',
    content: {
      goal: 'Lose fat, keep muscle',
      caloriesKcal: 1900,
      proteinG: 150,
      carbsG: 170,
      fatG: 55,
      proteinPerKg: '1.8–2.2 g/kg bodyweight',
      mealsPerDay: 4,
      guidelines: [
        'Target 0.5–1% bodyweight loss per week; adjust calories if the scale stalls 2–3 weeks.',
        'Protein every meal (25–40 g) keeps you full and preserves muscle.',
        'Fill half the plate with vegetables/fruit for volume and fibre.',
        'Prioritise whole foods; keep hydrated (2–3 L water/day).',
        'Local swaps: shiro/lentils, lean beef (tibs), eggs, yoghurt, injera in measured portions.',
      ],
      sampleMeals: [
        { name: 'Breakfast', items: ['3 eggs + 2 whites', 'Oats (50g)', 'Banana'], approxKcal: 470, proteinG: 34 },
        { name: 'Lunch', items: ['Grilled chicken (150g)', 'Injera (1) or rice (1 cup)', 'Salad'], approxKcal: 560, proteinG: 45 },
        { name: 'Snack', items: ['Greek yoghurt (200g)', 'Handful of nuts'], approxKcal: 300, proteinG: 22 },
        { name: 'Dinner', items: ['Lean beef tibs (150g)', 'Shiro (small)', 'Vegetables'], approxKcal: 570, proteinG: 49 },
      ],
    },
  },
  {
    key: 'lean-muscle-gain',
    type: 'nutrition',
    title: 'Lean Muscle Gain — Controlled Surplus',
    summary:
      'A modest +100–300 kcal surplus with ample protein to build muscle while minimising fat gain. Example targets for a ~75 kg person.',
    content: {
      goal: 'Build lean muscle',
      caloriesKcal: 2700,
      proteinG: 160,
      carbsG: 330,
      fatG: 75,
      proteinPerKg: '1.6–2.2 g/kg bodyweight',
      mealsPerDay: 4,
      guidelines: [
        'Aim for ~0.25–0.5% bodyweight gain per week; if gaining faster, trim carbs/fats slightly.',
        'Carbohydrates fuel hard training — keep them around workouts.',
        'Spread protein across 3–5 meals (~0.4 g/kg each).',
        'Do not neglect sleep (7–9 h) and progressive overload — food alone does not build muscle.',
      ],
      sampleMeals: [
        { name: 'Breakfast', items: ['4 eggs', 'Oats (80g) + milk', 'Berries'], approxKcal: 650, proteinG: 40 },
        { name: 'Lunch', items: ['Chicken/beef (180g)', 'Rice (1.5 cups)', 'Vegetables + olive oil'], approxKcal: 780, proteinG: 52 },
        { name: 'Pre/Post-workout', items: ['Greek yoghurt (200g)', 'Banana', 'Honey'], approxKcal: 420, proteinG: 24 },
        { name: 'Dinner', items: ['Fish or lentils (shiro/misir)', 'Injera (2)', 'Avocado'], approxKcal: 750, proteinG: 44 },
      ],
    },
  },
  {
    key: 'maintenance-recomp',
    type: 'nutrition',
    title: 'Maintenance & Recomposition',
    summary:
      'Eat around maintenance with high protein to slowly build muscle and lose fat at the same time — ideal for beginners returning to training.',
    content: {
      goal: 'Body recomposition',
      caloriesKcal: 2300,
      proteinG: 160,
      carbsG: 250,
      fatG: 70,
      proteinPerKg: '1.6–2.2 g/kg bodyweight',
      mealsPerDay: 4,
      guidelines: [
        'Keep calories near maintenance; let body composition change while weight holds roughly steady.',
        'High protein + progressive resistance training drives recomposition.',
        'Recomposition is slower than a dedicated cut or bulk — judge progress by photos, tape, and lifts, not just the scale.',
      ],
      sampleMeals: [
        { name: 'Breakfast', items: ['3 eggs', 'Whole-grain toast', 'Fruit'], approxKcal: 450, proteinG: 30 },
        { name: 'Lunch', items: ['Chicken (150g)', 'Rice (1 cup)', 'Big salad'], approxKcal: 600, proteinG: 46 },
        { name: 'Snack', items: ['Cottage cheese / yoghurt (200g)', 'Fruit'], approxKcal: 280, proteinG: 24 },
        { name: 'Dinner', items: ['Lentils (misir) or fish', 'Injera (1–2)', 'Vegetables'], approxKcal: 620, proteinG: 40 },
      ],
    },
  },
];

export const planTemplates: PlanTemplate[] = [...workoutTemplates, ...nutritionTemplates];

export function findTemplate(key: string): PlanTemplate | undefined {
  return planTemplates.find((t) => t.key === key);
}

/** Lightweight list for browsing (no full content). */
export function templateSummaries() {
  return planTemplates.map((t) => ({
    key: t.key,
    type: t.type,
    title: t.title,
    summary: t.summary,
    ...(t.type === 'workout'
      ? { level: t.content.level, daysPerWeek: t.content.daysPerWeek }
      : { caloriesKcal: t.content.caloriesKcal, proteinG: t.content.proteinG }),
  }));
}

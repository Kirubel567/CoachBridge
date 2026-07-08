import { AppException } from '../common/app-exception';

export interface Exercise {
  name: string;
  sets: number;
  reps: string; // "5", "8-12", "30-45s"
  restSec: number;
  rir?: number;
  tempo?: string;
  notes?: string;
}
export interface WorkoutDay {
  name: string;
  focus?: string;
  exercises: Exercise[];
}
export interface WorkoutContent {
  goal: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  durationWeeks: number;
  progression: string;
  notes?: string[];
  days: WorkoutDay[];
}

export interface Meal {
  name: string;
  items: string[];
  approxKcal?: number;
  proteinG?: number;
}
export interface NutritionContent {
  goal: string;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  proteinPerKg?: string;
  mealsPerDay: number;
  guidelines: string[];
  sampleMeals: Meal[];
}

function fail(msg: string): never {
  throw new AppException('VALIDATION_ERROR', msg, 'content');
}

function nonNegInt(v: unknown, label: string) {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) {
    fail(`${label} must be a number ≥ 0.`);
  }
}

/**
 * Structural validation for a plan's JSON content. Enforces the SRS rule that
 * sets / reps / calories can never be negative, plus basic shape checks.
 */
export function validatePlanContent(type: 'workout' | 'nutrition', content: unknown): void {
  if (typeof content !== 'object' || content === null) {
    fail('Plan content is required.');
  }
  const c = content as Record<string, unknown>;

  if (type === 'workout') {
    const days = c.days;
    if (!Array.isArray(days) || days.length === 0) {
      fail('A workout plan needs at least one day.');
    }
    for (const day of days as WorkoutDay[]) {
      if (!day || typeof day.name !== 'string') fail('Each workout day needs a name.');
      if (!Array.isArray(day.exercises) || day.exercises.length === 0) {
        fail(`Day "${day?.name ?? '?'}" needs at least one exercise.`);
      }
      for (const ex of day.exercises) {
        if (!ex || typeof ex.name !== 'string' || !ex.name.trim()) {
          fail('Every exercise needs a name.');
        }
        if (typeof ex.sets !== 'number' || !Number.isInteger(ex.sets) || ex.sets < 1) {
          fail(`Exercise "${ex.name}" must have at least 1 set.`);
        }
        nonNegInt(ex.restSec, `Rest for "${ex.name}"`);
        if (typeof ex.reps !== 'string' || !ex.reps.trim()) {
          fail(`Exercise "${ex.name}" needs reps.`);
        }
        if (ex.reps.trim().startsWith('-')) fail(`Reps for "${ex.name}" cannot be negative.`);
      }
    }
  } else {
    nonNegInt(c.caloriesKcal, 'Calories');
    nonNegInt(c.proteinG, 'Protein (g)');
    nonNegInt(c.carbsG, 'Carbs (g)');
    nonNegInt(c.fatG, 'Fat (g)');
    if (Array.isArray(c.sampleMeals)) {
      for (const meal of c.sampleMeals as Meal[]) {
        if (meal?.approxKcal !== undefined) nonNegInt(meal.approxKcal, 'Meal calories');
        if (meal?.proteinG !== undefined) nonNegInt(meal.proteinG, 'Meal protein');
      }
    }
  }
}


import { z } from 'zod';

// Schemas for Diet Plan Generation (remains source of truth for these)
export const MealSchema = z.object({
  nameSw: z.string().describe('Meal/Dish name in Swahili.'),
  nameEn: z.string().describe('Meal/Dish name in English.'),
  ingredients: z
    .array(
      z.object({
        name: z.string().describe('Ingredient name (English).'),
        quantity: z.string().describe('Portion size (e.g., 100g, 1/2 cup).'),
      })
    )
    .describe('List of ingredients and their quantities.'),
  preparation: z
    .string()
    .optional()
    .describe('Simple preparation instructions.'),
});
export type Meal = z.infer<typeof MealSchema>;

export const DailyPlanSchema = z.object({
  day: z.string().describe('Day of the week (e.g., Monday, Jumanne).'),
  meals: z.object({
    morning: MealSchema.describe('Breakfast meal.'),
    midMorningSnack: MealSchema.describe('Mid-morning snack.'),
    lunch: MealSchema.describe('Lunch meal.'),
    afternoonSnack: MealSchema.describe('Afternoon snack.'),
    dinner: MealSchema.describe('Dinner meal.'),
    optionalBedtimeSnack: MealSchema.optional().describe('Optional bedtime snack.'),
  }),
  totalCalories: z
    .number()
    .optional()
    .describe('Estimated total calories for the day.'),
});
export type DailyPlan = z.infer<typeof DailyPlanSchema>;

export const GenerateDietPlanInputSchema = z.object({
  prescriptionText: z.string().min(10, { message: "Prescription text must be at least 10 characters long. Please ensure AI OCR was successful or enter valid details." }).describe('The text extracted from the doctor’s prescription.'),
  foodAllergies: z.string().describe('A comma-separated list of food allergies or intolerances (e.g., gluten, nuts, shellfish, lactose). If the user has no allergies, enter "none".'),
  chronicConditions: z.string().describe('A comma-separated list of chronic conditions or diseases (e.g., type 2 diabetes, hypertension). If none, enter "none".'),
  age: z.number().int().positive().min(1, {message: "Age must be a positive number."}).max(120, {message: "Age must be 120 or less."}).describe('Age in years.'),
  weightKg: z.number().positive({message: "Weight must be a positive number."}).describe('Current weight in kilograms.'),
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active'], {required_error: "Activity level is required."}).describe('Typical daily activity level.'),
  preferences: z.string().optional().describe('User dietary preferences (e.g., vegetarian, dislikes specific foods).'),
  calorieTarget: z.number().int().positive().optional().describe('Specific daily calorie target, if any.'),
});
export type GenerateDietPlanInput = z.infer<typeof GenerateDietPlanInputSchema>;

export const GenerateDietPlanOutputSchema = z.object({
  weeklyPlan: z
    .array(DailyPlanSchema)
    .describe('A 7-day rotating meal schedule.'),
  shoppingList: z
    .array(
      z.object({
        item: z.string().describe('Grocery item name (English).'),
        quantity: z
          .string()
          .optional()
          .describe('Estimated quantity needed for the week.'),
        notesSw: z
          .string()
          .optional()
          .describe('Notes in Swahili (e.g., type of vegetable).'),
      })
    )
    .describe('Consolidated shopping list for the week.'),
  generalTipsSw: z
    .array(z.string())
    .describe(
      'General dietary and preparation tips in Swahili (e.g., drink plenty of water, how to cook vegetables).'
    ),
  substitutions: z
    .array(
      z.object({
        originalItemSw: z
          .string()
          .describe('Original ingredient in Swahili.'),
        originalItemEn: z
          .string()
          .describe('Original ingredient in English.'),
        suggestionSw: z.string().describe('Suggested substitute in Swahili.'),
        suggestionEn: z.string().describe('Suggested substitute in English.'),
        reason: z
          .string()
          .optional()
          .describe('Reason for substitution if relevant.'),
      })
    )
    .describe(
      'Ingredient substitution suggestions, especially for allergies or availability.'
    ),
});
export type DietPlan = z.infer<typeof GenerateDietPlanOutputSchema>;

// Schemas for Prescription Text Extraction
export const ExtractPrescriptionTextInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A media file (image or PDF) of a prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractPrescriptionTextInput = z.infer<typeof ExtractPrescriptionTextInputSchema>;

export const ExtractPrescriptionTextOutputSchema = z.object({
  extractedText: z.string().describe('The text extracted from the prescription media. If no text is found or the document is unreadable, this may be an empty string or a note indicating that.'),
  isHealthRelated: z.boolean().describe('Whether the extracted text appears to be health-related (prescription, medical document, health advice, etc.).'),
  healthConfidence: z.number().min(0).max(1).describe('Confidence score (0-1) that the text is health-related.'),
  validationMessage: z.string().optional().describe('Additional context about why the text was or was not considered health-related.'),
});
export type ExtractPrescriptionTextOutput = z.infer<typeof ExtractPrescriptionTextOutputSchema>;


// Alias for components that might have been using the old name from a previous structure.
export const AfyaBoraGenerateDietPlanInputSchema = GenerateDietPlanInputSchema;


export interface UserData {
  prescriptionFiles?: File[] | null;
  prescriptionText?: string;
  // manualPrescription removed
  foodAllergies?: string;
  chronicConditions?: string;
  age?: number;
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  locationCoordinates?: { lat: number; lng: number };
  locationCity?: string;
  
  // Health tracking data
  initialWeight?: number;
  initialWeightUnit?: 'kg' | 'lbs';
  initialBloodSugar?: {
    fbs?: number; // Fasting Blood Sugar
    ppbs?: number; // Postprandial Blood Sugar
  };
  initialBloodPressure?: {
    systolic?: number;
    diastolic?: number;
  };
  
  dailyWeightEntries?: Array<{ date: string; weight: number; unit: 'kg' | 'lbs' }>;
  bloodSugarReadings?: Array<{ date: string; fbs?: number; ppbs?: number }>;
  bloodPressureReadings?: Array<{ date: string; systolic?: number; diastolic?: number }>;
  dataAiHint?: string; // Used for placeholder image hints
}

export interface Vendor {
  id: string;
  name: string;
  productName: string;
  priceRange: string; 
  deliveryEstimate: string;
  imageUrl?: string;
  item_id: string;
  dataAiHint?: string;
}

export interface Gym {
  id: string;
  name: string;
  address: string;
  distance?: string;
  contact: string;
  pricing: string;
  mapLink: string;
  imageUrl?: string;
  dataAiHint?: string;
}

export interface WorkoutExercise {
  name: string;
  setsReps: string; 
  videoUrl?: string; 
}

export interface WorkoutPlan {
  id: string;
  type: 'No Equipment' | 'Minimal Equipment' | 'Full Gym';
  title: string;
  description: string;
  exercises: WorkoutExercise[];
  restIntervals: string;
  progressionCues: string;
  imageUrl?: string;
  dataAiHint?: string;
}

export const STEPS = [
  { id: 'prescription_patient_data', title: 'AI Prescription & Profile', icon: 'FileText' }, // Merged & Renamed step
  { id: 'diet_plan', title: 'Diet Plan', icon: 'Salad' },
  { id: 'marketplace', title: 'Marketplace', icon: 'ShoppingCart' },
  { id: 'gym_workouts', title: 'Fitness', icon: 'Bike' },
  { id: 'summary', title: 'Summary', icon: 'ClipboardCheck' },
] as const;

export type StepId = typeof STEPS[number]['id'];

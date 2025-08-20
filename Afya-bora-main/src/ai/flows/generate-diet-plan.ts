
'use server';

/**
 * @fileOverview Generates a personalized 7-day diet plan based on user's prescription and health info.
 *
 * - generateDietPlan - A function that generates a diet plan.
 * - GenerateDietPlanInput - The input type for the generateDietPlan function (imported from @/types/afya-bora).
 * - GenerateDietPlanOutput - The return type for the generateDietPlan function (imported from @/types/afya-bora).
 */

import {ai} from '@/ai/genkit';
// Import Zod schemas and TypeScript types from the central types file
import type { 
  GenerateDietPlanInput, 
  GenerateDietPlanOutput 
} from '@/types/afya-bora';
import { 
  GenerateDietPlanInputSchema, 
  GenerateDietPlanOutputSchema 
} from '@/types/afya-bora';

// Export the types for external use (as required by Genkit flow structure)
export type { GenerateDietPlanInput, GenerateDietPlanOutput };

const dietPlanPrompt = ai.definePrompt({
  name: 'generateDietPlanPrompt',
  input: { schema: GenerateDietPlanInputSchema }, // Use imported schema
  output: { schema: GenerateDietPlanOutputSchema }, // Use imported schema
  prompt: `You are an expert nutritionist for Afya Bora, specializing in creating personalized diet plans for users in Tanzania.
Your goal is to generate a 7-day diet plan that is:
- Tailored to the user's medical prescription: {{{prescriptionText}}}
- Mindful of food allergies: {{{foodAllergies}}}
- Aware of chronic conditions: {{{chronicConditions}}}
- Suitable for their age: {{age}} years
- Appropriate for their weight: {{weightKg}} kg
- Aligned with their activity level: {{{activityLevel}}}
- Considers dietary preferences: {{#if preferences}}{{{preferences}}}{{else}}None specified{{/if}}
- Optionally meets a calorie target: {{#if calorieTarget}}{{calorieTarget}} kcal{{else}}balanced for health{{/if}}
- Balances blood sugar and blood pressure.
- Utilizes local Tanzanian produce to minimize costs.
- Provides ingredients and labels in Swahili and English.
- Offers substitutes, preparation tips, and portion sizes.

Generate the following:
1.  **Weekly Plan**: A 7-day meal schedule. For each day, provide meals for morning, mid-morning snack, lunch, afternoon snack, and dinner. An optional bedtime snack can be included.
    For each meal, specify:
    *   Meal/Dish name (Swahili and English)
    *   Ingredients (name in English, quantity like "100g" or "1/2 cup")
    *   Simple preparation instructions (optional)
    *   Estimated total calories for the day (optional).

2.  **Shopping List**: A consolidated list of grocery items needed for the week (item name in English, optional quantity, optional notes in Swahili).

3.  **General Tips (Swahili)**: General dietary advice and preparation tips in Swahili.

4.  **Substitutions**: Suggestions for ingredient substitutions, especially for allergies or local availability (original item Sw/En, suggestion Sw/En, optional reason).

Ensure the output strictly adheres to the JSON schema provided for the output.
Focus on common, affordable Tanzanian ingredients. Examples: ugali, sukuma wiki, mchicha, maharagwe, ndizi, viazi, matunda kama embe na papai.
Translate dish names and key instructions to Swahili.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE', // Medical advice can sometimes be borderline
      },
    ],
  }
});

const generateDietPlanFlow = ai.defineFlow(
  {
    name: 'generateDietPlanFlow',
    inputSchema: GenerateDietPlanInputSchema, // Use imported schema
    outputSchema: GenerateDietPlanOutputSchema, // Use imported schema
  },
  async (input: GenerateDietPlanInput) => { // Use imported type
    const { output } = await dietPlanPrompt(input);
    if (!output) {
      throw new Error("Failed to generate diet plan from LLM.");
    }
    return output;
  }
);

export async function generateDietPlan(input: GenerateDietPlanInput): Promise<GenerateDietPlanOutput> { // Use imported types
  return generateDietPlanFlow(input);
}

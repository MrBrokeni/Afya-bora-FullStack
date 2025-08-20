
// This file can be used if client components need to trigger server-side logic
// that is not directly part of the Genkit flow invocation (which is handled in Step3DietPlan).
// For now, it's mostly for the mock "Order Now" functionality.
'use server';

import { generateDietPlan as generateDietPlanFlow } from '@/ai/flows/generate-diet-plan';
import type { GenerateDietPlanInput, DietPlan } from '@/types/afya-bora';

import { extractPrescriptionText as extractPrescriptionTextFlow } from '@/ai/flows/extract-prescription-text-flow';
// Import types from the central types file
import type { ExtractPrescriptionTextInput, ExtractPrescriptionTextOutput } from '@/types/afya-bora';


interface OrderResponse {
  success: boolean;
  message: string;
  orderId?: string;
}

export async function placeOrderAction(vendorId: string, itemId: string, quantity: number): Promise<OrderResponse> {
  console.log('Simulating order placement:', { vendorId, itemId, quantity });
  // In a real application, this would interact with an e-commerce backend or database.
  // For now, we'll just simulate a successful order.
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  return {
    success: true,
    message: `Order for item ${itemId} (Quantity: ${quantity}) from vendor ${vendorId} has been successfully simulated.`,
    orderId: `mock_order_${Date.now()}`
  };
}


// This function wraps the Genkit flow call.
// It's beneficial to have this server action to clearly separate AI logic invocation.
export async function getGeneratedDietPlan(input: GenerateDietPlanInput): Promise<DietPlan | { error: string }> {
  try {
    // The generate-diet-plan.ts file itself is marked 'use server',
    // so we can import and call its exported functions.
    // We assume `generateDietPlan` is the main exported flow function.
    const result = await generateDietPlanFlow(input);
    
    // Ensure the result matches the DietPlan type structure or adapt as necessary.
    // The AI flow should return data compatible with GenerateDietPlanOutputSchema.
    return result as DietPlan; // Cast if confident in schema alignment
  } catch (error) {
    console.error("Error generating diet plan:", error);
    let errorMessage = "An unexpected error occurred while generating your diet plan.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // It's better to return a structured error than to throw from a server action directly to client
    return { error: errorMessage };
  }
}

export async function extractPrescriptionTextAction(mediaDataUri: string): Promise<ExtractPrescriptionTextOutput | { error: string }> {
  try {
    const input: ExtractPrescriptionTextInput = { mediaDataUri };
    const result = await extractPrescriptionTextFlow(input);
    return result;
  } catch (error) {
    console.error("Error extracting prescription text:", error);
    let errorMessage = "An unexpected error occurred during OCR processing.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { error: errorMessage };
  }
}

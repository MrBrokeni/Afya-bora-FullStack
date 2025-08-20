
'use server';
/**
 * @fileOverview An AI flow to extract text from a prescription image or PDF.
 *
 * - extractPrescriptionText - The exported function to call the flow.
 */

import {ai} from '@/ai/genkit';
import type { 
  ExtractPrescriptionTextInput, 
  ExtractPrescriptionTextOutput 
} from '@/types/afya-bora';
import { 
  ExtractPrescriptionTextInputSchema, 
  ExtractPrescriptionTextOutputSchema 
} from '@/types/afya-bora';

// Export the types for external use if needed by other server components,
// but generally, components calling this action will get types from @/types/afya-bora
export type { ExtractPrescriptionTextInput, ExtractPrescriptionTextOutput };


export async function extractPrescriptionText(input: ExtractPrescriptionTextInput): Promise<ExtractPrescriptionTextOutput> {
  return extractPrescriptionTextFlow(input);
}

const extractPrescriptionTextPrompt = ai.definePrompt({
  name: 'extractPrescriptionTextPrompt',
  model: 'googleai/gemini-2.0-flash', // Explicitly state the vision-capable model
  input: {schema: ExtractPrescriptionTextInputSchema},
  output: {schema: ExtractPrescriptionTextOutputSchema},
  prompt: `You are an Optical Character Recognition (OCR) service.
Your task is to extract all discernible text from the provided medical prescription document (which could be an image or a PDF).
Focus on accurately transcribing:
- Medication names
- Dosages (e.g., 250mg, 1 tablet)
- Frequencies (e.g., 3 times a day, once daily)
- Patient instructions or notes from the doctor
- Any other relevant medical information.

Return only the extracted text. If no text can be clearly identified, or if the document appears to be unreadable or not a prescription, return a brief note indicating this (e.g., "No clear text found." or "Document unreadable.").

Document for OCR:
{{media url=mediaDataUri}}`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }, // Adjusted for medical context
    ],
  },
});

const extractPrescriptionTextFlow = ai.defineFlow(
  {
    name: 'extractPrescriptionTextFlow',
    inputSchema: ExtractPrescriptionTextInputSchema,
    outputSchema: ExtractPrescriptionTextOutputSchema,
  },
  async (input: ExtractPrescriptionTextInput) => {
    const {output} = await extractPrescriptionTextPrompt(input);
    if (!output || typeof output.extractedText === 'undefined') {
      return { extractedText: "OCR processing failed or the document was unreadable." };
    }
    return output;
  }
);

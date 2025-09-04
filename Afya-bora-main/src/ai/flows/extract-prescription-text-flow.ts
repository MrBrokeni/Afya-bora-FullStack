
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
  prompt: `You are an Optical Character Recognition (OCR) service with health content validation capabilities.

Your task has two parts:

1. **TEXT EXTRACTION**: Extract all discernible text from the provided document (which could be an image or a PDF).

2. **HEALTH VALIDATION**: Determine if the extracted text is health-related and suitable for generating a personalized diet plan.

**For TEXT EXTRACTION, focus on:**
- Medication names
- Dosages (e.g., 250mg, 1 tablet)
- Frequencies (e.g., 3 times a day, once daily)
- Patient instructions or notes from the doctor
- Any other relevant medical information

**For HEALTH VALIDATION, consider the text health-related if it contains:**
- Medical prescriptions or medication information
- Health conditions, symptoms, or diagnoses
- Medical advice or recommendations
- Doctor's notes or medical records
- Health-related instructions or warnings
- Nutritional or dietary guidance
- Exercise or fitness recommendations

**The text is NOT health-related if it contains:**
- General business documents, receipts, or invoices
- Personal letters or non-medical correspondence
- News articles or general information
- Entertainment content
- Technical manuals or non-health instructions
- Random text or gibberish

**Output Requirements:**
- extractedText: The complete text extracted from the document
- isHealthRelated: true if the text is health-related, false otherwise
- healthConfidence: A score from 0.0 to 1.0 indicating your confidence that this is health-related content
- validationMessage: A brief explanation of why you classified the text as health-related or not

**Examples:**
- "Take 500mg amoxicillin twice daily for 7 days" → isHealthRelated: true, healthConfidence: 0.95
- "Patient has diabetes, monitor blood sugar levels" → isHealthRelated: true, healthConfidence: 0.9
- "Invoice #12345, Total: $25.99" → isHealthRelated: false, healthConfidence: 0.1
- "Happy birthday! Hope you have a great day" → isHealthRelated: false, healthConfidence: 0.05

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
      return { 
        extractedText: "OCR processing failed or the document was unreadable.",
        isHealthRelated: false,
        healthConfidence: 0.0,
        validationMessage: "OCR processing failed - unable to extract text from document."
      };
    }
    
    // If the text is not health-related, provide a clear message
    if (!output.isHealthRelated) {
      return {
        ...output,
        validationMessage: output.validationMessage || "The extracted text does not appear to be health-related and cannot be used to generate a diet plan. Please upload a medical prescription, health document, or health-related text."
      };
    }
    
    return output;
  }
);

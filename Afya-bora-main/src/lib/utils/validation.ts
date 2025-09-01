import { AfyaBoraGenerateDietPlanInputSchema } from '@/types/afya-bora';
import type { UserData } from '@/types/afya-bora';

export interface ValidationErrors {
  [key: string]: string;
}

export function validatePatientData(userData: UserData): ValidationErrors {
  const errors: ValidationErrors = {};
  const finalPrescriptionText = userData.prescriptionText || "";

  if (!finalPrescriptionText) {
    errors.prescription = "Prescription information is required. Please upload/capture a file and process it using AI OCR.";
  } else if (finalPrescriptionText.length < 10) {
    errors.prescription = "Extracted prescription text is too short. Please try AI OCR with a clearer document or ensure the document contains sufficient medical text.";
  }

  if (!userData.age || isNaN(userData.age) || userData.age <= 0 || userData.age > 120) {
    errors.age = "Please enter a valid age (1-120).";
  }
  
  if (!userData.weight || isNaN(userData.weight) || userData.weight <= 0) {
    errors.weight = "Please enter a valid weight.";
  }
  
  if (!userData.activityLevel) {
    errors.activityLevel = "Please select your activity level.";
  }

  const ageNum = userData.age || 0;
  let weightKgNum = userData.weight || 0;
  if (userData.weightUnit === 'lbs') {
    weightKgNum = (userData.weight || 0) * 0.453592;
  }

  const validationInputForAI = {
    prescriptionText: finalPrescriptionText || "No prescription text available after OCR.",
    foodAllergies: (userData.foodAllergies || "").trim() || "none",
    chronicConditions: (userData.chronicConditions || "").trim() || "none",
    age: ageNum,
    weightKg: weightKgNum,
    activityLevel: userData.activityLevel
  };

  const parseResult = AfyaBoraGenerateDietPlanInputSchema.safeParse(validationInputForAI);
  if (!parseResult.success) {
    parseResult.error.errors.forEach(err => {
      if (err.path.length > 0) {
        const field = err.path[0] as string;
        if (!errors[field]) errors[field] = err.message;
      }
    });
  }

  return errors;
}

export function validateFileUpload(files: File[]): string | null {
  if (files.length > 10) {
    return "You can upload a maximum of 10 files.";
  }

  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      return "One or more files exceed the 5MB size limit (5MB per file).";
    }
    
    if (!['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return "Invalid file type. Please upload PDF, JPG, PNG, or WEBP files.";
    }
  }

  return null;
}

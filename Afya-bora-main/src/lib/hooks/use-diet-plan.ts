import { useCallback } from 'react';
import { getGeneratedDietPlan } from '@/app/actions';
import { saveUserProfile, saveDietPlan } from '@/lib/firestore';
import { getOrCreateUserId } from '@/lib/user';
import { useToast } from '@/hooks/use-toast';
import type { UserData, DietPlan, GenerateDietPlanInput } from '@/types/afya-bora';
import { validatePatientData } from '@/lib/utils/validation';

export interface DietPlanActions {
  generateDietPlan: (userData: UserData) => Promise<DietPlan | null>;
}

export function useDietPlan(
  onDietPlanGenerated: (plan: DietPlan) => void,
  onError: (error: string) => void,
  onLoadingChange: (loading: boolean) => void
): DietPlanActions {
  const { toast } = useToast();

  const generateDietPlan = useCallback(async (userData: UserData): Promise<DietPlan | null> => {
    onError('');
    
    const validationErrors = validatePatientData(userData);
    if (Object.keys(validationErrors).length > 0) {
      const errorMessage = "Please correct the errors in the form before generating the diet plan.";
      onError(errorMessage);
      if (!userData.prescriptionText) {
        toast({
          title: "Prescription Needed",
          description: "Please upload/capture and process a prescription file using AI OCR first.",
          variant: "destructive",
        });
      }
      return null;
    }

    onLoadingChange(true);

    try {
      const finalPrescriptionText = userData.prescriptionText!;
      let weightInKg = userData.weight!;
      if (userData.weightUnit === 'lbs') {
        weightInKg = userData.weight! * 0.453592;
      }

      const dietPlanInput: GenerateDietPlanInput = {
        prescriptionText: finalPrescriptionText,
        foodAllergies: (userData.foodAllergies || "").trim() || "none",
        chronicConditions: (userData.chronicConditions || "").trim() || "none",
        age: userData.age!,
        weightKg: weightInKg,
        activityLevel: userData.activityLevel!,
      };

      const result = await getGeneratedDietPlan(dietPlanInput);

      if ('error' in result) {
        const errorMessage = `Failed to generate diet plan: ${result.error}`;
        onError(errorMessage);
        toast({
          title: "Diet Plan Generation Failed",
          description: result.error,
          variant: "destructive",
        });
        return null;
      }

      onDietPlanGenerated(result);
      
      // Save to Firestore
      try {
        const userId = getOrCreateUserId();
        await saveUserProfile(userId, userData);
        const planId = await saveDietPlan(userId, result);
        console.log('Saved diet plan with id', planId);
      } catch (e) {
        console.error('Failed to save diet plan:', e);
      }

      toast({
        title: "Diet Plan Generated!",
        description: "Your personalized diet plan is ready. Proceeding to view your plan.",
      });

      return result;
    } catch (error) {
      console.error('Diet plan generation error:', error);
      const errorMessage = 'Failed to generate diet plan. Please try again.';
      onError(errorMessage);
      return null;
    } finally {
      onLoadingChange(false);
    }
  }, [onDietPlanGenerated, onError, onLoadingChange, toast]);

  return {
    generateDietPlan,
  };
}

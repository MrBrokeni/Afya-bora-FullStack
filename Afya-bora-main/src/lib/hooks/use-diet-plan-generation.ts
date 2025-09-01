import { useState, useCallback, useEffect } from 'react';
import { getGeneratedDietPlan } from '@/app/actions';
import { saveDietPlan } from '@/lib/firestore';
import { getOrCreateUserId, ensureAnonymousAuth } from '@/lib/user';
import { useToast } from '@/hooks/use-toast';
import type { UserData, DietPlan, GenerateDietPlanInput } from '@/types/afya-bora';

export interface DietPlanGenerationState {
  isLoading: boolean;
  error: string | null;
  dietPlan: DietPlan | null;
}

export interface DietPlanGenerationActions {
  generatePlan: () => Promise<void>;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export function useDietPlanGeneration(
  userData: UserData,
  onPlanGenerated: (plan: DietPlan) => void,
  onError: (error: string) => void
): DietPlanGenerationState & DietPlanGenerationActions {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    ensureAnonymousAuth().catch(err => console.error('Anonymous auth failed', err));
  }, []);

  const generatePlan = useCallback(async () => {
    if (!userData.age || !userData.weight || !userData.activityLevel) {
      const errorMsg = "User data is incomplete. Please go back to the previous step.";
      setError(errorMsg);
      onError(errorMsg);
      setIsLoading(false);
      return;
    }

    if (dietPlan) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let weightInKg = userData.weight;
      if (userData.weightUnit === 'lbs') {
        weightInKg = userData.weight * 0.453592;
      }
      
      const input: GenerateDietPlanInput = {
        prescriptionText: userData.prescriptionText || "No prescription provided.",
        foodAllergies: userData.foodAllergies || "none",
        chronicConditions: userData.chronicConditions || "none",
        age: userData.age,
        weightKg: weightInKg,
        activityLevel: userData.activityLevel,
      };

      const result = await getGeneratedDietPlan(input);

      if ('error' in result) {
        setError(result.error);
        setDietPlan(null);
        onError(result.error);
        toast({
          title: "Error Generating Plan",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setDietPlan(result);
        onPlanGenerated(result);
        
        try {
          const userId = getOrCreateUserId();
          const planId = await saveDietPlan(userId, result);
          console.log('Saved diet plan with id', planId);
        } catch (e) {
          console.error('Failed to save diet plan:', e);
        }
        
        toast({
          title: "Diet Plan Generated!",
          description: "Your personalized diet plan is ready.",
        });
      }
    } catch (err) {
      const errorMsg = 'Failed to generate diet plan. Please try again.';
      setError(errorMsg);
      onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [userData, dietPlan, onPlanGenerated, onError, toast]);

  return {
    // State
    isLoading,
    error,
    dietPlan,
    // Actions
    generatePlan,
    setError,
    setIsLoading,
  };
}

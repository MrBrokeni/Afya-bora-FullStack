import { useState, useCallback, useEffect } from 'react';
import type { UserData, DietPlan, StepId } from '@/types/afya-bora';
import { STEPS } from '@/types/afya-bora';
import { getCurrentUser } from '@/lib/firebase';
import { getUserProfile } from '@/lib/firestore';
import { getGeneratedDietPlan } from '@/app/actions';
import type { GenerateDietPlanInput } from '@/types/afya-bora';
import { useIsMobile } from '@/hooks/use-mobile';

export interface AfyaBoraState {
  currentStepId: StepId;
  userData: UserData;
  dietPlan: DietPlan | null;
  globalErrorMessage: string | null;
  isLoadingDietPlan: boolean;
  isSidebarOpen: boolean;
  isBootstrapping: boolean;
}

export interface AfyaBoraActions {
  updateUserData: (data: Partial<UserData>) => void;
  navigateToStep: (stepId: StepId) => void;
  navigateToNextStep: () => void;
  navigateToPrevStep: () => void;
  setDietPlan: (plan: DietPlan | null) => void;
  setGlobalErrorMessage: (message: string | null) => void;
  setIsLoadingDietPlan: (loading: boolean) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function useAfyaBora(): AfyaBoraState & AfyaBoraActions {
  const [currentStepId, setCurrentStepId] = useState<StepId>(STEPS[0].id);
  const [userData, setUserData] = useState<UserData>({
    weightUnit: 'kg',
  });
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [globalErrorMessage, setGlobalErrorMessage] = useState<string | null>(null);
  const [isLoadingDietPlan, setIsLoadingDietPlan] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const isMobile = useIsMobile();

  useEffect(() => {
    // Load saved profile for authenticated user on first mount
    (async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          const saved = await getUserProfile(currentUser.uid);
          if (saved) {
            setUserData(prev => ({ ...prev, ...saved }));
            // If profile looks complete, auto-generate first, THEN navigate to diet plan
            const hasPrescription = typeof saved.prescriptionText === 'string' && saved.prescriptionText.trim().length >= 10;
            const hasAge = typeof saved.age === 'number' && saved.age > 0;
            const hasWeight = typeof saved.weight === 'number' && saved.weight > 0;
            const hasActivity = typeof saved.activityLevel === 'string' && saved.activityLevel.length > 0;
            if (hasPrescription && hasAge && hasWeight && hasActivity) {
              setIsLoadingDietPlan(true);
              try {
                const weightInKg = saved.weightUnit === 'lbs' ? (saved.weight as number) * 0.453592 : (saved.weight as number);
                const input: GenerateDietPlanInput = {
                  prescriptionText: saved.prescriptionText as string,
                  foodAllergies: saved.foodAllergies || 'none',
                  chronicConditions: saved.chronicConditions || 'none',
                  age: saved.age as number,
                  weightKg: weightInKg,
                  activityLevel: saved.activityLevel as any,
                };
                const result = await getGeneratedDietPlan(input);
                if ('error' in result) {
                  setGlobalErrorMessage(`Failed to generate diet plan: ${result.error}`);
                  setIsLoadingDietPlan(false);
                } else {
                  setDietPlan(result);
                  setIsLoadingDietPlan(false);
                  setCurrentStepId('diet_plan');
                }
              } catch (err) {
                console.error('Auto-generate failed', err);
                setGlobalErrorMessage('Failed to generate diet plan. Please try again.');
                setIsLoadingDietPlan(false);
              }
            }
          }
        }
      } catch (e) {
        console.error('Failed to bootstrap profile', e);
      } finally {
        setIsBootstrapping(false);
      }
    })();
    
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const updateUserData = useCallback((data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  }, []);

  const navigateToStep = useCallback((stepId: StepId) => {
    setGlobalErrorMessage(null);
    setCurrentStepId(stepId);
    if (isMobile) setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [isMobile]);

  const navigateToNextStep = useCallback(() => {
    const currentIndex = STEPS.findIndex(step => step.id === currentStepId);
    if (currentIndex < STEPS.length - 1) {
      navigateToStep(STEPS[currentIndex + 1].id);
    }
  }, [currentStepId, navigateToStep]);

  const navigateToPrevStep = useCallback(() => {
    const currentIndex = STEPS.findIndex(step => step.id === currentStepId);
    if (currentIndex > 0) {
      navigateToStep(STEPS[currentIndex - 1].id);
    }
  }, [currentStepId, navigateToStep]);

  return {
    // State
    currentStepId,
    userData,
    dietPlan,
    globalErrorMessage,
    isLoadingDietPlan,
    isSidebarOpen,
    isBootstrapping,
    // Actions
    updateUserData,
    navigateToStep,
    navigateToNextStep,
    navigateToPrevStep,
    setDietPlan,
    setGlobalErrorMessage,
    setIsLoadingDietPlan,
    setIsSidebarOpen,
  };
}

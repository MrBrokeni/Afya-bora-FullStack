"use client";

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Salad } from 'lucide-react';
import type { UserData, DietPlan } from '@/types/afya-bora';

// Custom hooks
import { useDietPlanGeneration } from '@/lib/hooks/use-diet-plan-generation';
import { useDietPlanSharing } from '@/lib/hooks/use-diet-plan-sharing';

// Components
import { DietPlanLoadingState } from '../components/DietPlanLoadingState';
import { DietPlanErrorState } from '../components/DietPlanErrorState';
import { DailyPlanAccordion } from '../components/DailyPlanAccordion';
import { DietPlanTips } from '../components/DietPlanTips';
import { DietPlanActions } from '../components/DietPlanActions';

interface Step3DietPlanRefactoredProps {
  userData: UserData;
  dietPlan: DietPlan | null;
  setDietPlan: (plan: DietPlan | null) => void;
  navigateToNextStep: () => void;
  navigateToPrevStep: () => void;
  setErrorMessage: (message: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const Step3DietPlanRefactored: React.FC<Step3DietPlanRefactoredProps> = ({
  userData,
  dietPlan,
  setDietPlan,
  navigateToNextStep,
  navigateToPrevStep,
  setErrorMessage,
  isLoading,
  setIsLoading,
}) => {
  // Custom hooks
  const dietPlanGeneration = useDietPlanGeneration(
    userData,
    (plan) => setDietPlan(plan),
    (error) => setErrorMessage(error)
  );

  const dietPlanSharing = useDietPlanSharing();

  // Auto-generate plan on mount if needed
  useEffect(() => {
    if (!dietPlan && !isLoading) {
      dietPlanGeneration.generatePlan();
    }
  }, [dietPlan, isLoading, dietPlanGeneration]);

  // Sync loading state
  useEffect(() => {
    setIsLoading(dietPlanGeneration.isLoading);
  }, [dietPlanGeneration.isLoading, setIsLoading]);

  // Sync error state
  useEffect(() => {
    setErrorMessage(dietPlanGeneration.error);
  }, [dietPlanGeneration.error, setErrorMessage]);

  const handleShare = () => {
    if (dietPlan) {
      dietPlanSharing.shareDietPlan(dietPlan);
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <Salad className="mr-2 h-7 w-7 text-primary" />
          Your Personalized Diet Plan
        </CardTitle>
        <CardDescription>
          Here is your 7-day meal plan. Remember to consult your doctor for any major dietary changes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DietPlanLoadingState isLoading={isLoading} />
        
        <DietPlanErrorState 
          error={dietPlanGeneration.error} 
          dietPlan={dietPlan} 
          isLoading={isLoading} 
        />

        {dietPlan && !isLoading && (
          <ScrollArea className="h-[calc(100vh-400px)] pr-4">
            <DailyPlanAccordion weeklyPlan={dietPlan.weeklyPlan} />
            <DietPlanTips dietPlan={dietPlan} />
          </ScrollArea>
        )}
      </CardContent>
      
      <DietPlanActions
        dietPlan={dietPlan}
        onShare={handleShare}
        onNavigatePrev={navigateToPrevStep}
        onNavigateNext={navigateToNextStep}
      />
    </Card>
  );
};

export default Step3DietPlanRefactored;

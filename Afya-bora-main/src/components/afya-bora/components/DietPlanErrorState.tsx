import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface DietPlanErrorStateProps {
  error: string | null;
  dietPlan: any;
  isLoading: boolean;
}

export function DietPlanErrorState({ error, dietPlan, isLoading }: DietPlanErrorStateProps) {
  if (isLoading || dietPlan) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Plan Generation Failed</AlertTitle>
      <AlertDescription>
        {error || (dietPlan === null 
          ? "Could not generate your diet plan. Please try again or check previous steps for errors." 
          : "An error occurred."
        )}
      </AlertDescription>
    </Alert>
  );
}

import React from 'react';
import { Loader2 } from 'lucide-react';

interface DietPlanLoadingStateProps {
  isLoading: boolean;
}

export function DietPlanLoadingState({ isLoading }: DietPlanLoadingStateProps) {
  if (!isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full max-w-3xl">
      <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
      <p className="text-xl font-semibold text-foreground">Generating your personalized diet plan...</p>
      <p className="text-muted-foreground">This might take a moment. Thank you for your patience.</p>
    </div>
  );
}

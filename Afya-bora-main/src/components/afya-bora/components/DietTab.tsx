import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Apple, ShoppingBag, AlertCircle } from 'lucide-react';
import type { UserData, DietPlan, StepId } from '@/types/afya-bora';
import { SummarySection } from './SummarySection';

interface DietTabProps {
  userData: UserData;
  dietPlan: DietPlan | null;
  navigateToStep: (stepId: StepId) => void;
}

export function DietTab({ userData, dietPlan, navigateToStep }: DietTabProps) {
  if (!dietPlan) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Diet Plan Available</AlertTitle>
        <AlertDescription>
          A diet plan has not been generated yet. Please complete the previous steps.
          <Button variant="link" className="block p-0 h-auto text-primary mt-1" onClick={() => navigateToStep('prescription_patient_data')}>
            Go to Patient Data
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <SummarySection title="Diet Plan" icon={Apple}>
        <p>Your 7-day personalized diet plan is available. Key highlights:</p>
        <ul className="list-disc list-inside ml-4 mt-1">
          <li>Focuses on: Local Tanzanian produce.</li>
          <li>Respects: Doctor's prescription and your inputs.</li>
          <li>Includes: Portion sizes and preparation tips.</li>
        </ul>
        <Button variant="link" className="p-0 h-auto text-primary" onClick={() => navigateToStep('diet_plan')}>
          View Full Diet Plan
        </Button>
      </SummarySection>
      <SummarySection title="Shopping List" icon={ShoppingBag}>
        <p>Key items for this week:</p>
        <ul className="list-disc list-inside ml-4 mt-1 max-h-20 overflow-y-auto">
          {dietPlan.shoppingList?.slice(0, 5).map(item => <li key={item.item}>{item.item}</li>)}
          {dietPlan.shoppingList?.length > 5 && <li>...and more</li>}
        </ul>
        <Button variant="link" className="p-0 h-auto text-primary" onClick={() => navigateToStep('marketplace')}>
          Go to Marketplace
        </Button>
      </SummarySection>
    </>
  );
}

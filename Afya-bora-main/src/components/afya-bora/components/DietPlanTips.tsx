import React from 'react';
import { Utensils } from 'lucide-react';
import type { DietPlan } from '@/types/afya-bora';

interface DietPlanTipsProps {
  dietPlan: DietPlan;
}

export function DietPlanTips({ dietPlan }: DietPlanTipsProps) {
  return (
    <>
      {dietPlan.generalTipsSw && dietPlan.generalTipsSw.length > 0 && (
        <div className="mt-6 p-4 bg-accent/10 rounded-lg">
          <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
            <Utensils className="mr-2 h-5 w-5" />General Tips (Swahili)
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
            {dietPlan.generalTipsSw.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </div>
      )}
      
      {dietPlan.substitutions && dietPlan.substitutions.length > 0 && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-semibold text-primary mb-2">Ingredient Substitutions</h3>
          <ul className="space-y-1 text-sm text-foreground">
            {dietPlan.substitutions.map((sub, i) => (
              <li key={i}>
                <strong>{sub.originalItemEn} ({sub.originalItemSw})</strong>: Try {sub.suggestionEn} ({sub.suggestionSw})
                {sub.reason && <span className="text-xs italic"> ({sub.reason})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

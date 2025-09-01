import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import type { DietPlan } from '@/types/afya-bora';

interface DietPlanActionsProps {
  dietPlan: DietPlan | null;
  onShare: () => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
}

export function DietPlanActions({ 
  dietPlan, 
  onShare, 
  onNavigatePrev, 
  onNavigateNext 
}: DietPlanActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
      <Button variant="outline" onClick={onNavigatePrev} className="w-full sm:w-auto text-base py-3">
        Back to Your Info
      </Button>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        {dietPlan && (
          <Button variant="outline" onClick={onShare} className="w-full sm:w-auto text-base py-3">
            <Share2 className="mr-2 h-5 w-5" /> Share Plan
          </Button>
        )}
        <Button onClick={onNavigateNext} disabled={!dietPlan} className="w-full sm:w-auto text-base py-3" size="lg">
          Go to Marketplace
        </Button>
      </div>
    </div>
  );
}

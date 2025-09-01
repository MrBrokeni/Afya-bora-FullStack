import React from 'react';
import { Button } from '@/components/ui/button';

interface SummaryActionsProps {
  onNavigatePrev: () => void;
}

export function SummaryActions({ onNavigatePrev }: SummaryActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-start gap-4 pt-6">
      <Button variant="outline" onClick={onNavigatePrev} className="w-full sm:w-auto text-base py-3">
        Back to Gyms & Workouts
      </Button>
    </div>
  );
}

import React from 'react';
import { Button } from '@/components/ui/button';

interface GymsWorkoutsActionsProps {
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
}

export function GymsWorkoutsActions({ onNavigatePrev, onNavigateNext }: GymsWorkoutsActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
      <Button variant="outline" onClick={onNavigatePrev} className="w-full sm:w-auto text-base py-3">
        Back to Marketplace
      </Button>
      <Button onClick={onNavigateNext} className="w-full sm:w-auto text-base py-3" size="lg">
        View Health Summary
      </Button>
    </div>
  );
}

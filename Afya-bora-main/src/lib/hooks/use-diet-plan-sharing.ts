import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { DietPlan } from '@/types/afya-bora';

export interface DietPlanSharingActions {
  shareDietPlan: (dietPlan: DietPlan) => Promise<void>;
}

export function useDietPlanSharing(): DietPlanSharingActions {
  const { toast } = useToast();

  const shareDietPlan = useCallback(async (dietPlan: DietPlan) => {
    const shareText = `My Afya Bora Diet Plan:\n\n${dietPlan.weeklyPlan.map(day => 
      `${day.day}:\n` +
      `  Morning: ${day.meals.morning.nameSw} (${day.meals.morning.nameEn})\n` +
      `  Lunch: ${day.meals.lunch.nameSw} (${day.meals.lunch.nameEn})\n` +
      `  Dinner: ${day.meals.dinner.nameSw} (${day.meals.dinner.nameEn})\n`
    ).join('\n')}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Afya Bora Diet Plan',
          text: shareText,
        });
        toast({ title: "Plan Shared", description: "Diet plan shared successfully." });
      } catch (error) {
        console.error('Error sharing:', error);
        toast({ title: "Sharing Failed", description: "Could not share the plan.", variant: "destructive" });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText)
        .then(() => toast({ title: "Plan Copied", description: "Diet plan copied to clipboard." }))
        .catch(() => toast({ title: "Copy Failed", description: "Could not copy plan to clipboard.", variant: "destructive" }));
    }
  }, [toast]);

  return {
    shareDietPlan,
  };
}

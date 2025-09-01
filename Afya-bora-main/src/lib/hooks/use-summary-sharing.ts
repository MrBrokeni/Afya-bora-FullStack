import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { UserData, DietPlan } from '@/types/afya-bora';

export interface SummarySharingActions {
  shareReport: (userData: UserData, dietPlan: DietPlan | null) => Promise<void>;
}

export function useSummarySharing(): SummarySharingActions {
  const { toast } = useToast();

  const shareReport = useCallback(async (userData: UserData, dietPlan: DietPlan | null) => {
    let reportText = `Afya Bora Health Summary:\n\n`;
    reportText += `== Personal Profile ==\n`;
    reportText += `Age: ${userData.age || 'N/A'} years\n`;
    reportText += `Weight: ${userData.weight || 'N/A'} ${userData.weightUnit || ''}\n`;
    reportText += `Allergies: ${userData.foodAllergies || 'None'}\n`;
    reportText += `Conditions: ${userData.chronicConditions || 'None'}\n\n`;

    if (dietPlan) {
      reportText += `== Diet Plan Summary ==\n`;
      reportText += `(Full 7-day plan details available in app)\n`;
      reportText += `Shopping List Items: ${dietPlan.shoppingList?.map(i => i.item).join(', ') || 'N/A'}\n\n`;
    } else {
      reportText += `== Diet Plan Summary ==\nNo diet plan generated.\n\n`;
    }

    // Placeholder for PDF export. For now, share text.
    toast({ title: "Share Report", description: "PDF export is a premium feature (simulated). Sharing text summary instead."});

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Afya Bora Health Report', text: reportText });
      } catch (error) {
        toast({ title: "Sharing Failed", variant: "destructive" });
      }
    } else {
      navigator.clipboard.writeText(reportText)
        .then(() => toast({ title: "Report Copied", description: "Health report summary copied to clipboard." }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  }, [toast]);

  return {
    shareReport,
  };
}

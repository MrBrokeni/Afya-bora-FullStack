import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ShoppingListSharingActions {
  shareShoppingList: (shoppingListItems: string[]) => Promise<void>;
}

export function useShoppingListSharing(): ShoppingListSharingActions {
  const { toast } = useToast();

  const shareShoppingList = useCallback(async (shoppingListItems: string[]) => {
    if (!shoppingListItems.length) {
      toast({ title: "Empty List", description: "Your shopping list is empty.", variant: "destructive" });
      return;
    }
    
    const listText = "My Afya Bora Shopping List:\n\n- " + shoppingListItems.join("\n- ");
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Afya Bora Shopping List',
          text: listText,
        });
        toast({ title: "List Shared", description: "Shopping list shared successfully." });
      } catch (error) {
        toast({ title: "Sharing Failed", description: "Could not share the list.", variant: "destructive" });
      }
    } else {
      navigator.clipboard.writeText(listText)
        .then(() => toast({ title: "List Copied", description: "Shopping list copied to clipboard." }))
        .catch(() => toast({ title: "Copy Failed", description: "Could not copy list.", variant: "destructive" }));
    }
  }, [toast]);

  return {
    shareShoppingList,
  };
}

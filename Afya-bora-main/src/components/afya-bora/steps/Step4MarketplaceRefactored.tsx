"use client";

import React, { useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ShoppingCart } from 'lucide-react';
import type { UserData, DietPlan } from '@/types/afya-bora';

// Custom hooks
import { useMarketplace } from '@/lib/hooks/use-marketplace';
import { useShoppingListSharing } from '@/lib/hooks/use-shopping-list-sharing';

// Components
import { MarketplaceSearch } from '../components/MarketplaceSearch';
import { ShoppingListItem } from '../components/ShoppingListItem';
import { MarketplaceNoPlan } from '../components/MarketplaceNoPlan';
import { MarketplaceActions } from '../components/MarketplaceActions';

interface Step4MarketplaceRefactoredProps {
  userData: UserData;
  dietPlan: DietPlan | null;
  navigateToNextStep: () => void;
  navigateToPrevStep: () => void;
}

const Step4MarketplaceRefactored: React.FC<Step4MarketplaceRefactoredProps> = ({
  dietPlan,
  navigateToNextStep,
  navigateToPrevStep,
}) => {
  // Custom hooks
  const marketplace = useMarketplace();
  const shoppingListSharing = useShoppingListSharing();

  // Get shopping list items
  const shoppingListItems = useMemo(() => {
    return marketplace.getShoppingListItems(dietPlan);
  }, [dietPlan, marketplace]);

  // Get filtered vendors
  const filteredVendors = useMemo(() => {
    return marketplace.getFilteredVendors(
      marketplace.searchTerm,
      marketplace.locationRadius,
      marketplace.priceRange,
      marketplace.availability
    );
  }, [marketplace]);

  // Handle shopping list sharing
  const handleShareShoppingList = () => {
    shoppingListSharing.shareShoppingList(shoppingListItems);
  };

  // Handle order placement
  const handleOrder = (vendor: any) => {
    marketplace.placeOrder(vendor);
  };

  // Early return if no diet plan
  if (!dietPlan) {
    return <MarketplaceNoPlan onNavigatePrev={navigateToPrevStep} />;
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <ShoppingCart className="mr-2 h-7 w-7 text-primary" />
          Local Marketplace
        </CardTitle>
        <CardDescription>
          Find ingredients for your diet plan from nearby vendors.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <MarketplaceSearch
          searchTerm={marketplace.searchTerm}
          onSearchChange={marketplace.setSearchTerm}
          onShareShoppingList={handleShareShoppingList}
        />
        
        <ScrollArea className="h-[calc(100vh-450px)]">
          {shoppingListItems.length > 0 ? (
            <div className="space-y-4">
              {shoppingListItems.map(item => {
                const vendorsForItem = filteredVendors.filter(v => 
                  v.productName.toLowerCase().includes(item.toLowerCase()) || 
                  v.item_id === item.toLowerCase().replace(/\s+/g, '_')
                );
                
                return (
                  <ShoppingListItem
                    key={item}
                    item={item}
                    vendors={vendorsForItem}
                    onOrder={handleOrder}
                    isOrdering={marketplace.orderingItemId !== null}
                  />
                );
              })}
            </div>
          ) : (
            <Alert>
              <ShoppingCart className="h-4 w-4" />
              <AlertTitle>Shopping List Empty</AlertTitle>
              <AlertDescription>Your diet plan's shopping list is currently empty or not available.</AlertDescription>
            </Alert>
          )}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </CardContent>
      
      <MarketplaceActions
        onNavigatePrev={navigateToPrevStep}
        onNavigateNext={navigateToNextStep}
      />
    </Card>
  );
};

export default Step4MarketplaceRefactored;

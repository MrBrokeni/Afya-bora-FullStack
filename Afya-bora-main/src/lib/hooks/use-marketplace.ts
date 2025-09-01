import { useState, useMemo, useCallback } from 'react';
import { placeOrderAction } from '@/app/actions';
import { logOrder } from '@/lib/firestore';
import { getOrCreateUserId, ensureAnonymousAuth } from '@/lib/user';
import { useToast } from '@/hooks/use-toast';
import type { Vendor, DietPlan } from '@/types/afya-bora';

// Mock Data
const mockVendors: Vendor[] = [
  { id: 'v1', name: 'Mama Ntilie Fresh', productName: 'Organic Sukuma Wiki Bundle', priceRange: '1,000 - 1,500 TZS', deliveryEstimate: 'Within 2 hours', imageUrl: 'https://placehold.co/300x200.png', item_id: 'sukuma_wiki', dataAiHint: 'kale greens' },
  { id: 'v2', name: 'Kariakoo Online Mart', productName: 'Brown Rice 1kg', priceRange: '4,000 - 5,000 TZS', deliveryEstimate: 'Next day', imageUrl: 'https://placehold.co/300x200.png', item_id: 'brown_rice', dataAiHint: 'rice grain' },
  { id: 'v3', name: 'Fresh Farm Deliveries', productName: 'Sweet Potatoes (Vitamu) 1kg', priceRange: '2,500 - 3,000 TZS', deliveryEstimate: 'Within 24 hours', imageUrl: 'https://placehold.co/300x200.png', item_id: 'sweet_potatoes', dataAiHint: 'sweet potato' },
  { id: 'v4', name: 'City Center Groceries', productName: 'Chicken Breast (Skinless) 500g', priceRange: '8,000 - 9,500 TZS', deliveryEstimate: 'Same day', imageUrl: 'https://placehold.co/300x200.png', item_id: 'chicken_breast', dataAiHint: 'chicken meat' },
  { id: 'v5', name: 'Soko Mjinga Veggies', productName: 'Mchicha (Amaranth Greens) Bundle', priceRange: '800 - 1,200 TZS', deliveryEstimate: 'Within 3 hours', imageUrl: 'https://placehold.co/300x200.png', item_id: 'mchicha', dataAiHint: 'spinach amaranth' },
  { id: 'v6', name: 'Jumia Fresh', productName: 'Organic Sukuma Wiki Bundle', priceRange: '1,200 - 1,800 TZS', deliveryEstimate: 'Next day', imageUrl: 'https://placehold.co/300x200.png', item_id: 'sukuma_wiki', dataAiHint: 'kale bunch' },
];

export interface MarketplaceState {
  searchTerm: string;
  locationRadius: string;
  priceRange: string;
  availability: string;
  orderingItemId: string | null;
  vendors: Vendor[];
}

export interface MarketplaceActions {
  setSearchTerm: (term: string) => void;
  setLocationRadius: (radius: string) => void;
  setPriceRange: (range: string) => void;
  setAvailability: (availability: string) => void;
  placeOrder: (vendor: Vendor) => Promise<void>;
  getShoppingListItems: (dietPlan: DietPlan | null) => string[];
  getFilteredVendors: (searchTerm: string, locationRadius: string, priceRange: string, availability: string) => Vendor[];
}

export function useMarketplace(): MarketplaceState & MarketplaceActions {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationRadius, setLocationRadius] = useState('10');
  const [priceRange, setPriceRange] = useState('');
  const [availability, setAvailability] = useState('all');
  const [orderingItemId, setOrderingItemId] = useState<string | null>(null);
  const { toast } = useToast();

  const vendors = useMemo(() => mockVendors, []);

  const getShoppingListItems = useCallback((dietPlan: DietPlan | null): string[] => {
    if (!dietPlan || !dietPlan.shoppingList) return [];
    return dietPlan.shoppingList.map(item => item.item);
  }, []);

  const getFilteredVendors = useCallback((
    searchTerm: string, 
    locationRadius: string, 
    priceRange: string, 
    availability: string
  ): Vendor[] => {
    return vendors.filter(vendor => {
      const matchesSearch = vendor.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
      // Mock filtering logic - in real app, this would be more complex
      const matchesRadius = true; // Assume all vendors are within selected radius for mock
      const matchesPrice = true; // Assume all vendors match price for mock
      const matchesAvailability = true; // Assume all items available for mock
      
      return matchesSearch && matchesRadius && matchesPrice && matchesAvailability;
    });
  }, [vendors]);

  const placeOrder = useCallback(async (vendor: Vendor) => {
    setOrderingItemId(vendor.id);
    try {
      const response = await placeOrderAction(vendor.id, vendor.item_id, 1);
      if (response.success) {
        try {
          const userId = getOrCreateUserId();
          await logOrder(userId, { 
            vendorId: vendor.id, 
            itemId: vendor.item_id, 
            quantity: 1, 
            orderId: response.orderId, 
            message: response.message 
          });
        } catch (e) {
          console.error('Failed to log order:', e);
        }
        toast({
          title: "Order Placed (Simulated)",
          description: response.message,
        });
      } else {
        toast({
          title: "Order Failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Order Error",
        description: "An unexpected error occurred while placing the order.",
        variant: "destructive",
      });
    } finally {
      setOrderingItemId(null);
    }
  }, [toast]);

  return {
    // State
    searchTerm,
    locationRadius,
    priceRange,
    availability,
    orderingItemId,
    vendors,
    // Actions
    setSearchTerm,
    setLocationRadius,
    setPriceRange,
    setAvailability,
    placeOrder,
    getShoppingListItems,
    getFilteredVendors,
  };
}

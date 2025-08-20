"use client";

import type React from 'react';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ShoppingCart, Search, Filter, AlertCircle, ExternalLink, Share2, PackageCheck } from 'lucide-react';
import type { UserData, DietPlan, Vendor } from '@/types/afya-bora';
import { placeOrderAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateUserId, ensureAnonymousAuth } from '@/lib/user';
import { logOrder } from '@/lib/firestore';

// Mock Data
const mockVendors: Vendor[] = [
  { id: 'v1', name: 'Mama Ntilie Fresh', productName: 'Organic Sukuma Wiki Bundle', priceRange: '1,000 - 1,500 TZS', deliveryEstimate: 'Within 2 hours', imageUrl: 'https://placehold.co/300x200.png', item_id: 'sukuma_wiki', dataAiHint: 'kale greens' },
  { id: 'v2', name: 'Kariakoo Online Mart', productName: 'Brown Rice 1kg', priceRange: '4,000 - 5,000 TZS', deliveryEstimate: 'Next day', imageUrl: 'https://placehold.co/300x200.png', item_id: 'brown_rice', dataAiHint: 'rice grain' },
  { id: 'v3', name: 'Fresh Farm Deliveries', productName: 'Sweet Potatoes (Vitamu) 1kg', priceRange: '2,500 - 3,000 TZS', deliveryEstimate: 'Within 24 hours', imageUrl: 'https://placehold.co/300x200.png', item_id: 'sweet_potatoes', dataAiHint: 'sweet potato' },
  { id: 'v4', name: 'City Center Groceries', productName: 'Chicken Breast (Skinless) 500g', priceRange: '8,000 - 9,500 TZS', deliveryEstimate: 'Same day', imageUrl: 'https://placehold.co/300x200.png', item_id: 'chicken_breast', dataAiHint: 'chicken meat' },
  { id: 'v5', name: 'Soko Mjinga Veggies', productName: 'Mchicha (Amaranth Greens) Bundle', priceRange: '800 - 1,200 TZS', deliveryEstimate: 'Within 3 hours', imageUrl: 'https://placehold.co/300x200.png', item_id: 'mchicha', dataAiHint: 'spinach amaranth' },
  { id: 'v6', name: 'Jumia Fresh', productName: 'Organic Sukuma Wiki Bundle', priceRange: '1,200 - 1,800 TZS', deliveryEstimate: 'Next day', imageUrl: 'https://placehold.co/300x200.png', item_id: 'sukuma_wiki', dataAiHint: 'kale bunch' },
];

const nationalPlatforms = [
  { name: "Jumia Tanzania", url: "https://www.jumia.co.tz/" },
  { name: "Kilimall Tanzania", url: "https://www.kilimall.co.tz/" }
];

interface Step4MarketplaceProps {
  userData: UserData;
  dietPlan: DietPlan | null;
  navigateToNextStep: () => void;
  navigateToPrevStep: () => void;
}

const Step4Marketplace: React.FC<Step4MarketplaceProps> = ({
  dietPlan,
  navigateToNextStep,
  navigateToPrevStep,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationRadius, setLocationRadius] = useState('10'); // km
  const [priceRange, setPriceRange] = useState(''); // e.g. '0-5000'
  const [availability, setAvailability] = useState('all');
  const [orderingItemId, setOrderingItemId] = useState<string | null>(null);
  const { toast } = useToast();
  const userId = getOrCreateUserId();

  useEffect(() => {
    ensureAnonymousAuth().catch(err => console.error('Anonymous auth failed', err));
  }, []);

  const shoppingListItems = useMemo(() => {
    if (!dietPlan || !dietPlan.shoppingList) return [];
    return dietPlan.shoppingList.map(item => item.item); // Assuming shoppingList is {item: string, ...}[]
  }, [dietPlan]);


  const filteredVendors = useMemo(() => {
    return mockVendors.filter(vendor => {
      const matchesSearch = vendor.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
      // Mock filtering logic - in real app, this would be more complex
      const matchesRadius = true; // Assume all vendors are within selected radius for mock
      const matchesPrice = true; // Assume all vendors match price for mock
      const matchesAvailability = true; // Assume all items available for mock
      
      return matchesSearch && matchesRadius && matchesPrice && matchesAvailability;
    });
  }, [searchTerm, locationRadius, priceRange, availability]);

  const handleOrderNow = async (vendor: Vendor) => {
    setOrderingItemId(vendor.id);
    try {
      const response = await placeOrderAction(vendor.id, vendor.item_id, 1); // Assuming quantity 1
      if (response.success) {
        try {
          await logOrder(userId, { vendorId: vendor.id, itemId: vendor.item_id, quantity: 1, orderId: response.orderId, message: response.message });
        } catch (e) {
          console.error('Failed to log order:', e);
        }
        toast({
          title: "Order Placed (Simulated)",
          description: response.message,
          action: <PackageCheck className="text-green-500" />,
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
  };
  
  const handleShareShoppingList = async () => {
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
  };

  if (!dietPlan) {
    return (
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-headline">
            <ShoppingCart className="mr-2 h-6 w-6 text-primary" />
            Marketplace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Diet Plan</AlertTitle>
            <AlertDescription>Please generate a diet plan first to see ingredient marketplace.</AlertDescription>
          </Alert>
           <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={navigateToPrevStep} className="text-base py-3">Back</Button>
          </div>
        </CardContent>
      </Card>
    );
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-1">
          <Input
            type="text"
            placeholder="Search ingredients or vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-2 text-sm"
          />
          <Button onClick={handleShareShoppingList} variant="outline" className="w-full text-sm">
            <Share2 className="mr-2 h-4 w-4" /> Share Shopping List
          </Button>
        </div>
        {/* Filters can be added here later if needed: Location Radius, Price Range, Availability */}
        
        <ScrollArea className="h-[calc(100vh-450px)]"> {/* Adjust height */}
          {shoppingListItems.length > 0 ? (
            <div className="space-y-4">
              {shoppingListItems.map(item => {
                const vendorsForItem = filteredVendors.filter(v => v.productName.toLowerCase().includes(item.toLowerCase()) || v.item_id === item.toLowerCase().replace(/\s+/g, '_'));
                return (
                  <div key={item}>
                    <h3 className="text-lg font-semibold text-foreground mb-2 capitalize">{item}</h3>
                    {vendorsForItem.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vendorsForItem.map(vendor => (
                          <Card key={vendor.id} className="overflow-hidden flex flex-col">
                            <div className="relative w-full h-40">
                              <Image 
                                src={vendor.imageUrl || "https://placehold.co/300x200.png"} 
                                alt={vendor.productName} 
                                layout="fill" 
                                objectFit="cover"
                                data-ai-hint={vendor.dataAiHint || "food product"}
                                className="bg-muted"
                              />
                            </div>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-md">{vendor.productName}</CardTitle>
                              <CardDescription className="text-xs">{vendor.name}</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm space-y-1 flex-grow">
                              <p>Price: <span className="font-semibold">{vendor.priceRange}</span></p>
                              <p>Delivery: {vendor.deliveryEstimate}</p>
                            </CardContent>
                            <CardFooter>
                              <Button 
                                onClick={() => handleOrderNow(vendor)} 
                                className="w-full text-sm"
                                disabled={orderingItemId === vendor.id}
                              >
                                {orderingItemId === vendor.id ? "Ordering..." : "Order Now"}
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                       <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No local vendors found for {item}.</AlertTitle>
                        <AlertDescription>
                          You can try searching on national platforms:
                          <ul className="mt-1">
                          {nationalPlatforms.map(p => (
                            <li key={p.name}>
                              <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center text-xs">
                                {p.name} <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </li>
                          ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
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
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
        <Button variant="outline" onClick={navigateToPrevStep} className="w-full sm:w-auto text-base py-3">
          Back to Diet Plan
        </Button>
        <Button onClick={navigateToNextStep} className="w-full sm:w-auto text-base py-3" size="lg">
          Find Gyms & Workouts
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Step4Marketplace;

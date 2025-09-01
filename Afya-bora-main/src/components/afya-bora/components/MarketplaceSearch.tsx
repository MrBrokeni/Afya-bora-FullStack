import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

interface MarketplaceSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onShareShoppingList: () => void;
}

export function MarketplaceSearch({ 
  searchTerm, 
  onSearchChange, 
  onShareShoppingList 
}: MarketplaceSearchProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-1">
      <Input
        type="text"
        placeholder="Search ingredients or vendors..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="md:col-span-2 text-sm"
      />
      <Button onClick={onShareShoppingList} variant="outline" className="w-full text-sm">
        <Share2 className="mr-2 h-4 w-4" /> Share Shopping List
      </Button>
    </div>
  );
}

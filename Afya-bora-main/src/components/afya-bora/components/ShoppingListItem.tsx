import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ExternalLink } from 'lucide-react';
import type { Vendor } from '@/types/afya-bora';
import { VendorCard } from './VendorCard';

const nationalPlatforms = [
  { name: "Jumia Tanzania", url: "https://www.jumia.co.tz/" },
  { name: "Kilimall Tanzania", url: "https://www.kilimall.co.tz/" }
];

interface ShoppingListItemProps {
  item: string;
  vendors: Vendor[];
  onOrder: (vendor: Vendor) => void;
  isOrdering: boolean;
}

export function ShoppingListItem({ item, vendors, onOrder, isOrdering }: ShoppingListItemProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-2 capitalize">{item}</h3>
      {vendors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map(vendor => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onOrder={onOrder}
              isOrdering={isOrdering && vendor.id === vendor.id}
            />
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
}

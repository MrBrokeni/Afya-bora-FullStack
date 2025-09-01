import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Vendor } from '@/types/afya-bora';

interface VendorCardProps {
  vendor: Vendor;
  onOrder: (vendor: Vendor) => void;
  isOrdering: boolean;
}

export function VendorCard({ vendor, onOrder, isOrdering }: VendorCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col">
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
          onClick={() => onOrder(vendor)} 
          className="w-full text-sm"
          disabled={isOrdering}
        >
          {isOrdering ? "Ordering..." : "Order Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}

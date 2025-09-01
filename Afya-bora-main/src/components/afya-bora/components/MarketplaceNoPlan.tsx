import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ShoppingCart, AlertCircle } from 'lucide-react';

interface MarketplaceNoPlanProps {
  onNavigatePrev: () => void;
}

export function MarketplaceNoPlan({ onNavigatePrev }: MarketplaceNoPlanProps) {
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
          <Button variant="outline" onClick={onNavigatePrev} className="text-base py-3">Back</Button>
        </div>
      </CardContent>
    </Card>
  );
}

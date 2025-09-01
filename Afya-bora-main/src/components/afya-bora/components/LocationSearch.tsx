import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface LocationSearchProps {
  locationPermission: 'prompt' | 'granted' | 'denied';
  manualLocation: string;
  onRequestLocation: () => void;
  onManualLocationChange: (location: string) => void;
  onManualLocationSearch: () => void;
}

export function LocationSearch({
  locationPermission,
  manualLocation,
  onRequestLocation,
  onManualLocationChange,
  onManualLocationSearch,
}: LocationSearchProps) {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center">
        <Search className="mr-2 h-5 w-5 text-accent" />Find Nearby Gyms
      </h3>
      {locationPermission === 'prompt' && (
        <Button onClick={onRequestLocation} className="text-sm">
          Use My Current Location
        </Button>
      )}
      {locationPermission === 'denied' && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Location access denied or unavailable. Enter your city:</p>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="e.g., Dar es Salaam"
              value={manualLocation}
              onChange={(e) => onManualLocationChange(e.target.value)}
              className="w-full sm:w-auto text-sm"
            />
            <Button onClick={onManualLocationSearch} className="text-sm">
              <Search className="mr-1 h-4 w-4"/> Search
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

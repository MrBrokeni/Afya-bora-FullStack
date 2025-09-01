import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin } from 'lucide-react';
import type { Gym } from '@/types/afya-bora';

interface GymCardProps {
  gym: Gym;
}

export function GymCard({ gym }: GymCardProps) {
  return (
    <Card className="min-w-[300px] max-w-[350px] overflow-hidden shadow-md">
      <div className="relative w-full h-40">
        <Image 
          src={gym.imageUrl || "https://placehold.co/400x250.png"} 
          alt={gym.name} 
          layout="fill" 
          objectFit="cover" 
          data-ai-hint={gym.dataAiHint || "gym facility"} 
          className="bg-muted"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">{gym.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-1">
        <p><MapPin className="inline h-3 w-3 mr-1 text-muted-foreground"/>{gym.address} ({gym.distance})</p>
        <p>Contact: {gym.contact}</p>
        <p>Pricing: {gym.pricing}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild className="w-full text-xs">
          <a href={gym.mapLink} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-1 h-3 w-3"/> Get Directions
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

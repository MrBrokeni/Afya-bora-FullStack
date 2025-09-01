import React from 'react';

interface SummarySectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

export function SummarySection({ title, icon: Icon, children }: SummarySectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
        <Icon className="mr-2 h-5 w-5" /> {title}
      </h3>
      <div className="text-sm text-foreground bg-muted/30 p-3 rounded-md space-y-1">
        {children}
      </div>
    </div>
  );
}

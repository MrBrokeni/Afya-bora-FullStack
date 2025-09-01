import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart3, Info } from 'lucide-react';
import { BarChart, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, Bar, Line } from 'recharts';
import type { ChartData } from '@/lib/hooks/use-summary-charts';
import { SummarySection } from './SummarySection';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface StatisticsTabProps {
  chartData: ChartData;
}

export function StatisticsTab({ chartData }: StatisticsTabProps) {
  return (
    <SummarySection title="Health Statistics" icon={BarChart3}>
      <p className="mb-2 text-muted-foreground">Track your health trends. (Note: Charts use sample data for now. Feature to input data coming soon!)</p>
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-semibold mb-1">Weekly Weight Trend (kg)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData.weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={10}/>
              <YAxis fontSize={10} domain={['dataMin - 2', 'dataMax + 2']}/>
              <ChartTooltip contentStyle={{fontSize: '10px', padding: '2px 5px'}}/>
              <Legend wrapperStyle={{fontSize: '10px'}}/>
              <Line type="monotone" dataKey="weight" stroke={COLORS[0]} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-1">Blood Sugar Readings (mg/dL)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.bloodSugarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={10}/>
              <YAxis fontSize={10}/>
              <ChartTooltip contentStyle={{fontSize: '10px', padding: '2px 5px'}}/>
              <Legend wrapperStyle={{fontSize: '10px'}}/>
              <Bar dataKey="fbs" fill={COLORS[1]} name="Fasting" />
              <Bar dataKey="ppbs" fill={COLORS[2]} name="Postprandial" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-1">Blood Pressure Trend (mmHg)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData.bloodPressureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={10}/>
              <YAxis fontSize={10} domain={['dataMin - 10', 'dataMax + 10']}/>
              <ChartTooltip contentStyle={{fontSize: '10px', padding: '2px 5px'}}/>
              <Legend wrapperStyle={{fontSize: '10px'}}/>
              <Line type="monotone" dataKey="systolic" stroke={COLORS[3]} name="Systolic" />
              <Line type="monotone" dataKey="diastolic" stroke={COLORS[0]} name="Diastolic" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Alert variant="default" className="mt-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Health Tracking Active</AlertTitle>
        <AlertDescription>Charts now display your actual health data. Update your measurements weekly in the "Update My Info" section to track your progress.</AlertDescription>
      </Alert>
    </SummarySection>
  );
}

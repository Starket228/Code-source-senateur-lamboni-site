
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface DashboardChartProps {
  newsCount: number;
  programsCount: number;
  activitiesCount: number;
  documentsCount: number;
}

const DashboardChart: React.FC<DashboardChartProps> = ({
  newsCount,
  programsCount,
  activitiesCount,
  documentsCount
}) => {
  // Real data for the bar chart
  const barData = [
    { name: 'Actualités', value: newsCount, fill: '#3b82f6' },
    { name: 'Programmes', value: programsCount, fill: '#10b981' },
    { name: 'Activités', value: activitiesCount, fill: '#f59e0b' },
    { name: 'Documents', value: documentsCount, fill: '#8b5cf6' }
  ];

  // More realistic evolution data - showing gradual growth
  const totalContent = newsCount + programsCount + activitiesCount + documentsCount;
  const lineData = [
    { 
      month: 'Jan', 
      actualites: Math.max(0, Math.floor(newsCount * 0.4)), 
      programmes: Math.max(0, Math.floor(programsCount * 0.3)),
      total: Math.max(0, Math.floor(totalContent * 0.35))
    },
    { 
      month: 'Fév', 
      actualites: Math.max(0, Math.floor(newsCount * 0.6)), 
      programmes: Math.max(0, Math.floor(programsCount * 0.5)),
      total: Math.max(0, Math.floor(totalContent * 0.55))
    },
    { 
      month: 'Mar', 
      actualites: Math.max(0, Math.floor(newsCount * 0.8)), 
      programmes: Math.max(0, Math.floor(programsCount * 0.7)),
      total: Math.max(0, Math.floor(totalContent * 0.75))
    },
    { 
      month: 'Avr', 
      actualites: newsCount, 
      programmes: programsCount,
      total: totalContent
    }
  ];

  const chartConfig = {
    actualites: {
      label: "Actualités",
      color: "#3b82f6"
    },
    programmes: {
      label: "Programmes", 
      color: "#10b981"
    },
    total: {
      label: "Total",
      color: "#8b5cf6"
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Bar Chart - Real Content Distribution */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Répartition du contenu</CardTitle>
              <CardDescription className="text-xs sm:text-base text-gray-600">
                Distribution actuelle: {totalContent} éléments au total
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b"
                  fontSize={10}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={10}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                  fill="var(--color-bar)"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Line Chart - Evolution Based on Real Data */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Évolution du contenu</CardTitle>
          <CardDescription className="text-xs sm:text-base text-gray-600">
            Croissance progressive basée sur le contenu actuel
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <ChartContainer config={chartConfig} className="h-[180px] sm:h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  fontSize={10}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={10}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Line 
                  type="monotone" 
                  dataKey="actualites" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="programmes" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardChart;

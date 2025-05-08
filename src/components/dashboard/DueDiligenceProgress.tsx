import React from 'react';

export type Trend = 'up' | 'down' | 'stable';

interface DueDiligenceCategory {
  category: string;
  completed: number;
  total: number;
  trend: Trend;
}

interface DueDiligenceProgressProps {
  title: string;
  categories: DueDiligenceCategory[];
}

export const DueDiligenceProgress: React.FC<DueDiligenceProgressProps> = ({ title, categories }) => {
  const getTrendIcon = (trend: Trend) => {
    switch (trend) {
      case 'up':
        return (
          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        );
      case 'down':
        return (
          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        );
      case 'stable':
        return (
          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        );
    }
  };
  
  const calculateTotalProgress = () => {
    const totalCompleted = categories.reduce((sum, category) => sum + category.completed, 0);
    const total = categories.reduce((sum, category) => sum + category.total, 0);
    return Math.round((totalCompleted / total) * 100);
  };

  // Get color for the overall progress
  const getOverallProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const overallProgress = calculateTotalProgress();
  const overallProgressColor = getOverallProgressColor(overallProgress);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <div className="text-base font-medium flex items-center">
          <span className="mr-2">Overall:</span>
          <span className={`${overallProgressColor} font-bold`}>{overallProgress}%</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {categories.map((category, index) => {
          const progress = Math.round((category.completed / category.total) * 100);
          
          let progressColor = '';
          if (progress > 75) progressColor = 'bg-green-500';
          else if (progress > 50) progressColor = 'bg-blue-500';
          else if (progress > 25) progressColor = 'bg-yellow-500';
          else progressColor = 'bg-red-500';
          
          let trendColor = '';
          if (category.trend === 'up') trendColor = 'text-green-500';
          else if (category.trend === 'down') trendColor = 'text-red-500';
          else trendColor = 'text-gray-500';
          
          return (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">{category.category}</span>
                  <span className={`ml-2 flex items-center text-xs ${trendColor}`}>
                    {getTrendIcon(category.trend)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">
                    {category.completed}/{category.total}
                  </span>
                  <span className={`ml-2 text-sm font-medium ${progress > 75 ? 'text-green-600' : (progress > 50 ? 'text-blue-600' : (progress > 25 ? 'text-yellow-600' : 'text-red-600'))}`}>
                    {progress}%
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${progressColor}`} 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 
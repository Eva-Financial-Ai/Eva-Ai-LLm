import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon?: string;
  color?: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    value: string;
    text: string;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  trend,
}) => {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        iconBg: 'bg-blue-100',
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        iconBg: 'bg-green-100',
      },
      red: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        iconBg: 'bg-red-100',
      },
      yellow: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        iconBg: 'bg-yellow-100',
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        iconBg: 'bg-purple-100',
      },
      indigo: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        iconBg: 'bg-indigo-100',
      },
      rose: {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        iconBg: 'bg-rose-100',
      },
      amber: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        iconBg: 'bg-amber-100',
      },
      gray: {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        iconBg: 'bg-gray-100',
      },
    };

    return colorMap[color] || colorMap.blue;
  };

  const colorClasses = getColorClasses(color);

  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return (
          <svg
            className="h-4 w-4 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        );
      case 'down':
        return (
          <svg
            className="h-4 w-4 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        );
      case 'stable':
        return (
          <svg
            className="h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        );
    }
  };

  return (
    <div className={`rounded-lg shadow p-6 ${colorClasses.bg}`}>
      <div className="flex items-center">
        {icon && (
          <div className={`p-3 rounded-md ${colorClasses.iconBg} ${colorClasses.text}`}>
            <img src={icon} alt={title} className="h-6 w-6" />
          </div>
        )}
        <div className={`ml-${icon ? '4' : '0'}`}>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className={`text-2xl font-semibold ${colorClasses.text}`}>{value}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>

          {trend && (
            <div className="mt-2 flex items-center text-xs">
              {getTrendIcon(trend.direction)}
              <span
                className={`ml-1 ${
                  trend.direction === 'up'
                    ? 'text-green-500'
                    : trend.direction === 'down'
                      ? 'text-red-500'
                      : 'text-gray-500'
                }`}
              >
                {trend.value} {trend.text}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

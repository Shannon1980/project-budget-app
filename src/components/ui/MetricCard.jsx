import React from 'react';

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendDirection, 
  color = 'blue',
  darkMode 
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <div className="flex items-center mt-1">
              <span className={`text-sm ${
                trendDirection === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {trendDirection === 'up' ? '↗' : '↘'} {trend}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;

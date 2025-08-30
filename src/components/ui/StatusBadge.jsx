import React from 'react';

const StatusBadge = ({ 
  status, 
  variant = 'default',
  darkMode 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    inactive: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${variants[variant]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;

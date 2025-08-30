import React from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const NotificationSystem = ({ notifications }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${
            notification.type === 'success' ? 'border-l-4 border-green-400' :
            notification.type === 'error' ? 'border-l-4 border-red-400' :
            'border-l-4 border-yellow-400'
          }`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' && <CheckCircle className="h-6 w-6 text-green-400" />}
                {notification.type === 'error' && <XCircle className="h-6 w-6 text-red-400" />}
                {notification.type === 'warning' && <AlertCircle className="h-6 w-6 text-yellow-400" />}
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {notification.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    // Handle notification dismissal
                    console.log('Dismiss notification:', notification.id);
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;

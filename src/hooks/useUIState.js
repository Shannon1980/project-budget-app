import { useState, useEffect } from 'react';

export const useUIState = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState('budget');

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, timestamp: new Date() }]);
    
    // Auto-remove notifications after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5000);
  };

  const handleError = (error, context = 'Operation') => {
    console.error(`${context} error:`, error);
    setError({
      message: error.message || 'An unexpected error occurred',
      context,
      timestamp: new Date()
    });
    
    showNotification(`${context} failed: ${error.message}`, 'error');
  };

  // Responsive design detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return {
    // State
    activeTab,
    setActiveTab,
    darkMode,
    setDarkMode,
    isMobile,
    setIsMobile,
    showMobileMenu,
    setShowMobileMenu,
    notifications,
    setNotifications,
    error,
    setError,
    selectedChart,
    setSelectedChart,
    
    // Actions
    showNotification,
    handleError
  };
};

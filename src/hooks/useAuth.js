import { useState } from 'react';
import { MOCK_USERS } from '../constants/mockData';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', rememberMe: false });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState(null);

  const hasPermission = (permission) => {
    return currentUser?.permissions[permission] || false;
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setLoginError('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find(u => 
      u.email === loginForm.email && u.password === loginForm.password
    );

    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setLoginForm({ email: '', password: '', rememberMe: false });
    } else {
      setLoginError('Invalid email or password');
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const userExists = MOCK_USERS.find(u => u.email === forgotPasswordEmail);
    
    if (userExists) {
      setForgotPasswordStatus({ 
        type: 'success', 
        message: 'Password reset instructions sent to your email' 
      });
    } else {
      setForgotPasswordStatus({ 
        type: 'error', 
        message: 'No account found with this email address' 
      });
    }

    setIsLoading(false);
    setTimeout(() => {
      if (userExists) {
        setShowForgotPassword(false);
        setForgotPasswordStatus(null);
        setForgotPasswordEmail('');
      }
    }, 3000);
  };

  return {
    // State
    isLoggedIn,
    currentUser,
    loginForm,
    setLoginForm,
    loginError,
    setLoginError,
    isLoading,
    showForgotPassword,
    setShowForgotPassword,
    forgotPasswordEmail,
    setForgotPasswordEmail,
    forgotPasswordStatus,
    setForgotPasswordStatus,
    
    // Actions
    handleLogin,
    handleLogout,
    handleForgotPassword,
    hasPermission
  };
};

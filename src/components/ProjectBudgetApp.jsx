import React, { useMemo, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, FileText, Shield, HelpCircle, X, XCircle, Menu, X as CloseIcon, Calculator } from 'lucide-react';

// Import custom hooks
import { useAuth } from '../hooks/useAuth';
import { useDataManagement } from '../hooks/useDataManagement';
import { useUIState } from '../hooks/useUIState';
import { useUserManagement } from '../hooks/useUserManagement';
import { useForecasting } from '../hooks/useForecasting';
import { useEmployeeManagement } from '../hooks/useEmployeeManagement';

// Import utilities
import { calculateMetrics, formatCurrency } from '../utils/financialCalculations';
import { exportToCSV, exportToJSON, exportToExcel, handleImportData } from '../utils/dataExport';
import { generateFinancialReport, generateTeamReport, generateBudgetReport } from '../utils/reportGeneration';

// Import constants
import { MOCK_USERS } from '../constants/mockData';

// Import components
import LoginForm from './auth/LoginForm';
import UserProfile from './auth/UserProfile';
import OverviewTab from './dashboard/OverviewTab';
import TeamTab from './dashboard/TeamTab';
import FinancialsTab from './dashboard/FinancialsTab';
import ForecastingTab from './dashboard/ForecastingTab';
import ReportsTab from './dashboard/ReportsTab';
import AddUserModal from './modals/AddUserModal';
import EditUserModal from './modals/EditUserModal';
import ForecastDataModal from './modals/ForecastDataModal';
import NotificationSystem from './ui/NotificationSystem';
import StatusBadge from './ui/StatusBadge';

const ProjectBudgetApp = () => {
  // Custom hooks for state management
  const auth = useAuth();
  const dataManagement = useDataManagement();
  const uiState = useUIState();
  const userManagement = useUserManagement();
  const forecasting = useForecasting();
  const employeeManagement = useEmployeeManagement();

  // Destructure commonly used values for easier access
  const {
    isLoggedIn,
    currentUser,
    loginForm,
    setLoginForm,
    loginError,
    setLoginError,
    isLoading,
    setShowForgotPassword,
    handleLogin,
    handleLogout,
    hasPermission
  } = auth;

  const {
    employees,
    setEmployees,
    projectData,
    setProjectData,
    monthlySalaryAdjustments,
    forecastScenarios,
    setForecastScenarios,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    lastSaved,
    saveToDatabase,
    loadFromDatabase,
    handleUpdateEmployee,
    handleUpdateProjectData
  } = dataManagement;

  const {
    activeTab,
    setActiveTab,
    darkMode,
    setDarkMode,
    isMobile,
    showMobileMenu,
    setShowMobileMenu,
    notifications,
    error,
    setError,
    selectedChart,
    setSelectedChart,
    showNotification,
    handleError
  } = uiState;

  // Load data from database on component mount
  useEffect(() => {
    loadFromDatabase(showNotification);
  }, [loadFromDatabase, showNotification]);

  // Calculate metrics using utility function
  const metrics = useMemo(() => calculateMetrics(employees, projectData), [employees, projectData]);

  // Enhanced metrics with chart data
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return {
      budget: months.map((month, index) => ({
        month,
        revenue: projectData.actualRevenue * (index + 1) / 6,
        costs: metrics.totalCosts * (index + 1) / 6,
        profit: (projectData.actualRevenue - metrics.totalCosts) * (index + 1) / 6
      })),
      team: employees.map(emp => ({
        name: emp.name,
        hours: emp.actualHours,
        cost: emp.actualHours * emp.hourlyRate,
        efficiency: emp.actualHours / (emp.actualHours + 10) * 100 // Mock efficiency
      })),
      costs: [
        { name: 'Direct Labor', value: metrics.totalDirectLabor, color: '#3B82F6' },
        { name: 'Subcontractor', value: metrics.totalSubcontractorLabor, color: '#10B981' },
        { name: 'Indirect Costs', value: metrics.indirectCosts, color: '#F59E0B' }
      ]
    };
  }, [employees, projectData, metrics]);

  // Wrapper functions for export utilities
  const handleExportToCSV = () => {
    try {
      exportToCSV(employees, showNotification, () => dataManagement.setIsLoading(true));
    } catch (error) {
      handleError(error, 'CSV Export');
    }
  };

  const handleExportToJSON = () => {
    try {
      exportToJSON(employees, projectData, () => metrics, showNotification, () => dataManagement.setIsLoading(true));
    } catch (error) {
      handleError(error, 'JSON Export');
    }
  };

  const handleExportToExcel = () => {
    try {
      exportToExcel(employees, projectData, showNotification, () => dataManagement.setIsLoading(true));
    } catch (error) {
      handleError(error, 'Excel Export');
    }
  };

  const handleImportDataWrapper = (event) => {
    try {
      handleImportData(event, setEmployees, setProjectData, setHasUnsavedChanges, showNotification, () => dataManagement.setIsLoading(true));
    } catch (error) {
      handleError(error, 'Data Import');
    }
  };

  // Wrapper functions for data management
  const handleUpdateEmployeeWrapper = (id, field, value) => {
    try {
      handleUpdateEmployee(id, field, value, showNotification);
    } catch (error) {
      handleError(error, 'Employee Update');
    }
  };

  const handleUpdateProjectDataWrapper = (field, value) => {
    try {
      handleUpdateProjectData(field, value, showNotification);
    } catch (error) {
      handleError(error, 'Project Data Update');
    }
  };

  // Destructure user management functions from hook
  const {
    showEditProfile,
    setShowEditProfile,
    editingProfile,
    setEditingProfile,
    showEditUser,
    setShowEditUser,
    editingUser,
    setEditingUser,
    showAddUser,
    setShowAddUser,
    newUser,
    setNewUser,
    handleEditProfile,
    handleSaveProfile,
    handleSaveUser,
    handleAddUser
  } = userManagement;

  // Destructure forecasting functions from hook
  const {
    forecastYear,
    setForecastYear,
    selectedScenario,
    setSelectedScenario,
    showAddScenario,
    setShowAddScenario,
    newScenario,
    setNewScenario,
    showForecastDataModal,
    setShowForecastDataModal,
    selectedEmployeeForForecast,
    editingForecastData,
    setEditingForecastData,
    forecastData,
    handleDeleteScenario,
    handleAddScenario,
    openForecastDataEditor,
    handleSaveForecastData,
    addProjectAssignment,
    removeProjectAssignment,
    calculateForecastData
  } = forecasting;

  // Destructure employee management functions from hook
  const {
    showAddEmployee,
    setShowAddEmployee,
    handleEditEmployee,
    handleDeleteEmployee,
    openMonthlyAdjustments
  } = employeeManagement;

  // Wrapper functions for report generation
  const handleGenerateFinancialReport = () => {
    generateFinancialReport(employees, projectData, metrics, formatCurrency);
  };

  const handleGenerateTeamReport = () => {
    generateTeamReport(employees, formatCurrency);
  };

  const handleGenerateBudgetReport = () => {
    generateBudgetReport(employees, projectData, metrics, formatCurrency);
  };

  if (!isLoggedIn) {
    return (
      <LoginForm
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        loginError={loginError}
        setLoginError={setLoginError}
        isLoading={isLoading}
        onLogin={handleLogin}
        onForgotPassword={() => setShowForgotPassword(true)}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Enhanced Notifications */}
      <NotificationSystem notifications={notifications} />

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <XCircle className="text-red-500" size={20} />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error: {error.context}</h3>
              <p className="text-sm text-red-700 mt-1">{error.message}</p>
              <p className="text-xs text-red-600 mt-1">
                {error.timestamp.toLocaleTimeString()}
              </p>
                      </div>
                  <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
                  >
              <X size={20} />
                  </button>
                    </div>
                      </div>
                    )}

      {/* Enhanced Header with Mobile Support */}
      <div className={`border-b transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            {isMobile && (
                    <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {showMobileMenu ? <CloseIcon size={24} /> : <Menu size={24} />}
                    </button>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-white" size={20} />
                </div>
                <div className={isMobile ? 'hidden' : 'block'}>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Budget Manager</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">SEAS Project Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              {/* Data Status */}
              {!isMobile && (
                <div className="flex items-center space-x-2 text-sm">
                  {hasUnsavedChanges && (
                    <span className="text-yellow-600 dark:text-yellow-400">● Unsaved</span>
                  )}
                  {lastSaved && (
                    <span className="text-gray-500 dark:text-gray-400">
                      Saved: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={saveToDatabase}
                disabled={!hasUnsavedChanges || isLoading}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>

              {/* User Profile */}
              <div className={`flex items-center space-x-3 px-3 py-2 rounded-xl ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                  currentUser.role === 'admin' ? 'bg-blue-500' :
                  currentUser.role === 'manager' ? 'bg-green-500' : 'bg-gray-500'
                }`}>
                  {currentUser.avatar}
                </div>
                {!isMobile && (
                <div className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">{currentUser.name}</div>
                    <div className="text-gray-500 dark:text-gray-400">{currentUser.role}</div>
                </div>
                )}
              </div>
              
              <button
                onClick={handleEditProfile}
                className="px-3 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors text-sm"
              >
                Edit Profile
              </button>
              
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && showMobileMenu && (
        <div className={`fixed inset-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <CloseIcon size={24} />
              </button>
        </div>

            <div className="space-y-4">
              {['overview', 'employees', 'financials', 'forecasting', 'reports', 'admin', 'help'].map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="capitalize">{tab}</span>
                </button>
              ))}
            </div>
                </div>
                  </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Enhanced Tab Navigation */}
        {!isMobile && (
          <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'employees', label: 'Team', icon: Users },
              { id: 'financials', label: 'Financials', icon: DollarSign },
              { id: 'forecasting', label: 'Forecasting', icon: Calculator },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'admin', label: 'Admin', icon: Shield },
              { id: 'help', label: 'Help', icon: HelpCircle }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-3 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600'
                }`}
              >
                <Icon size={20} />
                <span className="font-semibold">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Enhanced Overview Dashboard */}
        {activeTab === 'overview' && (
          <OverviewTab
            projectData={projectData}
            metrics={metrics}
            formatCurrency={formatCurrency}
            employees={employees}  // ✅ Add this missing prop
            chartData={chartData}
            selectedChart={selectedChart}
            setSelectedChart={setSelectedChart}
            darkMode={darkMode}  // ✅ Also add this for consistency
          />
        )}

        {activeTab === 'employees' && (
          <TeamTab
            employees={employees}
            hasPermission={hasPermission}
            formatCurrency={formatCurrency}
            darkMode={darkMode}
            showAddEmployee={showAddEmployee}
            setShowAddEmployee={setShowAddEmployee}
            handleEditEmployee={handleEditEmployee}
            handleDeleteEmployee={(employeeId) => handleDeleteEmployee(employeeId, employees, setEmployees, setHasUnsavedChanges, showNotification)}
            handleUpdateEmployee={handleUpdateEmployeeWrapper}
            openMonthlyAdjustments={openMonthlyAdjustments}
            openForecastDataEditor={openForecastDataEditor}
          />
        )}

        {activeTab === 'financials' && hasPermission('viewFinancials') && (
          <FinancialsTab
            projectData={projectData}
            hasPermission={hasPermission}
            handleUpdateProjectData={handleUpdateProjectDataWrapper}
            metrics={metrics}
            formatCurrency={formatCurrency}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'forecasting' && hasPermission('viewFinancials') && (
          <ForecastingTab
            forecastYear={forecastYear}
            setForecastYear={setForecastYear}
            selectedScenario={selectedScenario}
            setSelectedScenario={setSelectedScenario}
            forecastScenarios={forecastScenarios}
            setForecastScenarios={setForecastScenarios}
            showAddScenario={showAddScenario}
            setShowAddScenario={setShowAddScenario}
            newScenario={newScenario}
            setNewScenario={setNewScenario}
            hasPermission={hasPermission}
            calculateForecast={() => calculateForecastData(employees, projectData, forecastScenarios, monthlySalaryAdjustments)}
            handleDeleteScenario={(scenarioId) => handleDeleteScenario(scenarioId, forecastScenarios, setForecastScenarios, showNotification)}
            handleAddScenario={() => handleAddScenario(setForecastScenarios, showNotification)}
            forecastData={forecastData}
            formatCurrency={formatCurrency}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'reports' && hasPermission('viewReports') && (
          <ReportsTab
            employees={employees}
            projectData={projectData}
            metrics={metrics}
            formatCurrency={formatCurrency}
            hasPermission={hasPermission}
            handleError={handleError}
            exportToCSV={handleExportToCSV}
            exportToExcel={handleExportToExcel}
            exportToJSON={handleExportToJSON}
            handleImportData={handleImportDataWrapper}
            generateFinancialReport={handleGenerateFinancialReport}
            generateTeamReport={handleGenerateTeamReport}
            generateBudgetReport={handleGenerateBudgetReport}
            isLoading={isLoading}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'admin' && hasPermission('manageUsers') && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">System Administration</h2>
              <p className="text-gray-500 mt-1">Manage users, permissions, and system settings</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">User Management</h3>
              <div className="space-y-4">
                {MOCK_USERS.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                        user.role === 'admin' ? 'bg-blue-500' :
                        user.role === 'manager' ? 'bg-green-500' : 'bg-gray-500'
                      }`}>
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <StatusBadge status={user.role} variant="info" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Help & Documentation</h2>
              <p className="text-gray-500 mt-1">Get help with using the budget management system</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">User Roles & Permissions</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p><strong>Admin:</strong> Full access to all features including user management</p>
                  <p><strong>Manager:</strong> Can view salaries and edit employees, but can't edit financial settings</p>
                  <p><strong>Employee:</strong> Limited view-only access to reports and basic information</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    📊 Understanding Financial Metrics
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    👥 Managing Team Members
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    🔐 User Permissions Guide
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    ⚙️ System Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Edit Modal */}
      {showEditProfile && (
        <UserProfile
          editingProfile={editingProfile}
          setEditingProfile={setEditingProfile}
          handleSaveProfile={() => handleSaveProfile(currentUser, auth.setCurrentUser, showNotification)}
          setShowEditProfile={setShowEditProfile}
        />
      )}

      {/* User Edit Modal */}
      {showEditUser && editingUser && (
        <EditUserModal
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          handleSaveUser={() => handleSaveUser(showNotification)}
          setShowEditUser={setShowEditUser}
        />
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <AddUserModal
          newUser={newUser}
          setNewUser={setNewUser}
          handleAddUser={() => handleAddUser(setEmployees, showNotification)}
          setShowAddUser={setShowAddUser}
        />
      )}

      {/* Forecast Data Editing Modal */}
      {showForecastDataModal && selectedEmployeeForForecast && (
        <ForecastDataModal
          editingForecastData={editingForecastData}
          setEditingForecastData={setEditingForecastData}
          handleSaveForecastData={() => handleSaveForecastData(employees, setEmployees, setHasUnsavedChanges, showNotification)}
          addProjectAssignment={addProjectAssignment}
          removeProjectAssignment={removeProjectAssignment}
          selectedEmployeeForForecast={selectedEmployeeForForecast}
          setShowForecastDataModal={setShowForecastDataModal}
        />
      )}
    </div>
  );
};

export default ProjectBudgetApp;
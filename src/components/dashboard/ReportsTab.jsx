import React from 'react';
import { FileText, Download, BarChart3, TrendingUp } from 'lucide-react';

const ReportsTab = ({ 
  employees, 
  projectData, 
  metrics, 
  formatCurrency, 
  hasPermission,
  generateFinancialReport,
  generateTeamReport,
  generateBudgetReport,
  isLoading,
  darkMode 
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400">Generate comprehensive reports and analytics</p>
      </div>

      {/* Report Generation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">Financial Report</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Comprehensive financial analysis including revenue, costs, and profitability
          </p>
          <button
            onClick={generateFinancialReport}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">Team Report</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Team utilization, hours tracking, and performance metrics
          </p>
          <button
            onClick={generateTeamReport}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">Budget Report</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Budget forecasting and variance analysis
          </p>
          <button
            onClick={generateBudgetReport}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Export Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Export JSON
          </button>
          <button
            className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Export CSV
          </button>
          <button
            className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(metrics.revenue)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Costs</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(metrics.totalCosts)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Profit</p>
          <p className={`text-2xl font-bold ${
            metrics.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(metrics.profit)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Team Members</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {employees.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;

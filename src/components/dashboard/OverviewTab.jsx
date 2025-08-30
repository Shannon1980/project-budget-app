import React from 'react';
import { DollarSign, Users, Clock, TrendingUp } from 'lucide-react';

const OverviewTab = ({ 
  metrics = {}, 
  formatCurrency = (value) => `$${value?.toLocaleString() || '0'}`, 
  employees = [], 
  projectData = {}, 
  darkMode = false 
}) => {
  // Add safety checks for metrics
  const safeMetrics = {
    revenue: metrics.revenue || 0,
    profit: metrics.profit || 0,
    profitLossPercentage: metrics.profitLossPercentage || 0,
    directLabor: metrics.directLabor || 0,
    subcontractorLabor: metrics.subcontractorLabor || 0,
    indirectCosts: metrics.indirectCosts || 0,
    totalCosts: metrics.totalCosts || 0,
    ...metrics
  };

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(safeMetrics.revenue)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {employees?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {employees?.reduce((sum, emp) => sum + (emp?.actualHours || 0), 0) || 0}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Profit</p>
              <p className={`text-2xl font-bold ${
                safeMetrics.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(safeMetrics.profit)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Profit/Loss Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Profit/Loss Summary</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Profit/Loss Percentage</p>
            <p className={`text-3xl font-bold ${
              safeMetrics.profitLossPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {safeMetrics.profitLossPercentage >= 0 ? '+' : ''}{safeMetrics.profitLossPercentage.toFixed(2)}%
            </p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-semibold ${
              safeMetrics.profitLossPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {safeMetrics.profitLossPercentage >= 0 ? 'PROFIT' : 'LOSS'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {safeMetrics.profitLossPercentage >= 0 ? 'Project is profitable' : 'Project is losing money'}
            </p>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Cost Breakdown</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Direct Labor</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(safeMetrics.directLabor)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Subcontractor Labor</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(safeMetrics.subcontractorLabor)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Indirect Costs</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(safeMetrics.indirectCosts)}
            </span>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Total Costs</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(safeMetrics.totalCosts)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;

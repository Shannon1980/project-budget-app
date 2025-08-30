import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const FinancialsTab = ({ 
  projectData, 
  metrics, 
  formatCurrency, 
  hasPermission,
  handleUpdateProjectData,
  darkMode 
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Overview</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage project financials and track profitability</p>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Project Financials</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-gray-300 font-medium">Contract Value</label>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(projectData.contractValue)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-gray-300 font-medium">Actual Revenue</label>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(projectData.actualRevenue)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-gray-300 font-medium">Total Billable Hours</label>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {projectData.totalBillableHours}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-gray-300 font-medium">Actual Hours to Date</label>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {projectData.actualHoursToDate}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-gray-300 font-medium">Profit Margin</label>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {projectData.profitMargin}%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-gray-300 font-medium">Indirect Cost Rate</label>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {projectData.indirectCostRate}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Cost Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Direct Labor</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(metrics.directLabor)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Subcontractor Labor</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(metrics.subcontractorLabor)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Indirect Costs</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(metrics.indirectCosts)}
              </span>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total Costs</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(metrics.totalCosts)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profit/Loss Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Profit/Loss Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(metrics.revenue)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Costs</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(metrics.totalCosts)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              {metrics.profit >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Net Result</p>
            <p className={`text-2xl font-bold ${
              metrics.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(metrics.profit)}
            </p>
          </div>
        </div>
        
        {/* Profit/Loss Percentage */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Profit/Loss Percentage</p>
              <p className={`text-3xl font-bold ${
                metrics.profitLossPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {metrics.profitLossPercentage >= 0 ? '+' : ''}{metrics.profitLossPercentage.toFixed(2)}%
              </p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-semibold ${
                metrics.profitLossPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {metrics.profitLossPercentage >= 0 ? 'PROFIT' : 'LOSS'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {metrics.profitLossPercentage >= 0 ? 'Project is profitable' : 'Project is losing money'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialsTab;

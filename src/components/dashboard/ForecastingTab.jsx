import React from 'react';
import { Calculator, TrendingUp, Users, DollarSign } from 'lucide-react';

const ForecastingTab = ({ 
  forecastYear,
  setForecastYear,
  selectedScenario,
  setSelectedScenario,
  forecastScenarios,
  setForecastScenarios,
  showAddScenario,
  setShowAddScenario,
  newScenario,
  setNewScenario,
  handleAddScenario,
  handleDeleteScenario,
  forecastData,
  formatCurrency,
  hasPermission,
  darkMode 
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Forecasting</h2>
        <p className="text-gray-600 dark:text-gray-400">Plan and forecast future budget scenarios</p>
      </div>

      {/* Forecast Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Forecast Year
            </label>
            <select
              value={forecastYear}
              onChange={(e) => setForecastYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Scenario
            </label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {forecastScenarios.map(scenario => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.name}
                </option>
              ))}
            </select>
          </div>

          {hasPermission('editFinancials') && (
            <div className="flex items-end">
              <button
                onClick={() => setShowAddScenario(true)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Add Scenario
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Forecast Results */}
      {forecastData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Revenue Forecast</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Current Revenue</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(forecastData.currentRevenue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Growth Rate</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {forecastData.revenueGrowth}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Forecasted Revenue</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(forecastData.forecastedRevenue)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Cost Forecast</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Current Costs</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(forecastData.currentCosts)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Salary Increase</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {forecastData.salaryIncrease}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Forecasted Costs</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {formatCurrency(forecastData.forecastedCosts)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forecast Summary */}
      {forecastData && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Forecast Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Forecasted Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(forecastData.forecastedRevenue)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Forecasted Costs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(forecastData.forecastedCosts)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calculator className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Forecasted Profit</p>
              <p className={`text-2xl font-bold ${
                forecastData.forecastedProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(forecastData.forecastedProfit)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastingTab;

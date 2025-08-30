import React from 'react';
import { X, Plus, Trash2, Calendar, DollarSign, Users, FileText } from 'lucide-react';

const ForecastDataModal = ({ 
  showForecastDataModal, 
  setShowForecastDataModal, 
  selectedEmployeeForForecast, 
  editingForecastData, 
  setEditingForecastData, 
  handleSaveForecastData,
  addProjectAssignment,
  removeProjectAssignment,
  darkMode 
}) => {
  if (!showForecastDataModal || !selectedEmployeeForForecast) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveForecastData();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Forecast Data - {selectedEmployeeForForecast.name}
          </h2>
          <button
            onClick={() => setShowForecastDataModal(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expected Hours Per Month
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={editingForecastData.expectedHoursPerMonth || ''}
                  onChange={(e) => setEditingForecastData({
                    ...editingForecastData, 
                    expectedHoursPerMonth: parseInt(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="160"
                  min="0"
                  max="200"
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expected Utilization (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={editingForecastData.expectedUtilization ? (editingForecastData.expectedUtilization * 100) : ''}
                  onChange={(e) => setEditingForecastData({
                    ...editingForecastData, 
                    expectedUtilization: (parseFloat(e.target.value) || 0) / 100
                  })}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="85"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expected Rate Increase (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={editingForecastData.expectedRateIncrease || ''}
                  onChange={(e) => setEditingForecastData({
                    ...editingForecastData, 
                    expectedRateIncrease: parseFloat(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3.0"
                  min="0"
                  max="50"
                  step="0.1"
                />
                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Assignments
            </label>
            <div className="space-y-2">
              {(editingForecastData.expectedProjectAssignments || []).map((project, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={project}
                    onChange={(e) => {
                      const newAssignments = [...(editingForecastData.expectedProjectAssignments || [])];
                      newAssignments[index] = e.target.value;
                      setEditingForecastData({
                        ...editingForecastData,
                        expectedProjectAssignments: newAssignments
                      });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter project name"
                  />
                  <button
                    type="button"
                    onClick={() => removeProjectAssignment(index)}
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addProjectAssignment}
                className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project Assignment
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <div className="relative">
              <textarea
                value={editingForecastData.notes || ''}
                onChange={(e) => setEditingForecastData({
                  ...editingForecastData, 
                  notes: e.target.value
                })}
                rows={3}
                className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter any additional notes or comments..."
              />
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowForecastDataModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Save Forecast Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForecastDataModal;

import { useState } from 'react';
import { calculateForecast } from '../utils/financialCalculations';

export const useForecasting = () => {
  const [forecastYear, setForecastYear] = useState(new Date().getFullYear() + 1);
  const [selectedScenario, setSelectedScenario] = useState(1);
  const [showAddScenario, setShowAddScenario] = useState(false);
  const [newScenario, setNewScenario] = useState({
    name: '',
    salaryIncrease: 3.0,
    revenueGrowth: 4.0
  });
  const [showForecastDataModal, setShowForecastDataModal] = useState(false);
  const [selectedEmployeeForForecast, setSelectedEmployeeForForecast] = useState(null);
  const [editingForecastData, setEditingForecastData] = useState({});
  const [forecastData, setForecastData] = useState(null);

  const handleDeleteScenario = (scenarioId, forecastScenarios, setForecastScenarios, showNotification) => {
    if (forecastScenarios.length <= 1) {
      showNotification('Cannot delete the last scenario', 'error');
      return;
    }

    setForecastScenarios(prev => prev.filter(s => s.id !== scenarioId));
    if (selectedScenario === scenarioId) {
      setSelectedScenario(forecastScenarios[0].id);
    }
    showNotification('Scenario deleted successfully!', 'success');
  };

  const handleAddScenario = (setForecastScenarios, showNotification) => {
    if (!newScenario.name) {
      showNotification('Please enter a scenario name', 'error');
      return;
    }

    const scenario = {
      ...newScenario,
      id: Date.now()
    };

    setForecastScenarios(prev => [...prev, scenario]);
    setNewScenario({
      name: '',
      salaryIncrease: 3.0,
      revenueGrowth: 4.0
    });
    setShowAddScenario(false);
    showNotification('Scenario added successfully!', 'success');
  };

  const openForecastDataEditor = (employee) => {
    setSelectedEmployeeForForecast(employee);
    setEditingForecastData({
      expectedHoursPerMonth: employee.forecastData?.expectedHoursPerMonth || 160,
      expectedUtilization: employee.forecastData?.expectedUtilization || 0.80,
      expectedRateIncrease: employee.forecastData?.expectedRateIncrease || 3.0,
      expectedProjectAssignments: employee.forecastData?.expectedProjectAssignments || [],
      notes: employee.forecastData?.notes || ""
    });
    setShowForecastDataModal(true);
  };

  const handleSaveForecastData = (employees, setEmployees, setHasUnsavedChanges, showNotification) => {
    if (!selectedEmployeeForForecast) return;

    setEmployees(prev => prev.map(emp => 
      emp.id === selectedEmployeeForForecast.id 
        ? { 
            ...emp, 
            forecastData: { ...editingForecastData }
          }
        : emp
    ));

    setHasUnsavedChanges(true);
    setShowForecastDataModal(false);
    showNotification('Forecast data updated successfully!', 'success');
  };

  const addProjectAssignment = () => {
    const newProject = prompt('Enter new project assignment:');
    if (newProject && newProject.trim()) {
      setEditingForecastData(prev => ({
        ...prev,
        expectedProjectAssignments: [...prev.expectedProjectAssignments, newProject.trim()]
      }));
    }
  };

  const removeProjectAssignment = (index) => {
    setEditingForecastData(prev => ({
      ...prev,
      expectedProjectAssignments: prev.expectedProjectAssignments.filter((_, i) => i !== index)
    }));
  };

  const calculateForecastData = (employees, projectData, forecastScenarios, monthlySalaryAdjustments) => {
    return calculateForecast(employees, projectData, forecastScenarios, selectedScenario, forecastYear, monthlySalaryAdjustments);
  };

  return {
    // State
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
    setSelectedEmployeeForForecast,
    editingForecastData,
    setEditingForecastData,
    forecastData,
    setForecastData,
    
    // Actions
    handleDeleteScenario,
    handleAddScenario,
    openForecastDataEditor,
    handleSaveForecastData,
    addProjectAssignment,
    removeProjectAssignment,
    calculateForecastData
  };
};

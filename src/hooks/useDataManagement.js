import { useState, useEffect } from 'react';
import { 
  saveEmployees, 
  loadEmployees, 
  saveProjectData, 
  loadProjectData,
  saveMonthlyAdjustments,
  loadMonthlyAdjustments,
  saveForecastScenarios,
  loadForecastScenarios
} from '../services/neonDatabase';
import { INITIAL_EMPLOYEES, INITIAL_PROJECT_DATA, INITIAL_FORECAST_SCENARIOS } from '../constants/mockData';

export const useDataManagement = () => {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [projectData, setProjectData] = useState(INITIAL_PROJECT_DATA);
  const [monthlySalaryAdjustments, setMonthlySalaryAdjustments] = useState({});
  const [forecastScenarios, setForecastScenarios] = useState(INITIAL_FORECAST_SCENARIOS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const saveToDatabase = async (showNotification) => {
    try {
      setIsLoading(true);
      
      // Save employees
      const employeesResult = await saveEmployees(employees);
      if (!employeesResult.success) {
        throw new Error(employeesResult.error);
      }
      
      // Save project data
      const projectResult = await saveProjectData(projectData);
      if (!projectResult.success) {
        throw new Error(projectResult.error);
      }
      
      // Save monthly adjustments
      const adjustmentsResult = await saveMonthlyAdjustments(monthlySalaryAdjustments);
      if (!adjustmentsResult.success) {
        throw new Error(adjustmentsResult.error);
      }
      
      // Save forecast scenarios
      const scenariosResult = await saveForecastScenarios(forecastScenarios);
      if (!scenariosResult.success) {
        throw new Error(scenariosResult.error);
      }
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      showNotification('Data saved to Neon database successfully!', 'success');
    } catch (error) {
      console.error('Error saving to database:', error);
      showNotification(`Failed to save data: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromDatabase = async (showNotification) => {
    try {
      setIsLoading(true);
      
      // Load employees
      const employeesResult = await loadEmployees();
      if (employeesResult.success && employeesResult.data) {
        setEmployees(employeesResult.data);
      }
      
      // Load project data
      const projectResult = await loadProjectData();
      if (projectResult.success && projectResult.data) {
        setProjectData(projectResult.data);
      }
      
      // Load monthly adjustments
      const adjustmentsResult = await loadMonthlyAdjustments();
      if (adjustmentsResult.success && adjustmentsResult.data) {
        setMonthlySalaryAdjustments(adjustmentsResult.data);
      }
      
      // Load forecast scenarios
      const scenariosResult = await loadForecastScenarios();
      if (scenariosResult.success && scenariosResult.data) {
        setForecastScenarios(scenariosResult.data);
      }
      
      showNotification('Data loaded from Neon database successfully!', 'success');
    } catch (error) {
      console.error('Error loading from database:', error);
      showNotification(`Failed to load data: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmployee = (id, field, value, showNotification) => {
    try {
      // Validate input
      if (field === 'hourlyRate' && (value < 0 || isNaN(value))) {
        throw new Error('Hourly rate must be a positive number');
      }
      
      if (field === 'actualHours' && (value < 0 || isNaN(value))) {
        throw new Error('Hours must be a positive number');
      }

      setEmployees(employees.map(emp => 
        emp.id === id ? { ...emp, [field]: value } : emp
      ));
      
      setHasUnsavedChanges(true);
      showNotification('Employee updated successfully!', 'success');
    } catch (error) {
      throw new Error(`Employee Update failed: ${error.message}`);
    }
  };

  const handleUpdateProjectData = (field, value, showNotification) => {
    try {
      // Validate input
      if (field === 'contractValue' && (value < 0 || isNaN(value))) {
        throw new Error('Contract value must be a positive number');
      }
      
      if (field === 'actualRevenue' && (value < 0 || isNaN(value))) {
        throw new Error('Revenue must be a positive number');
      }

      setProjectData(prev => ({ ...prev, [field]: value }));
      setHasUnsavedChanges(true);
      showNotification('Project data updated successfully!', 'success');
    } catch (error) {
      throw new Error(`Project Data Update failed: ${error.message}`);
    }
  };

  const setMonthlyAdjustment = (employeeId, year, month, adjustment) => {
    setMonthlySalaryAdjustments(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [year]: {
          ...prev[employeeId]?.[year],
          [month]: adjustment
        }
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        // Note: showNotification would need to be passed from parent component
        // For now, we'll just set the timer but not call saveToDatabase
        console.log('Auto-save would trigger here');
      }, 30000); // Auto-save after 30 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [employees, projectData, hasUnsavedChanges]);

  return {
    // State
    employees,
    setEmployees,
    projectData,
    setProjectData,
    monthlySalaryAdjustments,
    setMonthlySalaryAdjustments,
    forecastScenarios,
    setForecastScenarios,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    lastSaved,
    setLastSaved,
    isLoading,
    setIsLoading,
    
    // Actions
    saveToDatabase,
    loadFromDatabase,
    handleUpdateEmployee,
    handleUpdateProjectData,
    setMonthlyAdjustment
  };
};

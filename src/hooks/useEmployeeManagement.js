import { useState } from 'react';

export const useEmployeeManagement = () => {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showMonthlyAdjustments, setShowMonthlyAdjustments] = useState(false);
  const [selectedEmployeeForAdjustments, setSelectedEmployeeForAdjustments] = useState(null);
  const [adjustmentYear, setAdjustmentYear] = useState(new Date().getFullYear());

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowAddEmployee(true);
  };

  const handleDeleteEmployee = (employeeId, employees, setEmployees, setHasUnsavedChanges, showNotification) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== employeeId));
      setHasUnsavedChanges(true);
      showNotification('Employee deleted successfully', 'success');
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowAddEmployee(true);
  };

  const openMonthlyAdjustments = (employee) => {
    setSelectedEmployeeForAdjustments(employee);
    setShowMonthlyAdjustments(true);
  };

  return {
    // State
    showAddEmployee,
    setShowAddEmployee,
    editingEmployee,
    setEditingEmployee,
    showMonthlyAdjustments,
    setShowMonthlyAdjustments,
    selectedEmployeeForAdjustments,
    setSelectedEmployeeForAdjustments,
    adjustmentYear,
    setAdjustmentYear,
    
    // Actions
    handleEditEmployee,
    handleDeleteEmployee,
    handleAddEmployee,
    openMonthlyAdjustments
  };
};

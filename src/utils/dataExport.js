export const exportToCSV = (employees, showNotification, setIsLoading) => {
  try {
    setIsLoading(true);
    
    // Prepare CSV data
    const csvData = [
      ['Employee Name', 'Role', 'Hourly Rate', 'Actual Hours', 'Status', 'Type', 'Company'],
      ...employees.map(emp => [
        emp.name,
        emp.role,
        emp.hourlyRate,
        emp.actualHours,
        emp.status,
        emp.isSubcontractor ? 'Contractor' : 'Employee',
        emp.company || ''
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `team-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification('CSV exported successfully!', 'success');
  } catch (error) {
    throw new Error(`CSV Export failed: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

export const exportToJSON = (employees, projectData, calculateMetrics, showNotification, setIsLoading) => {
  try {
    setIsLoading(true);
    
    const exportData = {
      employees,
      projectData,
      metrics: calculateMetrics(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `budget-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification('JSON exported successfully!', 'success');
  } catch (error) {
    throw new Error(`JSON Export failed: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

export const exportToExcel = (employees, projectData, showNotification, setIsLoading) => {
  try {
    setIsLoading(true);
    
    // Create Excel-like data structure
    const excelData = [
      ['Budget Report', '', '', '', '', '', ''],
      ['Generated:', new Date().toLocaleDateString(), '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['Project Financials', '', '', '', '', '', ''],
      ['Contract Value', projectData.contractValue, '', '', '', '', ''],
      ['Actual Revenue', projectData.actualRevenue, '', '', '', '', ''],
      ['Total Billable Hours', projectData.totalBillableHours, '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['Team Members', '', '', '', '', '', ''],
      ['Name', 'Role', 'Hourly Rate', 'Actual Hours', 'Status', 'Type', 'Company'],
      ...employees.map(emp => [
        emp.name,
        emp.role,
        emp.hourlyRate,
        emp.actualHours,
        emp.status,
        emp.isSubcontractor ? 'Contractor' : 'Employee',
        emp.company || ''
      ])
    ];

    // Convert to CSV (Excel can open CSV files)
    const csvContent = excelData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `budget-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification('Excel report exported successfully!', 'success');
  } catch (error) {
    throw new Error(`Excel Export failed: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

export const handleImportData = (event, setEmployees, setProjectData, setHasUnsavedChanges, showNotification, setIsLoading) => {
  const file = event.target.files[0];
  if (!file) return;

  setIsLoading(true);
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      
      // Validate imported data
      if (!data.employees || !Array.isArray(data.employees)) {
        throw new Error('Invalid data format: employees array missing');
      }
      
      if (!data.projectData || typeof data.projectData !== 'object') {
        throw new Error('Invalid data format: project data missing');
      }

      // Validate employee data structure
      const validEmployees = data.employees.filter(emp => 
        emp.name && 
        emp.role && 
        typeof emp.hourlyRate === 'number' &&
        typeof emp.actualHours === 'number'
      );

      if (validEmployees.length !== data.employees.length) {
        showNotification('Some employee records were invalid and skipped', 'warning');
      }

      setEmployees(validEmployees);
      setProjectData(data.projectData);
      setHasUnsavedChanges(true);
      
      showNotification(`Data imported successfully! Loaded ${validEmployees.length} employees.`, 'success');
    } catch (error) {
      throw new Error(`Data Import failed: ${error.message}`);
    } finally {
      setIsLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  reader.onerror = () => {
    throw new Error('Failed to read file');
  };

  reader.readAsText(file);
};

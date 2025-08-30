export const generateFinancialReport = (employees, projectData, metrics, formatCurrency) => {
  console.log('Generating financial report...');
  
  const report = {
    title: 'Financial Report',
    generatedAt: new Date().toISOString(),
    summary: {
      totalRevenue: projectData.actualRevenue,
      totalCosts: metrics.totalCosts,
      profit: metrics.profit,
      profitLossPercentage: metrics.profitLossPercentage
    },
    breakdown: {
      directLabor: metrics.totalDirectLabor,
      subcontractorLabor: metrics.totalSubcontractorLabor,
      indirectCosts: metrics.indirectCosts
    },
    employees: employees.map(emp => ({
      name: emp.name,
      role: emp.role,
      hourlyRate: emp.hourlyRate,
      actualHours: emp.actualHours,
      totalCost: emp.actualHours * emp.hourlyRate,
      status: emp.status,
      isSubcontractor: emp.isSubcontractor
    }))
  };
  
  console.log('Financial Report:', report);
  return report;
};

export const generateTeamReport = (employees, formatCurrency) => {
  console.log('Generating team report...');
  
  const report = {
    title: 'Team Report',
    generatedAt: new Date().toISOString(),
    totalEmployees: employees.length,
    activeEmployees: employees.filter(emp => emp.status === 'active').length,
    totalHours: employees.reduce((sum, emp) => sum + emp.actualHours, 0),
    totalCost: employees.reduce((sum, emp) => sum + (emp.actualHours * emp.hourlyRate), 0),
    employees: employees.map(emp => ({
      name: emp.name,
      role: emp.role,
      hourlyRate: emp.hourlyRate,
      actualHours: emp.actualHours,
      utilization: emp.actualHours / 160 * 100, // Assuming 160 hours per month
      status: emp.status,
      isSubcontractor: emp.isSubcontractor,
      company: emp.company
    }))
  };
  
  console.log('Team Report:', report);
  return report;
};

export const generateBudgetReport = (employees, projectData, metrics, formatCurrency) => {
  console.log('Generating budget report...');
  
  const report = {
    title: 'Budget Report',
    generatedAt: new Date().toISOString(),
    project: {
      contractValue: projectData.contractValue,
      actualRevenue: projectData.actualRevenue,
      remainingValue: projectData.contractValue - projectData.actualRevenue,
      totalBillableHours: projectData.totalBillableHours,
      actualHoursToDate: projectData.actualHoursToDate
    },
    financials: {
      totalCosts: metrics.totalCosts,
      profit: metrics.profit,
      profitLossPercentage: metrics.profitLossPercentage,
      profitMargin: projectData.profitMargin
    },
    costBreakdown: {
      directLabor: metrics.totalDirectLabor,
      subcontractorLabor: metrics.totalSubcontractorLabor,
      indirectCosts: metrics.indirectCosts,
      indirectCostRate: projectData.indirectCostRate
    }
  };
  
  console.log('Budget Report:', report);
  return report;
};

export const calculateMetrics = (employees, projectData) => {
  const directEmployees = employees.filter(emp => !emp.isSubcontractor);
  const subcontractors = employees.filter(emp => emp.isSubcontractor);
  
  const totalDirectLabor = directEmployees.reduce((sum, emp) => sum + (emp.actualHours * emp.hourlyRate), 0);
  const totalSubcontractorLabor = subcontractors.reduce((sum, emp) => sum + (emp.actualHours * emp.hourlyRate), 0);
  const indirectCosts = totalDirectLabor * projectData.indirectCostRate;
  const totalCosts = totalDirectLabor + totalSubcontractorLabor + indirectCosts;
  const profit = projectData.actualRevenue - totalCosts;
  
  // Calculate profit/loss percentage
  const profitLossPercentage = projectData.actualRevenue > 0 ? (profit / projectData.actualRevenue) * 100 : 0;

  return {
    totalDirectLabor,
    totalSubcontractorLabor,
    indirectCosts,
    totalCosts,
    profit,
    profitLossPercentage
  };
};

export const calculateForecast = (employees, projectData, forecastScenarios, selectedScenario, forecastYear, monthlySalaryAdjustments) => {
  const currentScenario = forecastScenarios.find(s => s.id === selectedScenario);
  if (!currentScenario) return null;

  const currentYear = new Date().getFullYear();
  const yearsToForecast = forecastYear - currentYear;
  
  if (yearsToForecast <= 0) return null;

  const forecast = {
    year: forecastYear,
    currentRevenue: projectData.actualRevenue,
    projectedRevenue: projectData.actualRevenue * Math.pow(1 + currentScenario.revenueGrowth / 100, yearsToForecast),
    currentLaborCosts: employees
      .filter(emp => !emp.isSubcontractor && emp.status === 'active')
      .reduce((sum, emp) => sum + (emp.actualHours * emp.hourlyRate), 0),
    projectedLaborCosts: 0,
    salaryAdjustments: {},
    profitImpact: 0
  };

  // Calculate projected labor costs with monthly salary adjustments
  let totalProjectedCosts = 0;
  const adjustments = {};

  employees
    .filter(emp => !emp.isSubcontractor && emp.status === 'active')
    .forEach(emp => {
      const currentAnnualSalary = emp.hourlyRate * 2080; // Assuming 2080 hours per year
      const projectedRate = getEmployeeAdjustedRate(emp, forecastYear, 12, monthlySalaryAdjustments); // December of forecast year
      const projectedAnnualSalary = projectedRate * 2080;
      const salaryIncrease = projectedAnnualSalary - currentAnnualSalary;
      
      adjustments[emp.id] = {
        name: emp.name,
        currentRate: emp.hourlyRate,
        projectedRate: projectedRate,
        increase: salaryIncrease,
        increasePercentage: (salaryIncrease / currentAnnualSalary) * 100,
        monthlyAdjustments: []
      };
      
      // Add monthly adjustment details
      for (let year = currentYear; year <= forecastYear; year++) {
        for (let month = 1; month <= 12; month++) {
          const adjustment = getMonthlyAdjustment(emp.id, year, month, monthlySalaryAdjustments);
          if (adjustment !== 0) {
            adjustments[emp.id].monthlyAdjustments.push({
              year,
              month,
              adjustment,
              date: new Date(year, month - 1, 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
            });
          }
        }
      }
      
      totalProjectedCosts += projectedAnnualSalary;
    });

  forecast.projectedLaborCosts = totalProjectedCosts;
  forecast.salaryAdjustments = adjustments;
  forecast.profitImpact = forecast.projectedRevenue - forecast.projectedLaborCosts - (projectData.contractValue - projectData.actualRevenue);

  return forecast;
};

export const getMonthlyAdjustment = (employeeId, year, month, monthlySalaryAdjustments) => {
  if (!monthlySalaryAdjustments[employeeId]) return 0;
  if (!monthlySalaryAdjustments[employeeId][year]) return 0;
  if (!monthlySalaryAdjustments[employeeId][year][month]) return 0;
  return monthlySalaryAdjustments[employeeId][year][month];
};

export const getEmployeeAdjustedRate = (employee, targetYear, targetMonth, monthlySalaryAdjustments) => {
  if (employee.isSubcontractor) return employee.hourlyRate;
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  let adjustedRate = employee.hourlyRate;
  
  // Apply monthly adjustments from current date to target date
  for (let year = currentYear; year <= targetYear; year++) {
    const startMonth = year === currentYear ? currentMonth : 1;
    const endMonth = year === targetYear ? targetMonth : 12;
    
    for (let month = startMonth; month <= endMonth; month++) {
      const adjustment = getMonthlyAdjustment(employee.id, year, month, monthlySalaryAdjustments);
      if (adjustment !== 0) {
        adjustedRate = adjustedRate * (1 + adjustment / 100);
      }
    }
  }
  
  return adjustedRate;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

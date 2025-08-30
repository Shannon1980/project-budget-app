export const MOCK_USERS = [
  {
    id: 1,
    name: "John Admin",
    email: "admin@company.com",
    password: "admin123",
    role: "admin",
    avatar: "JA",
    permissions: {
      viewSalaries: true,
      editEmployees: true,
      viewFinancials: true,
      editFinancials: true,
      viewReports: true,
      manageUsers: true
    }
  },
  {
    id: 2,
    name: "Sarah Manager",
    email: "manager@company.com",
    password: "manager123",
    role: "manager",
    avatar: "SM",
    permissions: {
      viewSalaries: true,
      editEmployees: true,
      viewFinancials: true,
      editFinancials: false,
      viewReports: true,
      manageUsers: false
    }
  },
  {
    id: 3,
    name: "Mike Employee",
    email: "employee@company.com",
    password: "employee123",
    role: "employee",
    avatar: "ME",
    permissions: {
      viewSalaries: false,
      editEmployees: false,
      viewFinancials: false,
      editFinancials: false,
      viewReports: true,
      manageUsers: false
    }
  }
];

export const INITIAL_EMPLOYEES = [
  {
    id: 1,
    name: "Shannon Gueringer",
    role: "PM",
    hourlyRate: 96.15,
    actualHours: 53,
    status: "active",
    isSubcontractor: false,
    forecastData: {
      expectedHoursPerMonth: 160,
      expectedUtilization: 0.85,
      expectedRateIncrease: 3.0,
      expectedProjectAssignments: ["SEAS Project", "Future Projects"],
      notes: "Key project manager, high utilization expected"
    }
  },
  {
    id: 2,
    name: "Drew Hynes",
    role: "Developer",
    hourlyRate: 96.15,
    actualHours: 0,
    status: "inactive",
    isSubcontractor: false,
    forecastData: {
      expectedHoursPerMonth: 120,
      expectedUtilization: 0.70,
      expectedRateIncrease: 4.0,
      expectedProjectAssignments: ["Future Projects"],
      notes: "Currently inactive, expected to return to active projects"
    }
  },
  {
    id: 3,
    name: "Uyen Tran",
    role: "SA/Eng Lead",
    hourlyRate: 84.13,
    actualHours: 45,
    status: "active",
    isSubcontractor: false,
    forecastData: {
      expectedHoursPerMonth: 140,
      expectedUtilization: 0.80,
      expectedRateIncrease: 3.5,
      expectedProjectAssignments: ["SEAS Project", "Technical Leadership"],
      notes: "Technical lead, high expertise value"
    }
  },
  {
    id: 101,
    name: "Adrien Abrams",
    role: "Data Systems SME",
    hourlyRate: 250,
    actualHours: 20,
    status: "active",
    isSubcontractor: true,
    company: "BEELINE",
    forecastData: {
      expectedHoursPerMonth: 40,
      expectedUtilization: 0.60,
      expectedRateIncrease: 5.0,
      expectedProjectAssignments: ["Data Projects", "Consulting"],
      notes: "Specialist contractor, high hourly rate, limited hours"
    }
  }
];

export const INITIAL_PROJECT_DATA = {
  contractValue: 8079030,
  actualRevenue: 5646737.62,
  totalBillableHours: 26298.75,
  actualHoursToDate: 26656.50,
  profitMargin: 0.15,
  indirectCostRate: 0.35
};

export const INITIAL_FORECAST_SCENARIOS = [
  { id: 1, name: 'Scenario 1', salaryIncrease: 5, revenueGrowth: 10 },
  { id: 2, name: 'Scenario 2', salaryIncrease: 7, revenueGrowth: 12 },
  { id: 3, name: 'Scenario 3', salaryIncrease: 9, revenueGrowth: 15 }
];

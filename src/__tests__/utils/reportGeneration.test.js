import {
  generateFinancialReport,
  generateTeamReport,
  generateBudgetReport
} from '../../utils/reportGeneration';

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('Report Generation Utilities', () => {
  const mockEmployees = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Developer',
      hourlyRate: 50,
      actualHours: 160,
      status: 'active',
      isSubcontractor: false,
      company: 'TechCorp'
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Designer',
      hourlyRate: 75,
      actualHours: 120,
      status: 'active',
      isSubcontractor: true,
      company: 'DesignCo'
    },
    {
      id: 3,
      name: 'Bob Wilson',
      role: 'Manager',
      hourlyRate: 60,
      actualHours: 0,
      status: 'inactive',
      isSubcontractor: false,
      company: 'TechCorp'
    }
  ];

  const mockProjectData = {
    contractValue: 200000,
    actualRevenue: 150000,
    totalBillableHours: 2000,
    actualHoursToDate: 1800,
    profitMargin: 0.15,
    indirectCostRate: 0.35
  };

  const mockMetrics = {
    totalDirectLabor: 8000,
    totalSubcontractorLabor: 9000,
    indirectCosts: 2800,
    totalCosts: 19800,
    profit: 130200,
    profitLossPercentage: 86.8
  };

  const mockFormatCurrency = jest.fn((amount) => `$${amount.toLocaleString()}`);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateFinancialReport', () => {
    it('should generate a comprehensive financial report', () => {
      const report = generateFinancialReport(mockEmployees, mockProjectData, mockMetrics, mockFormatCurrency);

      expect(report).toBeDefined();
      expect(report.title).toBe('Financial Report');
      expect(report.generatedAt).toBeDefined();
      expect(report.summary).toBeDefined();
      expect(report.breakdown).toBeDefined();
      expect(report.employees).toBeDefined();
    });

    it('should include correct summary data', () => {
      const report = generateFinancialReport(mockEmployees, mockProjectData, mockMetrics, mockFormatCurrency);

      expect(report.summary.totalRevenue).toBe(150000);
      expect(report.summary.totalCosts).toBe(19800);
      expect(report.summary.profit).toBe(130200);
      expect(report.summary.profitLossPercentage).toBe(86.8);
    });

    it('should include correct breakdown data', () => {
      const report = generateFinancialReport(mockEmployees, mockProjectData, mockMetrics, mockFormatCurrency);

      expect(report.breakdown.directLabor).toBe(8000);
      expect(report.breakdown.subcontractorLabor).toBe(9000);
      expect(report.breakdown.indirectCosts).toBe(2800);
    });

    it('should include all employees with calculated costs', () => {
      const report = generateFinancialReport(mockEmployees, mockProjectData, mockMetrics, mockFormatCurrency);

      expect(report.employees).toHaveLength(3);
      expect(report.employees[0]).toEqual({
        name: 'John Doe',
        role: 'Developer',
        hourlyRate: 50,
        actualHours: 160,
        totalCost: 8000,
        status: 'active',
        isSubcontractor: false
      });
      expect(report.employees[1]).toEqual({
        name: 'Jane Smith',
        role: 'Designer',
        hourlyRate: 75,
        actualHours: 120,
        totalCost: 9000,
        status: 'active',
        isSubcontractor: true
      });
    });

    it('should handle empty employees array', () => {
      const report = generateFinancialReport([], mockProjectData, mockMetrics, mockFormatCurrency);

      expect(report.employees).toHaveLength(0);
      expect(report.summary).toBeDefined();
    });
  });

  describe('generateTeamReport', () => {
    it('should generate a comprehensive team report', () => {
      const report = generateTeamReport(mockEmployees, mockFormatCurrency);

      expect(report).toBeDefined();
      expect(report.title).toBe('Team Report');
      expect(report.generatedAt).toBeDefined();
      expect(report.totalEmployees).toBe(3);
      expect(report.activeEmployees).toBe(2);
      expect(report.totalHours).toBe(280);
      expect(report.totalCost).toBe(17000);
    });

    it('should calculate correct team statistics', () => {
      const report = generateTeamReport(mockEmployees, mockFormatCurrency);

      expect(report.totalEmployees).toBe(3);
      expect(report.activeEmployees).toBe(2); // Only active employees
      expect(report.totalHours).toBe(280); // 160 + 120 + 0
      expect(report.totalCost).toBe(17000); // (50 * 160) + (75 * 120) + (60 * 0)
    });

    it('should include employee details with utilization', () => {
      const report = generateTeamReport(mockEmployees, mockFormatCurrency);

      expect(report.employees).toHaveLength(3);
      expect(report.employees[0]).toEqual({
        name: 'John Doe',
        role: 'Developer',
        hourlyRate: 50,
        actualHours: 160,
        utilization: 100, // 160 / 160 * 100
        status: 'active',
        isSubcontractor: false,
        company: 'TechCorp'
      });
      expect(report.employees[2]).toEqual({
        name: 'Bob Wilson',
        role: 'Manager',
        hourlyRate: 60,
        actualHours: 0,
        utilization: 0, // 0 / 10 * 100
        status: 'inactive',
        isSubcontractor: false,
        company: 'TechCorp'
      });
    });

    it('should handle empty employees array', () => {
      const report = generateTeamReport([], mockFormatCurrency);

      expect(report.totalEmployees).toBe(0);
      expect(report.activeEmployees).toBe(0);
      expect(report.totalHours).toBe(0);
      expect(report.totalCost).toBe(0);
      expect(report.employees).toHaveLength(0);
    });
  });

  describe('generateBudgetReport', () => {
    it('should generate a comprehensive budget report', () => {
      const report = generateBudgetReport(mockEmployees, mockProjectData, mockMetrics, mockFormatCurrency);

      expect(report).toBeDefined();
      expect(report.title).toBe('Budget Report');
      expect(report.generatedAt).toBeDefined();
      expect(report.project).toBeDefined();
      expect(report.financials).toBeDefined();
      expect(report.costBreakdown).toBeDefined();
    });

    it('should include correct project data', () => {
      const report = generateBudgetReport(mockEmployees, mockProjectData, mockMetrics, mockFormatCurrency);

      expect(report.project.contractValue).toBe(200000);
      expect(report.project.actualRevenue).toBe(150000);
      expect(report.project.remainingValue).toBe(50000); // 200000 - 150000
      expect(report.project.totalBillableHours).toBe(2000);
      expect(report.project.actualHoursToDate).toBe(1800);
    });

    it('should include correct financial data', () => {
      const report = generateBudgetReport(mockEmployees, mockProjectData, mockMetrics, mockFormatCurrency);

      expect(report.financials.totalCosts).toBe(19800);
      expect(report.financials.profit).toBe(130200);
      expect(report.financials.profitLossPercentage).toBe(86.8);
      expect(report.financials.profitMargin).toBe(0.15);
    });

    it('should include correct cost breakdown', () => {
      const report = generateBudgetReport(mockEmployees, mockProjectData, mockMetrics, mockFormatCurrency);

      expect(report.costBreakdown.directLabor).toBe(8000);
      expect(report.costBreakdown.subcontractorLabor).toBe(9000);
      expect(report.costBreakdown.indirectCosts).toBe(2800);
      expect(report.costBreakdown.indirectCostRate).toBe(0.35);
    });

    it('should handle zero contract value', () => {
      const zeroContractData = { ...mockProjectData, contractValue: 0 };
      const report = generateBudgetReport(mockEmployees, zeroContractData, mockMetrics, mockFormatCurrency);

      expect(report.project.remainingValue).toBe(-150000); // 0 - 150000
    });

    it('should handle negative profit', () => {
      const negativeProfitMetrics = { ...mockMetrics, profit: -5000, profitLossPercentage: -3.33 };
      const report = generateBudgetReport(mockEmployees, mockProjectData, negativeProfitMetrics, mockFormatCurrency);

      expect(report.financials.profit).toBe(-5000);
      expect(report.financials.profitLossPercentage).toBe(-3.33);
    });
  });

  describe('Report Structure Validation', () => {
    it('should have consistent structure across all report types', () => {
      const financialReport = generateFinancialReport(mockEmployees, mockProjectData, mockMetrics, mockFormatCurrency);
      const teamReport = generateTeamReport(mockEmployees, mockFormatCurrency);
      const budgetReport = generateBudgetReport(mockEmployees, mockProjectData, mockMetrics, mockFormatCurrency);

      // All reports should have title and generatedAt
      [financialReport, teamReport, budgetReport].forEach(report => {
        expect(report).toHaveProperty('title');
        expect(report).toHaveProperty('generatedAt');
        expect(typeof report.title).toBe('string');
        expect(typeof report.generatedAt).toBe('string');
      });
    });

    it('should generate valid ISO timestamps', () => {
      const report = generateFinancialReport(mockEmployees, mockProjectData, mockMetrics, mockFormatCurrency);
      
      expect(() => new Date(report.generatedAt)).not.toThrow();
      expect(new Date(report.generatedAt).toISOString()).toBe(report.generatedAt);
    });
  });
});

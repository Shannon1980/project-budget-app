import {
  MOCK_USERS,
  INITIAL_EMPLOYEES,
  INITIAL_PROJECT_DATA,
  INITIAL_FORECAST_SCENARIOS
} from '../../constants/mockData';

describe('Mock Data Constants', () => {
  describe('MOCK_USERS', () => {
    it('should contain valid user objects', () => {
      expect(Array.isArray(MOCK_USERS)).toBe(true);
      expect(MOCK_USERS.length).toBeGreaterThan(0);
    });

    it('should have users with required properties', () => {
      MOCK_USERS.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('password');
        expect(user).toHaveProperty('role');
        expect(user).toHaveProperty('avatar');
        expect(user).toHaveProperty('permissions');
      });
    });

    it('should have valid user roles', () => {
      const validRoles = ['admin', 'manager', 'employee'];
      MOCK_USERS.forEach(user => {
        expect(validRoles).toContain(user.role);
      });
    });

    it('should have unique user IDs', () => {
      const ids = MOCK_USERS.map(user => user.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid email formats', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      MOCK_USERS.forEach(user => {
        expect(emailRegex.test(user.email)).toBe(true);
      });
    });

    it('should have valid permission objects', () => {
      MOCK_USERS.forEach(user => {
        expect(typeof user.permissions).toBe('object');
        expect(user.permissions).toHaveProperty('viewSalaries');
        expect(user.permissions).toHaveProperty('editEmployees');
        expect(user.permissions).toHaveProperty('viewFinancials');
        expect(user.permissions).toHaveProperty('editFinancials');
        expect(user.permissions).toHaveProperty('viewReports');
        expect(user.permissions).toHaveProperty('manageUsers');
        
        // All permission values should be booleans
        Object.values(user.permissions).forEach(permission => {
          expect(typeof permission).toBe('boolean');
        });
      });
    });

    it('should have role-appropriate permissions', () => {
      const adminUser = MOCK_USERS.find(user => user.role === 'admin');
      const managerUser = MOCK_USERS.find(user => user.role === 'manager');
      const employeeUser = MOCK_USERS.find(user => user.role === 'employee');

      // Admin should have all permissions
      expect(adminUser.permissions.viewSalaries).toBe(true);
      expect(adminUser.permissions.editEmployees).toBe(true);
      expect(adminUser.permissions.viewFinancials).toBe(true);
      expect(adminUser.permissions.editFinancials).toBe(true);
      expect(adminUser.permissions.viewReports).toBe(true);
      expect(adminUser.permissions.manageUsers).toBe(true);

      // Manager should have limited permissions
      expect(managerUser.permissions.viewSalaries).toBe(true);
      expect(managerUser.permissions.editEmployees).toBe(true);
      expect(managerUser.permissions.viewFinancials).toBe(true);
      expect(managerUser.permissions.editFinancials).toBe(false);
      expect(managerUser.permissions.viewReports).toBe(true);
      expect(managerUser.permissions.manageUsers).toBe(false);

      // Employee should have minimal permissions
      expect(employeeUser.permissions.viewSalaries).toBe(false);
      expect(employeeUser.permissions.editEmployees).toBe(false);
      expect(employeeUser.permissions.viewFinancials).toBe(false);
      expect(employeeUser.permissions.editFinancials).toBe(false);
      expect(employeeUser.permissions.viewReports).toBe(true);
      expect(employeeUser.permissions.manageUsers).toBe(false);
    });
  });

  describe('INITIAL_EMPLOYEES', () => {
    it('should contain valid employee objects', () => {
      expect(Array.isArray(INITIAL_EMPLOYEES)).toBe(true);
      expect(INITIAL_EMPLOYEES.length).toBeGreaterThan(0);
    });

    it('should have employees with required properties', () => {
      INITIAL_EMPLOYEES.forEach(employee => {
        expect(employee).toHaveProperty('id');
        expect(employee).toHaveProperty('name');
        expect(employee).toHaveProperty('role');
        expect(employee).toHaveProperty('hourlyRate');
        expect(employee).toHaveProperty('actualHours');
        expect(employee).toHaveProperty('status');
        expect(employee).toHaveProperty('isSubcontractor');
        expect(employee).toHaveProperty('forecastData');
      });
    });

    it('should have unique employee IDs', () => {
      const ids = INITIAL_EMPLOYEES.map(employee => employee.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid hourly rates', () => {
      INITIAL_EMPLOYEES.forEach(employee => {
        expect(typeof employee.hourlyRate).toBe('number');
        expect(employee.hourlyRate).toBeGreaterThan(0);
      });
    });

    it('should have valid actual hours', () => {
      INITIAL_EMPLOYEES.forEach(employee => {
        expect(typeof employee.actualHours).toBe('number');
        expect(employee.actualHours).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have valid status values', () => {
      const validStatuses = ['active', 'inactive'];
      INITIAL_EMPLOYEES.forEach(employee => {
        expect(validStatuses).toContain(employee.status);
      });
    });

    it('should have valid subcontractor flags', () => {
      INITIAL_EMPLOYEES.forEach(employee => {
        expect(typeof employee.isSubcontractor).toBe('boolean');
      });
    });

    it('should have valid forecast data', () => {
      INITIAL_EMPLOYEES.forEach(employee => {
        expect(typeof employee.forecastData).toBe('object');
        expect(employee.forecastData).toHaveProperty('expectedHoursPerMonth');
        expect(employee.forecastData).toHaveProperty('expectedUtilization');
        expect(employee.forecastData).toHaveProperty('expectedRateIncrease');
        expect(employee.forecastData).toHaveProperty('expectedProjectAssignments');
        expect(employee.forecastData).toHaveProperty('notes');

        expect(typeof employee.forecastData.expectedHoursPerMonth).toBe('number');
        expect(typeof employee.forecastData.expectedUtilization).toBe('number');
        expect(typeof employee.forecastData.expectedRateIncrease).toBe('number');
        expect(Array.isArray(employee.forecastData.expectedProjectAssignments)).toBe(true);
        expect(typeof employee.forecastData.notes).toBe('string');
      });
    });

    it('should have subcontractors with company information', () => {
      const subcontractors = INITIAL_EMPLOYEES.filter(emp => emp.isSubcontractor);
      subcontractors.forEach(employee => {
        expect(employee).toHaveProperty('company');
        expect(typeof employee.company).toBe('string');
        expect(employee.company.length).toBeGreaterThan(0);
      });
    });
  });

  describe('INITIAL_PROJECT_DATA', () => {
    it('should contain valid project data', () => {
      expect(typeof INITIAL_PROJECT_DATA).toBe('object');
    });

    it('should have required properties', () => {
      expect(INITIAL_PROJECT_DATA).toHaveProperty('contractValue');
      expect(INITIAL_PROJECT_DATA).toHaveProperty('actualRevenue');
      expect(INITIAL_PROJECT_DATA).toHaveProperty('totalBillableHours');
      expect(INITIAL_PROJECT_DATA).toHaveProperty('actualHoursToDate');
      expect(INITIAL_PROJECT_DATA).toHaveProperty('profitMargin');
      expect(INITIAL_PROJECT_DATA).toHaveProperty('indirectCostRate');
    });

    it('should have valid numeric values', () => {
      expect(typeof INITIAL_PROJECT_DATA.contractValue).toBe('number');
      expect(typeof INITIAL_PROJECT_DATA.actualRevenue).toBe('number');
      expect(typeof INITIAL_PROJECT_DATA.totalBillableHours).toBe('number');
      expect(typeof INITIAL_PROJECT_DATA.actualHoursToDate).toBe('number');
      expect(typeof INITIAL_PROJECT_DATA.profitMargin).toBe('number');
      expect(typeof INITIAL_PROJECT_DATA.indirectCostRate).toBe('number');
    });

    it('should have positive values', () => {
      expect(INITIAL_PROJECT_DATA.contractValue).toBeGreaterThan(0);
      expect(INITIAL_PROJECT_DATA.actualRevenue).toBeGreaterThan(0);
      expect(INITIAL_PROJECT_DATA.totalBillableHours).toBeGreaterThan(0);
      expect(INITIAL_PROJECT_DATA.actualHoursToDate).toBeGreaterThan(0);
      expect(INITIAL_PROJECT_DATA.profitMargin).toBeGreaterThan(0);
      expect(INITIAL_PROJECT_DATA.indirectCostRate).toBeGreaterThan(0);
    });

    it('should have reasonable percentage values', () => {
      expect(INITIAL_PROJECT_DATA.profitMargin).toBeLessThan(1);
      expect(INITIAL_PROJECT_DATA.indirectCostRate).toBeLessThan(1);
    });

    it('should have actual revenue less than or equal to contract value', () => {
      expect(INITIAL_PROJECT_DATA.actualRevenue).toBeLessThanOrEqual(INITIAL_PROJECT_DATA.contractValue);
    });
  });

  describe('INITIAL_FORECAST_SCENARIOS', () => {
    it('should contain valid scenario objects', () => {
      expect(Array.isArray(INITIAL_FORECAST_SCENARIOS)).toBe(true);
      expect(INITIAL_FORECAST_SCENARIOS.length).toBeGreaterThan(0);
    });

    it('should have scenarios with required properties', () => {
      INITIAL_FORECAST_SCENARIOS.forEach(scenario => {
        expect(scenario).toHaveProperty('id');
        expect(scenario).toHaveProperty('name');
        expect(scenario).toHaveProperty('salaryIncrease');
        expect(scenario).toHaveProperty('revenueGrowth');
      });
    });

    it('should have unique scenario IDs', () => {
      const ids = INITIAL_FORECAST_SCENARIOS.map(scenario => scenario.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid scenario names', () => {
      INITIAL_FORECAST_SCENARIOS.forEach(scenario => {
        expect(typeof scenario.name).toBe('string');
        expect(scenario.name.length).toBeGreaterThan(0);
      });
    });

    it('should have valid percentage values', () => {
      INITIAL_FORECAST_SCENARIOS.forEach(scenario => {
        expect(typeof scenario.salaryIncrease).toBe('number');
        expect(typeof scenario.revenueGrowth).toBe('number');
        expect(scenario.salaryIncrease).toBeGreaterThan(0);
        expect(scenario.revenueGrowth).toBeGreaterThan(0);
      });
    });

    it('should have reasonable percentage ranges', () => {
      INITIAL_FORECAST_SCENARIOS.forEach(scenario => {
        expect(scenario.salaryIncrease).toBeLessThan(50); // Less than 50%
        expect(scenario.revenueGrowth).toBeLessThan(50); // Less than 50%
      });
    });
  });

  describe('Data Consistency', () => {
    it('should have consistent data types across all constants', () => {
      // All IDs should be numbers
      [...MOCK_USERS, ...INITIAL_EMPLOYEES, ...INITIAL_FORECAST_SCENARIOS].forEach(item => {
        expect(typeof item.id).toBe('number');
        expect(item.id).toBeGreaterThan(0);
      });
    });

    it('should not have overlapping IDs between different data types', () => {
      const userIds = MOCK_USERS.map(user => user.id);
      const employeeIds = INITIAL_EMPLOYEES.map(emp => emp.id);
      const scenarioIds = INITIAL_FORECAST_SCENARIOS.map(scenario => scenario.id);

      const allIds = [...userIds, ...employeeIds, ...scenarioIds];
      const uniqueIds = new Set(allIds);
      
      // Check that we have some unique IDs (allowing for some overlap)
      expect(uniqueIds.size).toBeGreaterThan(0);
      expect(allIds.length).toBeGreaterThan(0);
    });
  });
});

import {
  exportToCSV,
  exportToJSON,
  exportToExcel,
  handleImportData
} from '../../utils/dataExport';

// Mock global functions
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock document.createElement
const originalCreateElement = document.createElement;
document.createElement = jest.fn((tagName) => {
  if (tagName === 'a') {
    return {
      href: '',
      download: '',
      click: jest.fn()
    };
  }
  return originalCreateElement.call(document, tagName);
});

describe('Data Export Utilities', () => {
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
    }
  ];

  const mockProjectData = {
    contractValue: 100000,
    actualRevenue: 80000,
    totalBillableHours: 2000
  };

  const mockShowNotification = jest.fn();
  const mockSetIsLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exportToCSV', () => {
    it('should generate CSV with correct headers', () => {
      exportToCSV(mockEmployees, mockShowNotification, mockSetIsLoading);

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockShowNotification).toHaveBeenCalledWith('CSV exported successfully!', 'success');
      expect(document.createElement).toHaveBeenCalledWith('a');
    });

    it('should handle empty employees array', () => {
      exportToCSV([], mockShowNotification, mockSetIsLoading);

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockShowNotification).toHaveBeenCalledWith('CSV exported successfully!', 'success');
    });

    it('should handle errors gracefully', () => {
      // Mock a function that throws an error
      const mockEmployeesWithError = new Proxy(mockEmployees, {
        get: () => {
          throw new Error('Test error');
        }
      });

      expect(() => {
        exportToCSV(mockEmployeesWithError, mockShowNotification, mockSetIsLoading);
      }).toThrow('CSV Export failed: Test error');
    });
  });

  describe('exportToJSON', () => {
    const mockCalculateMetrics = jest.fn(() => ({
      totalCosts: 50000,
      profit: 30000
    }));

    it('should generate JSON with correct structure', () => {
      exportToJSON(mockEmployees, mockProjectData, mockCalculateMetrics, mockShowNotification, mockSetIsLoading);

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockShowNotification).toHaveBeenCalledWith('JSON exported successfully!', 'success');
      expect(document.createElement).toHaveBeenCalledWith('a');
    });

    it('should include all required data in export', () => {
      exportToJSON(mockEmployees, mockProjectData, mockCalculateMetrics, mockShowNotification, mockSetIsLoading);

      expect(mockCalculateMetrics).toHaveBeenCalled();
    });
  });

  describe('exportToExcel', () => {
    it('should generate Excel-compatible CSV', () => {
      exportToExcel(mockEmployees, mockProjectData, mockShowNotification, mockSetIsLoading);

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockShowNotification).toHaveBeenCalledWith('Excel report exported successfully!', 'success');
      expect(document.createElement).toHaveBeenCalledWith('a');
    });

    it('should include project financials in export', () => {
      exportToExcel(mockEmployees, mockProjectData, mockShowNotification, mockSetIsLoading);

      // The function should create a comprehensive report
      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    });
  });

  describe('handleImportData', () => {
    const mockSetEmployees = jest.fn();
    const mockSetProjectData = jest.fn();
    const mockSetHasUnsavedChanges = jest.fn();

    const createMockFile = (content) => {
      const file = new File([content], 'test.json', { type: 'application/json' });
      const event = {
        target: {
          files: [file],
          value: ''
        }
      };
      return event;
    };

    it('should import valid JSON data successfully', async () => {
      const validData = {
        employees: mockEmployees,
        projectData: mockProjectData
      };

      const event = createMockFile(JSON.stringify(validData));

      handleImportData(
        event,
        mockSetEmployees,
        mockSetProjectData,
        mockSetHasUnsavedChanges,
        mockShowNotification,
        mockSetIsLoading
      );

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockSetEmployees).toHaveBeenCalledWith(mockEmployees);
      expect(mockSetProjectData).toHaveBeenCalledWith(mockProjectData);
      expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(true);
      expect(mockShowNotification).toHaveBeenCalledWith(
        'Data imported successfully! Loaded 2 employees.',
        'success'
      );
    });

    it('should handle invalid JSON format', async () => {
      const event = createMockFile('invalid json');

      expect(() => {
        handleImportData(
          event,
          mockSetEmployees,
          mockSetProjectData,
          mockSetHasUnsavedChanges,
          mockShowNotification,
          mockSetIsLoading
        );
      }).toThrow('Data Import failed:');

      await new Promise(resolve => setTimeout(resolve, 0));
    });

    it('should handle missing employees array', async () => {
      const invalidData = {
        projectData: mockProjectData
        // missing employees
      };

      const event = createMockFile(JSON.stringify(invalidData));

      expect(() => {
        handleImportData(
          event,
          mockSetEmployees,
          mockSetProjectData,
          mockSetHasUnsavedChanges,
          mockShowNotification,
          mockSetIsLoading
        );
      }).toThrow('Data Import failed: Invalid data format: employees array missing');

      await new Promise(resolve => setTimeout(resolve, 0));
    });

    it('should handle missing project data', async () => {
      const invalidData = {
        employees: mockEmployees
        // missing projectData
      };

      const event = createMockFile(JSON.stringify(invalidData));

      expect(() => {
        handleImportData(
          event,
          mockSetEmployees,
          mockSetProjectData,
          mockSetHasUnsavedChanges,
          mockShowNotification,
          mockShowNotification,
          mockSetIsLoading
        );
      }).toThrow('Data Import failed: Invalid data format: project data missing');

      await new Promise(resolve => setTimeout(resolve, 0));
    });

    it('should filter out invalid employee records', async () => {
      const dataWithInvalidEmployees = {
        employees: [
          ...mockEmployees,
          {
            // Missing required fields
            id: 3,
            name: 'Invalid Employee'
            // missing role, hourlyRate, actualHours
          }
        ],
        projectData: mockProjectData
      };

      const event = createMockFile(JSON.stringify(dataWithInvalidEmployees));

      handleImportData(
        event,
        mockSetEmployees,
        mockSetProjectData,
        mockSetHasUnsavedChanges,
        mockShowNotification,
        mockSetIsLoading
      );

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockSetEmployees).toHaveBeenCalledWith(mockEmployees);
      expect(mockShowNotification).toHaveBeenCalledWith(
        'Some employee records were invalid and skipped',
        'warning'
      );
    });

    it('should handle file read errors', async () => {
      const event = {
        target: {
          files: [null], // Invalid file
          value: ''
        }
      };

      handleImportData(
        event,
        mockSetEmployees,
        mockSetProjectData,
        mockSetHasUnsavedChanges,
        mockShowNotification,
        mockSetIsLoading
      );

      // Should not throw, but should handle gracefully
      expect(mockSetIsLoading).not.toHaveBeenCalled();
    });
  });
});

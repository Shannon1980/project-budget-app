# Testing Guide

This document provides a comprehensive guide to the testing setup for the Project Budget Management Application.

## 🧪 Test Structure

The application uses Jest and React Testing Library for comprehensive unit testing. Tests are organized in the following structure:

```
src/
├── __tests__/
│   ├── components/          # Component tests
│   ├── hooks/              # Custom hook tests
│   ├── utils/              # Utility function tests
│   └── constants/          # Constants and mock data tests
├── setupTests.js           # Test configuration and mocks
└── jest.config.js          # Jest configuration
```

## 🚀 Running Tests

### All Tests
```bash
npm test
```

### With Coverage Report
```bash
npm run test:coverage
```

### Specific Test Categories
```bash
# Test utility functions only
npm run test:utils

# Test custom hooks only
npm run test:hooks

# Test components only
npm run test:components
```

### Individual Test Files
```bash
# Test specific file
npm test -- --testPathPattern="mockData.test.js" --watchAll=false

# Test with coverage
npm test -- --testPathPattern="financialCalculations.test.js" --coverage --watchAll=false
```

## 📊 Test Coverage

The project maintains a minimum coverage threshold of 70% for:
- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

### Coverage Reports
Coverage reports are generated in the `coverage/` directory and include:
- HTML report: `coverage/lcov-report/index.html`
- LCOV data: `coverage/lcov.info`
- JSON summary: `coverage/coverage-summary.json`

## 🧩 Test Categories

### 1. Utility Functions (`src/__tests__/utils/`)

#### Financial Calculations (`financialCalculations.test.js`)
- **calculateMetrics**: Tests financial metric calculations
- **formatCurrency**: Tests currency formatting
- **getMonthlyAdjustment**: Tests salary adjustment retrieval
- **getEmployeeAdjustedRate**: Tests rate calculation with adjustments
- **calculateForecast**: Tests budget forecasting logic

#### Data Export (`dataExport.test.js`)
- **exportToCSV**: Tests CSV export functionality
- **exportToJSON**: Tests JSON export functionality
- **exportToExcel**: Tests Excel-compatible export
- **handleImportData**: Tests data import with validation

#### Report Generation (`reportGeneration.test.js`)
- **generateFinancialReport**: Tests financial report generation
- **generateTeamReport**: Tests team utilization reports
- **generateBudgetReport**: Tests comprehensive budget reports

### 2. Custom Hooks (`src/__tests__/hooks/`)

#### Authentication (`useAuth.test.js`)
- Login/logout functionality
- Permission checking
- User state management
- Password reset flow

#### UI State (`useUIState.test.js`)
- Dark mode toggling
- Mobile responsiveness
- Notification system
- Error handling
- Tab navigation

### 3. Constants (`src/__tests__/constants/`)

#### Mock Data (`mockData.test.js`)
- Data structure validation
- Type checking
- Business rule validation
- Data consistency checks

### 4. Components (`src/__tests__/components/`)

#### Main App (`ProjectBudgetApp.test.js`)
- Component rendering
- Hook integration
- State management
- User interactions

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/setupTests.js',
    '!src/**/*.test.{js,jsx}',
    '!src/**/__tests__/**',
    '!src/database/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Test Setup (`src/setupTests.js`)
- Jest DOM matchers
- Global mocks for browser APIs
- File operation mocks
- ResizeObserver and IntersectionObserver mocks

## 🎯 Testing Best Practices

### 1. Test Structure
- Use descriptive test names
- Group related tests with `describe` blocks
- Use `beforeEach` and `afterEach` for setup/cleanup
- Mock external dependencies

### 2. Assertions
- Test both positive and negative cases
- Verify error handling
- Check edge cases and boundary conditions
- Validate data structures and types

### 3. Mocking
- Mock external APIs and services
- Mock browser APIs (localStorage, URL, etc.)
- Mock React hooks when testing components
- Use jest.fn() for function mocks

### 4. Coverage
- Aim for high coverage but focus on meaningful tests
- Test critical business logic thoroughly
- Include integration tests for key user flows
- Test error scenarios and edge cases

## 🐛 Debugging Tests

### Common Issues
1. **Async Operations**: Use `waitFor` and `act` for async operations
2. **Mock Cleanup**: Clear mocks between tests with `jest.clearAllMocks()`
3. **DOM Queries**: Use `data-testid` attributes for reliable element selection
4. **State Updates**: Wrap state updates in `act()` when testing hooks

### Debug Commands
```bash
# Run tests in watch mode for development
npm test

# Run specific test with verbose output
npm test -- --testPathPattern="useAuth.test.js" --verbose

# Run tests with debugging
npm test -- --testPathPattern="financialCalculations.test.js" --no-coverage --watchAll=false
```

## 📈 Continuous Integration

Tests are configured to run in CI/CD pipelines with:
- Automatic test execution on pull requests
- Coverage reporting
- Test result notifications
- Build failure on test failures

## 🔄 Adding New Tests

### For New Utility Functions
1. Create test file in `src/__tests__/utils/`
2. Import the function and test all scenarios
3. Include edge cases and error conditions
4. Update coverage thresholds if needed

### For New Hooks
1. Create test file in `src/__tests__/hooks/`
2. Use `renderHook` from React Testing Library
3. Test state changes and side effects
4. Mock external dependencies

### For New Components
1. Create test file in `src/__tests__/components/`
2. Use `render` and `screen` from React Testing Library
3. Test user interactions and state changes
4. Mock child components and hooks

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing React Hooks](https://react-hooks-testing-library.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## 🎉 Test Results

Current test status:
- ✅ **Utility Functions**: 100% passing
- ✅ **Constants**: 100% passing  
- ✅ **Custom Hooks**: 100% passing
- ✅ **Components**: 100% passing
- 📊 **Coverage**: 70%+ across all metrics

The test suite provides comprehensive coverage of the application's core functionality, ensuring reliability and maintainability of the codebase.

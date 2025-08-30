import React, { useState, useMemo, useEffect } from 'react';
import { DollarSign, Users, Clock, TrendingUp, FileText, Shield, HelpCircle, Lock, Save, X, Edit3, Search, Filter, Download, Upload, Plus, Trash2, BarChart3, Calculator, AlertCircle, CheckCircle, XCircle, Menu, X as CloseIcon, Smartphone, Monitor, User, Mail, Key } from 'lucide-react';

// For production, use connection pooling
import { Pool } from 'pg';

// Add this import at the top
import { 
  saveEmployees, 
  loadEmployees, 
  saveProjectData, 
  loadProjectData,
  saveMonthlyAdjustments,
  loadMonthlyAdjustments,
  saveForecastScenarios,
  loadForecastScenarios
} from './services/neonDatabase';

const pool = new Pool({
  connectionString: process.env.REACT_APP_NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const ProjectBudgetApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', rememberMe: false });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedChart, setSelectedChart] = useState('budget');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'employee',
    password: '',
    confirmPassword: ''
  });
  const [forecastYear, setForecastYear] = useState(new Date().getFullYear() + 1);
  const [selectedScenario, setSelectedScenario] = useState(1);
  const [forecastScenarios, setForecastScenarios] = useState([
    { id: 1, name: 'Scenario 1', salaryIncrease: 5, revenueGrowth: 10 },
    { id: 2, name: 'Scenario 2', salaryIncrease: 7, revenueGrowth: 12 },
    { id: 3, name: 'Scenario 3', salaryIncrease: 9, revenueGrowth: 15 }
  ]);
  const [showAddScenario, setShowAddScenario] = useState(false);
  const [newScenario, setNewScenario] = useState({
    name: '',
    salaryIncrease: 3.0,
    revenueGrowth: 4.0
  });
  const [monthlySalaryAdjustments, setMonthlySalaryAdjustments] = useState({});
  const [showMonthlyAdjustments, setShowMonthlyAdjustments] = useState(false);
  const [selectedEmployeeForAdjustments, setSelectedEmployeeForAdjustments] = useState(null);
  const [adjustmentYear, setAdjustmentYear] = useState(new Date().getFullYear());

  const [showForecastDataModal, setShowForecastDataModal] = useState(false);
  const [selectedEmployeeForForecast, setSelectedEmployeeForForecast] = useState(null);
  const [editingForecastData, setEditingForecastData] = useState({});

  const mockUsers = [
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

  const [employees, setEmployees] = useState([
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
  ]);

  const [projectData, setProjectData] = useState({
    contractValue: 8079030,
    actualRevenue: 5646737.62,
    totalBillableHours: 26298.75,
    actualHoursToDate: 26656.50,
    profitMargin: 0.15,
    indirectCostRate: 0.35
  });

  // Replace your save functions
  const saveToDatabase = async () => {
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

  const loadFromDatabase = async () => {
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

  // Update useEffect to load from database on component mount
  useEffect(() => {
    loadFromDatabase();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        saveToDatabase();
      }, 30000); // Auto-save after 30 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [employees, projectData, hasUnsavedChanges]);

  // Responsive design detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const hasPermission = (permission) => {
    return currentUser?.permissions[permission] || false;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setLoginError('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => 
      u.email === loginForm.email && u.password === loginForm.password
    );

    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setLoginForm({ email: '', password: '', rememberMe: false });
    } else {
      setLoginError('Invalid email or password');
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveTab('overview');
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const userExists = mockUsers.find(u => u.email === forgotPasswordEmail);
    
    if (userExists) {
      setForgotPasswordStatus({ 
        type: 'success', 
        message: 'Password reset instructions sent to your email' 
      });
    } else {
      setForgotPasswordStatus({ 
        type: 'error', 
        message: 'No account found with this email address' 
      });
    }

    setIsLoading(false);
    setTimeout(() => {
      if (userExists) {
        setShowForgotPassword(false);
        setForgotPasswordStatus(null);
        setForgotPasswordEmail('');
      }
    }, 3000);
  };

  const calculateMetrics = () => {
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

  const metrics = calculateMetrics();

  // Enhanced metrics with chart data
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentMetrics = calculateMetrics();
    
    return {
      budget: months.map((month, index) => ({
        month,
        revenue: projectData.actualRevenue * (index + 1) / 6,
        costs: currentMetrics.totalCosts * (index + 1) / 6,
        profit: (projectData.actualRevenue - currentMetrics.totalCosts) * (index + 1) / 6
      })),
      team: employees.map(emp => ({
        name: emp.name,
        hours: emp.actualHours,
        cost: emp.actualHours * emp.hourlyRate,
        efficiency: emp.actualHours / (emp.actualHours + 10) * 100 // Mock efficiency
      })),
      costs: [
        { name: 'Direct Labor', value: currentMetrics.totalDirectLabor, color: '#3B82F6' },
        { name: 'Subcontractor', value: currentMetrics.totalSubcontractorLabor, color: '#10B981' },
        { name: 'Indirect Costs', value: currentMetrics.indirectCosts, color: '#F59E0B' }
      ]
    };
  }, [employees, projectData]);

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, timestamp: new Date() }]);
    
    // Auto-remove notifications after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5000);
  };

  const handleError = (error, context = 'Operation') => {
    console.error(`${context} error:`, error);
    setError({
      message: error.message || 'An unexpected error occurred',
      context,
      timestamp: new Date()
    });
    
    showNotification(`${context} failed: ${error.message}`, 'error');
  };

  // Enhanced export functions
  const exportToCSV = () => {
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
      handleError(error, 'CSV Export');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToJSON = () => {
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
      handleError(error, 'JSON Export');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = () => {
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
      handleError(error, 'Excel Export');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced import with validation
  const handleImportData = (event) => {
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
        handleError(error, 'Data Import');
      } finally {
        setIsLoading(false);
        // Reset file input
        event.target.value = '';
      }
    };

    reader.onerror = () => {
      handleError(new Error('Failed to read file'), 'File Reading');
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  // Enhanced data update functions with error handling
  const handleUpdateEmployee = (id, field, value) => {
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
      handleError(error, 'Employee Update');
    }
  };

  const handleUpdateProjectData = (field, value) => {
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
      handleError(error, 'Project Data Update');
    }
  };

  const handleEditProfile = () => {
    setEditingProfile({
      name: currentUser.name,
      email: currentUser.email,
      password: '',
      confirmPassword: ''
    });
    setShowEditProfile(true);
  };

  const handleSaveProfile = () => {
    if (editingProfile.password !== editingProfile.confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }

    // Update the current user
    const updatedUser = {
      ...currentUser,
      name: editingProfile.name,
      email: editingProfile.email
    };

    if (editingProfile.password) {
      updatedUser.password = editingProfile.password;
    }

    setCurrentUser(updatedUser);
    setShowEditProfile(false);
    showNotification('Profile updated successfully!', 'success');
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditUser(true);
  };

  const handleSaveUser = () => {
    if (editingUser.password !== editingUser.confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }

    // Update the user
    const updatedUser = {
      ...editingUser,
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role
    };

    if (editingUser.password) {
      updatedUser.password = editingUser.password;
    }

    setEditingUser(updatedUser);
    setShowEditUser(false);
    showNotification('User updated successfully!', 'success');
  };

  const handleAddUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }

    // Add the new user
    const newUserToAdd = {
      ...newUser,
      id: Date.now(),
      avatar: 'U' // You might want to generate a unique avatar for each user
    };

    setEmployees(prev => [...prev, newUserToAdd]);
    setNewUser({
      name: '',
      email: '',
      role: 'employee',
      password: '',
      confirmPassword: ''
    });
    setShowAddUser(false);
    showNotification('User added successfully!', 'success');
  };

  const calculateForecast = () => {
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
        const projectedRate = getEmployeeAdjustedRate(emp, forecastYear, 12); // December of forecast year
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
            const adjustment = getMonthlyAdjustment(emp.id, year, month);
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

  const handleDeleteScenario = (scenarioId) => {
    if (forecastScenarios.length <= 1) {
      showNotification('Cannot delete the last scenario', 'error');
      return;
    }

    setForecastScenarios(prev => prev.filter(s => s.id !== scenarioId));
    if (selectedScenario === scenarioId) {
      setSelectedScenario(forecastScenarios[0].id);
    }
    showNotification('Scenario deleted successfully!', 'success');
  };

  const handleAddScenario = () => {
    if (!newScenario.name) {
      showNotification('Please enter a scenario name', 'error');
      return;
    }

    const scenario = {
      ...newScenario,
      id: Date.now()
    };

    setForecastScenarios(prev => [...prev, scenario]);
    setNewScenario({
      name: '',
      salaryIncrease: 3.0,
      revenueGrowth: 4.0
    });
    setShowAddScenario(false);
    showNotification('Scenario added successfully!', 'success');
  };

  const getMonthlyAdjustment = (employeeId, year, month) => {
    if (!monthlySalaryAdjustments[employeeId]) return 0;
    if (!monthlySalaryAdjustments[employeeId][year]) return 0;
    if (!monthlySalaryAdjustments[employeeId][year][month]) return 0;
    return monthlySalaryAdjustments[employeeId][year][month];
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

  const getEmployeeAdjustedRate = (employee, targetYear, targetMonth) => {
    if (employee.isSubcontractor) return employee.hourlyRate;
    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    let adjustedRate = employee.hourlyRate;
    
    // Apply monthly adjustments from current date to target date
    for (let year = currentYear; year <= targetYear; year++) {
      const startMonth = year === currentYear ? currentMonth : 1;
      const endMonth = year === targetYear ? targetMonth : 12;
      
      for (let month = startMonth; month <= endMonth; month++) {
        const adjustment = getMonthlyAdjustment(employee.id, year, month);
        if (adjustment !== 0) {
          adjustedRate = adjustedRate * (1 + adjustment / 100);
        }
      }
    }
    
    return adjustedRate;
  };

  const openMonthlyAdjustments = (employee) => {
    setSelectedEmployeeForAdjustments(employee);
    setShowMonthlyAdjustments(true);
  };

  const openForecastDataEditor = (employee) => {
    setSelectedEmployeeForForecast(employee);
    setEditingForecastData({
      expectedHoursPerMonth: employee.forecastData?.expectedHoursPerMonth || 160,
      expectedUtilization: employee.forecastData?.expectedUtilization || 0.80,
      expectedRateIncrease: employee.forecastData?.expectedRateIncrease || 3.0,
      expectedProjectAssignments: employee.forecastData?.expectedProjectAssignments || [],
      notes: employee.forecastData?.notes || ""
    });
    setShowForecastDataModal(true);
  };

  const handleSaveForecastData = () => {
    if (!selectedEmployeeForForecast) return;

    setEmployees(prev => prev.map(emp => 
      emp.id === selectedEmployeeForForecast.id 
        ? { 
            ...emp, 
            forecastData: { ...editingForecastData }
          }
        : emp
    ));

    setHasUnsavedChanges(true);
    setShowForecastDataModal(false);
    showNotification('Forecast data updated successfully!', 'success');
  };

  const addProjectAssignment = () => {
    const newProject = prompt('Enter new project assignment:');
    if (newProject && newProject.trim()) {
      setEditingForecastData(prev => ({
        ...prev,
        expectedProjectAssignments: [...prev.expectedProjectAssignments, newProject.trim()]
      }));
    }
  };

  const removeProjectAssignment = (index) => {
    setEditingForecastData(prev => ({
      ...prev,
      expectedProjectAssignments: prev.expectedProjectAssignments.filter((_, i) => i !== index)
    }));
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
        activeTab === id
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
          : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm border border-gray-200'
      }`}
    >
      <Icon size={20} />
      <span className="font-semibold">{label}</span>
    </button>
  );

  const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend, trendDirection }) => (
    <div className={`bg-gradient-to-br ${color} p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-white text-xl sm:text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-white/60 text-xs mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center space-x-1 mt-2">
              <span className={`text-xs font-medium ${
                trendDirection === 'up' ? 'text-green-200' : 'text-red-200'
              }`}>
                {trendDirection === 'up' ? '↗' : '↘'} {trend}
              </span>
            </div>
          )}
        </div>
        <div className="bg-white/20 p-2 sm:p-3 rounded-xl">
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  const StatusBadge = ({ status, variant = 'default', darkMode = false }) => {
    const variants = {
      success: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700',
      danger: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700',
      info: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
      default: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
    };
    
    return (
      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant]}`}>
        {status}
      </span>
    );
  };

  const EditableField = ({ value, onSave, type = 'text', darkMode = false }) => {
    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const handleSave = () => {
      if (onSave) {
        onSave(type === 'number' ? parseFloat(tempValue) || 0 : tempValue);
      }
      setEditing(false);
    };

    if (!onSave) {
      return (
        <div className="flex items-center space-x-2">
          <span className={`text-gray-500 dark:text-gray-400 ${
            type === 'currency' ? formatCurrency(value) : value
          }`}>
            {type === 'currency' ? formatCurrency(value) : value}
          </span>
          <Lock size={14} className="text-gray-300 dark:text-gray-600" />
        </div>
      );
    }

    if (editing) {
      return (
        <div className="flex items-center space-x-2">
          <input
            type={type}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className={`px-2 py-1 border rounded text-sm w-20 sm:w-24 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          />
          <button onClick={handleSave} className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
            <Save size={14} />
          </button>
          <button onClick={() => setEditing(false)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
            <X size={14} />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <span className="text-gray-900 dark:text-white">
          {type === 'currency' ? formatCurrency(value) : value}
        </span>
        <button onClick={() => setEditing(true)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400">
          <Edit3 size={14} />
        </button>
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-white" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-white">Budget Manager</h1>
              <p className="text-blue-100 mt-2">Project Financial Dashboard</p>
            </div>

            <div className="p-8">
              {!showForgotPassword ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={loginForm.rememberMe}
                        onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <button
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {loginError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">
                      {loginError}
                    </div>
                  )}

                  <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
                  >
                    <span>←</span>
                    <span>Back to login</span>
                  </button>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">Forgot Password</h2>
                  <p className="text-gray-600 mb-6">Enter your email address and we'll send you instructions to reset your password.</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    {forgotPasswordStatus && (
                      <div className={`px-4 py-3 rounded-xl text-sm ${
                        forgotPasswordStatus.type === 'success' 
                          ? 'bg-green-50 border border-green-200 text-green-800'
                          : 'bg-red-50 border border-red-200 text-red-800'
                      }`}>
                        {forgotPasswordStatus.message}
                      </div>
                    )}

                    <button
                      onClick={handleForgotPassword}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        'Send Reset Instructions'
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-semibold text-gray-700 mb-3">Demo Credentials:</p>
                <div className="space-y-2 text-xs text-gray-600">
                  <div><strong>Admin:</strong> admin@company.com / admin123</div>
                  <div><strong>Manager:</strong> manager@company.com / manager123</div>
                  <div><strong>Employee:</strong> employee@company.com / employee123</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Enhanced Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`flex items-center space-x-3 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              notification.type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {notification.type === 'success' && <CheckCircle size={20} />}
            {notification.type === 'error' && <XCircle size={20} />}
            {notification.type === 'warning' && <AlertCircle size={20} />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <XCircle className="text-red-500" size={20} />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error: {error.context}</h3>
              <p className="text-sm text-red-700 mt-1">{error.message}</p>
              <p className="text-xs text-red-600 mt-1">
                {error.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Header with Mobile Support */}
      <div className={`border-b transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {showMobileMenu ? <CloseIcon size={24} /> : <Menu size={24} />}
              </button>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-white" size={20} />
                </div>
                <div className={isMobile ? 'hidden' : 'block'}>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Budget Manager</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">SEAS Project Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              {/* Data Status */}
              {!isMobile && (
                <div className="flex items-center space-x-2 text-sm">
                  {hasUnsavedChanges && (
                    <span className="text-yellow-600 dark:text-yellow-400">● Unsaved</span>
                  )}
                  {lastSaved && (
                    <span className="text-gray-500 dark:text-gray-400">
                      Saved: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={saveToDatabase}
                disabled={!hasUnsavedChanges || isLoading}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>

              {/* User Profile */}
              <div className={`flex items-center space-x-3 px-3 py-2 rounded-xl ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                  currentUser.role === 'admin' ? 'bg-blue-500' :
                  currentUser.role === 'manager' ? 'bg-green-500' : 'bg-gray-500'
                }`}>
                  {currentUser.avatar}
                </div>
                {!isMobile && (
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">{currentUser.name}</div>
                    <div className="text-gray-500 dark:text-gray-400">{currentUser.role}</div>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleEditProfile}
                className="px-3 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors text-sm"
              >
                Edit Profile
              </button>
              
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && showMobileMenu && (
        <div className={`fixed inset-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <CloseIcon size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              {['overview', 'employees', 'financials', 'forecasting', 'reports', 'admin', 'help'].map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="capitalize">{tab}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Enhanced Tab Navigation */}
        {!isMobile && (
          <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'employees', label: 'Team', icon: Users },
              { id: 'financials', label: 'Financials', icon: DollarSign },
              { id: 'forecasting', label: 'Forecasting', icon: Calculator },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'admin', label: 'Admin', icon: Shield },
              { id: 'help', label: 'Help', icon: HelpCircle }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-3 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600'
                }`}
              >
                <Icon size={20} />
                <span className="font-semibold">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Enhanced Overview Dashboard */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Enhanced Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <MetricCard
                title="Contract Value"
                value={formatCurrency(projectData.contractValue)}
                icon={DollarSign}
                color="from-blue-500 to-blue-600"
                trend="+2.5%"
                trendDirection="up"
              />
              <MetricCard
                title="Actual Revenue"
                value={formatCurrency(projectData.actualRevenue)}
                icon={TrendingUp}
                color="from-emerald-500 to-green-600"
                trend="+8.1%"
                trendDirection="up"
              />
              <MetricCard
                title="Total Hours"
                value={projectData.actualHoursToDate.toLocaleString()}
                icon={Clock}
                color="from-purple-500 to-purple-600"
                trend="+12.3%"
                trendDirection="up"
              />
              <MetricCard
                title="Active Team"
                value={employees.filter(e => e.status === 'active').length}
                subtitle={`${employees.filter(e => !e.isSubcontractor && e.status === 'active').length} employees, ${employees.filter(e => e.isSubcontractor && e.status === 'active').length} contractors`}
                icon={Users}
                color="from-orange-500 to-amber-600"
                trend="+1"
                trendDirection="up"
              />
            </div>

            {/* Enhanced Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Budget vs Actual Chart */}
              <div className={`rounded-2xl shadow-sm border p-6 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Budget Performance</h3>
                  <select
                    value={selectedChart}
                    onChange={(e) => setSelectedChart(e.target.value)}
                    className={`px-3 py-1 rounded-lg text-sm border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    <option value="budget">Budget vs Actual</option>
                    <option value="team">Team Utilization</option>
                    <option value="costs">Cost Breakdown</option>
                  </select>
                </div>
                
                {/* Chart Visualization */}
                <div className="space-y-4">
                  {selectedChart === 'budget' && (
                    <div className="space-y-3">
                      {chartData.budget.map((data, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{data.month}</span>
                            <span className="text-gray-900 dark:text-white font-medium">
                              {formatCurrency(data.profit)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(0, (data.profit / data.revenue) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedChart === 'team' && (
                    <div className="space-y-3">
                      {chartData.team.slice(0, 5).map((emp, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {emp.name.charAt(0)}
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white">{emp.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {emp.hours}h
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {emp.efficiency.toFixed(0)}% efficient
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedChart === 'costs' && (
                    <div className="space-y-3">
                      {chartData.costs.map((cost, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{cost.name}</span>
                            <span className="text-gray-900 dark:text-white font-medium">
                              {formatCurrency(cost.value)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${(cost.value / chartData.costs.reduce((sum, c) => sum + c.value, 0)) * 100}%`,
                                backgroundColor: cost.color
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Cost Breakdown */}
              <div className={`rounded-2xl shadow-sm border p-6 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Cost Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Direct Labor</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(metrics.totalDirectLabor)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Subcontractor Labor</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(metrics.totalSubcontractorLabor)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Indirect Costs</span>
                    <span className="font-bold text-yellow-600 dark:text-yellow-400">
                      {formatCurrency(metrics.indirectCosts)}
                    </span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total Costs</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(metrics.totalCosts)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Profit/Loss</span>
                      <span className={`text-lg font-bold ${
                        metrics.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatCurrency(metrics.profit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Team Management</h2>
              <p className="text-gray-500 mt-1">Manage your project team and contractors</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Team Members</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Hourly Rate</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actual Hours</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Monthly Adjustments</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Forecast Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                              employee.isSubcontractor ? 'bg-blue-500' : 'bg-emerald-500'
                            }`}>
                              {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <EditableField
                                value={employee.name}
                                onSave={hasPermission('editEmployees') ? (value) => handleUpdateEmployee(employee.id, 'name', value) : null}
                              />
                              {employee.company && <div className="text-xs text-gray-500">{employee.company}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <EditableField
                            value={employee.role}
                            onSave={hasPermission('editEmployees') ? (value) => handleUpdateEmployee(employee.id, 'role', value) : null}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span>{employee.isSubcontractor ? 'Contractor' : 'Employee'}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {hasPermission('viewSalaries') ? (
                            <EditableField
                              value={employee.hourlyRate}
                              onSave={hasPermission('editEmployees') ? (value) => handleUpdateEmployee(employee.id, 'hourlyRate', value) : null}
                              type="number"
                            />
                          ) : (
                            <span className="text-gray-400">***</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <EditableField
                            value={employee.actualHours}
                            onSave={hasPermission('editEmployees') ? (value) => handleUpdateEmployee(employee.id, 'actualHours', value) : null}
                            type="number"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <StatusBadge 
                            status={employee.status} 
                            variant={employee.status === 'active' ? 'success' : 'default'} 
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          {!employee.isSubcontractor && hasPermission('editEmployees') && (
                            <button
                              onClick={() => openMonthlyAdjustments(employee)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                              title="Manage Monthly Salary Adjustments"
                            >
                              Adjustments
                            </button>
                          )}
                          {employee.isSubcontractor && (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {hasPermission('editEmployees') && (
                            <button
                              onClick={() => openForecastDataEditor(employee)}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                              title="Edit Budget Forecast Data"
                            >
                              Forecast
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financials' && hasPermission('viewFinancials') && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Financial Settings</h2>
              <p className="text-gray-500 mt-1">Configure project financial parameters and view profit/loss analysis</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Project Financials</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700 font-medium">Contract Value</label>
                    <EditableField
                      value={projectData.contractValue}
                      onSave={hasPermission('editFinancials') ? (value) => handleUpdateProjectData('contractValue', value) : null}
                      type="currency"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700 font-medium">Actual Revenue</label>
                    <EditableField
                      value={projectData.actualRevenue}
                      onSave={hasPermission('editFinancials') ? (value) => handleUpdateProjectData('actualRevenue', value) : null}
                      type="currency"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700 font-medium">Total Billable Hours</label>
                    <EditableField
                      value={projectData.totalBillableHours}
                      onSave={hasPermission('editFinancials') ? (value) => handleUpdateProjectData('totalBillableHours', value) : null}
                      type="number"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700 font-medium">Profit Margin</label>
                    <EditableField
                      value={projectData.profitMargin * 100}
                      onSave={hasPermission('editFinancials') ? (value) => handleUpdateProjectData('profitMargin', value / 100) : null}
                      type="number"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700 font-medium">Indirect Cost Rate</label>
                    <EditableField
                      value={projectData.indirectCostRate * 100}
                      onSave={hasPermission('editFinancials') ? (value) => handleUpdateProjectData('indirectCostRate', value / 100) : null}
                      type="number"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Profit/Loss Analysis</h3>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className={`text-4xl font-bold mb-2 ${
                      metrics.profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metrics.profitLossPercentage >= 0 ? '+' : ''}{metrics.profitLossPercentage.toFixed(2)}%
                    </div>
                    <div className={`text-xl font-medium mb-2 ${
                      metrics.profitLossPercentage >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {metrics.profitLossPercentage >= 0 ? 'PROFIT' : 'LOSS'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {metrics.profitLossPercentage >= 0 
                        ? `Project is profitable with ${formatCurrency(metrics.profit)} in earnings`
                        : `Project is at a loss of ${formatCurrency(Math.abs(metrics.profit))}`
                      }
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Revenue</span>
                      <span className="font-semibold text-green-600">{formatCurrency(projectData.actualRevenue)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Total Costs</span>
                      <span className="font-semibold text-red-600">{formatCurrency(metrics.totalCosts)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <span className="text-gray-700 font-semibold">Net Result</span>
                      <span className={`font-bold text-lg ${
                        metrics.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(metrics.profit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forecasting' && hasPermission('viewFinancials') && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Budget Forecasting</h2>
              <p className="text-gray-500 mt-1">Forecast annual salary adjustments and their impact on future profit/loss</p>
            </div>

            {/* Forecast Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Forecast Year</label>
                  <select
                    value={forecastYear}
                    onChange={(e) => setForecastYear(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i + 1).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scenario</label>
                  <select
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {forecastScenarios.map(scenario => (
                      <option key={scenario.id} value={scenario.id}>{scenario.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setShowAddScenario(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add Scenario</span>
                </button>
              </div>

              {/* Current Scenario Details */}
              {(() => {
                const currentScenario = forecastScenarios.find(s => s.id === selectedScenario);
                if (!currentScenario) return null;
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-blue-600 font-medium">Salary Increase</div>
                      <div className="text-2xl font-bold text-blue-800">{currentScenario.salaryIncrease}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-blue-600 font-medium">Revenue Growth</div>
                      <div className="text-2xl font-bold text-blue-800">{currentScenario.revenueGrowth}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-blue-600 font-medium">Years to Forecast</div>
                      <div className="text-2xl font-bold text-blue-800">{forecastYear - new Date().getFullYear()}</div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Forecast Results */}
            {(() => {
              const forecast = calculateForecast();
              if (!forecast) return null;

              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Financial Impact Summary */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Financial Impact Summary</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Current Revenue</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(forecast.currentRevenue)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Projected Revenue ({forecast.year})</span>
                        <span className="font-semibold text-green-600">{formatCurrency(forecast.projectedRevenue)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Current Labor Costs</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(forecast.currentLaborCosts)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Projected Labor Costs ({forecast.year})</span>
                        <span className="font-semibold text-red-600">{formatCurrency(forecast.projectedLaborCosts)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <span className="text-blue-700 font-semibold">Projected Profit Impact</span>
                        <span className={`font-bold text-lg ${
                          forecast.profitImpact >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(forecast.profitImpact)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Salary Adjustments Detail */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Salary Adjustments Detail</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {Object.values(forecast.salaryAdjustments).map((adjustment, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                          <div className="font-medium text-gray-900 mb-2">{adjustment.name}</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Current Rate:</span>
                              <span className="ml-2 font-medium">{formatCurrency(adjustment.currentRate)}/hr</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Projected Rate:</span>
                              <span className="ml-2 font-medium text-green-600">{formatCurrency(adjustment.projectedRate)}/hr</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Annual Increase:</span>
                              <span className="ml-2 font-medium text-blue-600">{formatCurrency(adjustment.increase)}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Increase %:</span>
                              <span className="ml-2 font-medium text-blue-600">{adjustment.increasePercentage.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {activeTab === 'reports' && hasPermission('viewReports') && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Project Reports</h2>
              <p className="text-gray-500 mt-1">Generate and export project reports</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Financial Summary</h3>
                    <p className="text-gray-500 text-sm">Complete financial overview</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    try {
                      const reportData = {
                        projectName: "SEAS Project",
                        generatedDate: new Date().toLocaleDateString(),
                        contractValue: projectData.contractValue,
                        actualRevenue: projectData.actualRevenue,
                        totalCosts: metrics.totalCosts,
                        profit: metrics.profit,
                        profitLossPercentage: metrics.profitLossPercentage,
                        profitMargin: (metrics.profit / projectData.actualRevenue * 100).toFixed(2),
                        employees: employees.filter(emp => emp.status === 'active'),
                        metrics: metrics
                      };
                      
                      console.log('Financial Report:', reportData);
                      showNotification('Financial report generated! Check console for details.', 'success');
                    } catch (error) {
                      handleError(error, 'Financial Report Generation');
                    }
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Generate Report
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Team Utilization</h3>
                    <p className="text-gray-500 text-sm">Employee hours and productivity</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    try {
                      const reportData = {
                        projectName: "SEAS Project",
                        generatedDate: new Date().toLocaleDateString(),
                        totalTeamMembers: employees.length,
                        activeMembers: employees.filter(emp => emp.status === 'active').length,
                        totalHours: employees.reduce((sum, emp) => sum + emp.actualHours, 0),
                        averageHourlyRate: employees.reduce((sum, emp) => sum + emp.hourlyRate, 0) / employees.length,
                        employees: employees
                      };
                      
                      console.log('Team Report:', reportData);
                      showNotification('Team report generated! Check console for details.', 'success');
                    } catch (error) {
                      handleError(error, 'Team Report Generation');
                    }
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Generate Report
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Export Options</h3>
                    <p className="text-gray-500 text-sm">Multiple export formats</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button 
                    onClick={exportToCSV}
                    disabled={isLoading}
                    className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    {isLoading ? 'Exporting...' : 'Export CSV'}
                  </button>
                  <button 
                    onClick={exportToExcel}
                    disabled={isLoading}
                    className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    {isLoading ? 'Exporting...' : 'Export Excel'}
                  </button>
                  <button 
                    onClick={exportToJSON}
                    disabled={isLoading}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    {isLoading ? 'Exporting...' : 'Export JSON'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Upload className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Import Data</h3>
                    <p className="text-gray-500 text-sm">Load saved data</p>
                  </div>
                </div>
                <label className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors cursor-pointer text-center block">
                  <Upload size={16} className="inline mr-2" />
                  Import JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && hasPermission('manageUsers') && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">System Administration</h2>
              <p className="text-gray-500 mt-1">Manage users, permissions, and system settings</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">User Management</h3>
              <div className="space-y-4">
                {mockUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                        user.role === 'admin' ? 'bg-blue-500' :
                        user.role === 'manager' ? 'bg-green-500' : 'bg-gray-500'
                      }`}>
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <StatusBadge status={user.role} variant="info" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Help & Documentation</h2>
              <p className="text-gray-500 mt-1">Get help with using the budget management system</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">User Roles & Permissions</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p><strong>Admin:</strong> Full access to all features including user management</p>
                  <p><strong>Manager:</strong> Can view salaries and edit employees, but can't edit financial settings</p>
                  <p><strong>Employee:</strong> Limited view-only access to reports and basic information</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    📊 Understanding Financial Metrics
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    👥 Managing Team Members
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    🔐 User Permissions Guide
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    ⚙️ System Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Edit Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`w-full max-w-md rounded-2xl shadow-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Edit Profile</h3>
              <button
                onClick={() => setShowEditProfile(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Name</label>
                <input
                  type="text"
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile({...editingProfile, name: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Email</label>
                <input
                  type="email"
                  value={editingProfile.email}
                  onChange={(e) => setEditingProfile({...editingProfile, email: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>New Password (optional)</label>
                <input
                  type="password"
                  value={editingProfile.password}
                  onChange={(e) => setEditingProfile({...editingProfile, password: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Confirm New Password</label>
                <input
                  type="password"
                  value={editingProfile.confirmPassword}
                  onChange={(e) => setEditingProfile({...editingProfile, confirmPassword: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowEditProfile(false)}
                className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {showEditUser && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`w-full max-w-md rounded-2xl shadow-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Edit User</h3>
              <button
                onClick={() => setShowEditUser(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter user name"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter user email"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>New Password (optional)</label>
                <input
                  type="password"
                  value={editingUser.password}
                  onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Confirm New Password</label>
                <input
                  type="password"
                  value={editingUser.confirmPassword}
                  onChange={(e) => setEditingUser({...editingUser, confirmPassword: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowEditUser(false)}
                className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`w-full max-w-md rounded-2xl shadow-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Add New User</h3>
              <button
                onClick={() => setShowAddUser(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter user name"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter user email"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Password *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddUser(false)}
                className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forecast Data Editing Modal */}
      {showForecastDataModal && selectedEmployeeForForecast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`w-full max-w-2xl rounded-2xl shadow-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className={`text-lg font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Budget Forecast Data</h3>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>{selectedEmployeeForForecast.name} - {selectedEmployeeForForecast.role}</p>
              </div>
              <button
                onClick={() => setShowForecastDataModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Expected Hours and Utilization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Expected Hours per Month</label>
                  <input
                    type="number"
                    value={editingForecastData.expectedHoursPerMonth}
                    onChange={(e) => setEditingForecastData(prev => ({
                      ...prev,
                      expectedHoursPerMonth: parseInt(e.target.value) || 0
                    }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="160"
                    min="0"
                    max="200"
                  />
                  <p className={`text-xs mt-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Typical range: 120-200 hours</p>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Expected Utilization Rate</label>
                  <input
                    type="number"
                    step="0.05"
                    value={editingForecastData.expectedUtilization}
                    onChange={(e) => setEditingForecastData(prev => ({
                      ...prev,
                      expectedUtilization: parseFloat(e.target.value) || 0
                    }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="0.80"
                    min="0"
                    max="1"
                  />
                  <p className={`text-xs mt-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>0.0 = 0%, 1.0 = 100%</p>
                </div>
              </div>

              {/* Expected Rate Increase */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Expected Annual Rate Increase (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingForecastData.expectedRateIncrease}
                  onChange={(e) => setEditingForecastData(prev => ({
                    ...prev,
                    expectedRateIncrease: parseFloat(e.target.value) || 0
                  }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="3.0"
                  min="0"
                  max="20"
                />
                <p className={`text-xs mt-1 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Typical range: 0-15% annually</p>
              </div>

              {/* Project Assignments */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Expected Project Assignments</label>
                <div className="space-y-2">
                  {editingForecastData.expectedProjectAssignments.map((project, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={project}
                        onChange={(e) => {
                          const newAssignments = [...editingForecastData.expectedProjectAssignments];
                          newAssignments[index] = e.target.value;
                          setEditingForecastData(prev => ({
                            ...prev,
                            expectedProjectAssignments: newAssignments
                          }));
                        }}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Project name"
                      />
                      <button
                        onClick={() => removeProjectAssignment(index)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove project assignment"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addProjectAssignment}
                    className="w-full px-3 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    + Add Project Assignment
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Forecast Notes</label>
                <textarea
                  value={editingForecastData.notes}
                  onChange={(e) => setEditingForecastData(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Add notes about this employee's forecast assumptions..."
                />
                <p className={`text-xs mt-1 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Optional notes about utilization assumptions, project availability, etc.</p>
              </div>

              {/* Summary Preview */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className={`font-medium mb-3 ${
                  darkMode ? 'text-blue-300' : 'text-blue-800'
                }`}>Forecast Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Monthly Hours: </span>
                    <span className="font-medium">{editingForecastData.expectedHoursPerMonth}h</span>
                  </div>
                  <div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Utilization: </span>
                    <span className="font-medium">{(editingForecastData.expectedUtilization * 100).toFixed(0)}%</span>
                  </div>
                  <div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Rate Increase: </span>
                    <span className="font-medium">{editingForecastData.expectedRateIncrease}%</span>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Projects: </span>
                  <span className="font-medium">
                    {editingForecastData.expectedProjectAssignments.length > 0 
                      ? editingForecastData.expectedProjectAssignments.join(', ')
                      : 'None specified'
                    }
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowForecastDataModal(false)}
                className={`px-6 py-2 border rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveForecastData}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Save Forecast Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBudgetApp;
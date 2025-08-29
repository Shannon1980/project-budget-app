import React, { useMemo, useState } from 'react';
import { DollarSign, Users, Clock, TrendingUp, FileText, Shield, HelpCircle, Lock, Save, X, Edit3 } from 'lucide-react';

const ProjectBudgetApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', rememberMe: false });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'John Admin',
    email: 'admin@company.com',
    role: 'admin',
    avatar: 'JA',
    permissions: {
      viewSalaries: true,
      editEmployees: true,
      viewFinancials: true,
      editFinancials: true,
      viewReports: true,
      manageUsers: true
    }
  });

  const mockUsers = [
    {
      id: 1,
      name: 'John Admin',
      email: 'admin@company.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'JA',
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
      name: 'Sarah Manager',
      email: 'manager@company.com',
      password: 'manager123',
      role: 'manager',
      avatar: 'SM',
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
      name: 'Mike Employee',
      email: 'employee@company.com',
      password: 'employee123',
      role: 'employee',
      avatar: 'ME',
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
    { id: 1, name: 'Shannon Gueringer', role: 'PM', hourlyRate: 96.15, actualHours: 53, status: 'active', isSubcontractor: false, compType: 'hourly', annualSalary: 0 },
    { id: 2, name: 'Drew Hynes', role: 'Developer', hourlyRate: 96.15, actualHours: 0, status: 'inactive', isSubcontractor: false, compType: 'hourly', annualSalary: 0 },
    { id: 3, name: 'Uyen Tran', role: 'SA/Eng Lead', hourlyRate: 84.13, actualHours: 45, status: 'active', isSubcontractor: false, compType: 'hourly', annualSalary: 0 },
    { id: 101, name: 'Adrien Abrams', role: 'Data Systems SME', hourlyRate: 250, actualHours: 20, status: 'active', isSubcontractor: true, company: 'BEELINE', compType: 'hourly', annualSalary: 0 }
  ]);

  const [projectData, setProjectData] = useState({
    contractValue: 8079030,
    actualRevenue: 5646737.62,
    totalBillableHours: 26298.75,
    actualHoursToDate: 26656.5,
    profitMargin: 0.15,
    indirectCostRate: 0.35
  });

  const [teamQuery, setTeamQuery] = useState('');
  const [teamFilters, setTeamFilters] = useState({ status: 'all', type: 'all' });
  const [teamSort, setTeamSort] = useState({ field: 'name', direction: 'asc' });

  const [forecast, setForecast] = useState({
    months: 6,
    monthlyRevenue: 900000,
    laborUtilization: 0.85,
    subcontractorShare: employees.filter(e => e.isSubcontractor).length / Math.max(1, employees.length),
    annualRaisePct: 0.03
  });

  const hasPermission = (permission) => currentUser?.permissions?.[permission] || false;

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);

  const handleLogin = async () => {
    setIsLoading(true);
    setLoginError('');
    await new Promise(r => setTimeout(r, 600));
    const user = mockUsers.find(u => u.email === loginForm.email && u.password === loginForm.password);
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
    await new Promise(r => setTimeout(r, 800));
    const userExists = mockUsers.find(u => u.email === forgotPasswordEmail);
    if (userExists) {
      setForgotPasswordStatus({ type: 'success', message: 'Password reset instructions sent to your email' });
    } else {
      setForgotPasswordStatus({ type: 'error', message: 'No account found with this email address' });
    }
    setIsLoading(false);
    setTimeout(() => {
      if (userExists) {
        setShowForgotPassword(false);
        setForgotPasswordStatus(null);
        setForgotPasswordEmail('');
      }
    }, 2500);
  };

  const calculateMetrics = () => {
    const directEmployees = employees.filter(emp => !emp.isSubcontractor);
    const subcontractors = employees.filter(emp => emp.isSubcontractor);
    const totalDirectLabor = directEmployees.reduce((sum, emp) => sum + (emp.actualHours * (emp.hourlyRate || 0)), 0);
    const totalSubcontractorLabor = subcontractors.reduce((sum, emp) => sum + (emp.actualHours * (emp.hourlyRate || 0)), 0);
    const indirectCosts = totalDirectLabor * projectData.indirectCostRate;
    const totalCosts = totalDirectLabor + totalSubcontractorLabor + indirectCosts;
    const profit = (projectData.actualRevenue || 0) - totalCosts;
    return { totalDirectLabor, totalSubcontractorLabor, indirectCosts, totalCosts, profit };
  };

  const metrics = calculateMetrics();

  const handleSaveEmployee = (id, field, value) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, [field]: value } : emp));
  };

  const downloadCSV = (rows, filename) => {
    const escape = (val) => {
      if (val == null) return '';
      const s = String(val).replace(/"/g, '""');
      return /[",\n]/.test(s) ? '"' + s + '"' : s;
    };
    const csv = rows.map(r => r.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const visibleEmployees = useMemo(() => {
    const normalizedQuery = teamQuery.trim().toLowerCase();
    let result = employees.filter(emp => {
      const matchesQuery = !normalizedQuery || (
        emp.name.toLowerCase().includes(normalizedQuery) ||
        (emp.role || '').toLowerCase().includes(normalizedQuery) ||
        (emp.company || '').toLowerCase().includes(normalizedQuery)
      );
      const matchesStatus = teamFilters.status === 'all' || emp.status === teamFilters.status;
      const matchesType = teamFilters.type === 'all' || (teamFilters.type === 'employee' ? !emp.isSubcontractor : emp.isSubcontractor);
      return matchesQuery && matchesStatus && matchesType;
    });
    const dir = teamSort.direction === 'asc' ? 1 : -1;
    result.sort((a, b) => {
      switch (teamSort.field) {
        case 'role':
          return dir * String(a.role || '').localeCompare(String(b.role || ''));
        case 'type':
          return dir * (Number(a.isSubcontractor) - Number(b.isSubcontractor));
        case 'hourlyRate':
          return dir * ((a.hourlyRate || 0) - (b.hourlyRate || 0));
        case 'annualSalary':
          return dir * ((a.annualSalary || 0) - (b.annualSalary || 0));
        case 'actualHours':
          return dir * ((a.actualHours || 0) - (b.actualHours || 0));
        case 'status':
          return dir * String(a.status || '').localeCompare(String(b.status || ''));
        default:
          return dir * String(a.name || '').localeCompare(String(b.name || ''));
      }
    });
    return result;
  }, [employees, teamQuery, teamFilters, teamSort]);

  const forecastRows = useMemo(() => {
    const months = forecast.months;
    const direct = employees.filter(e => !e.isSubcontractor);
    const subs = employees.filter(e => e.isSubcontractor);
    const directAvgRate = direct.length ? direct.reduce((s, e) => s + (e.hourlyRate || 0), 0) / direct.length : 0;
    const subAvgRate = subs.length ? subs.reduce((s, e) => s + (e.hourlyRate || 0), 0) / subs.length : 0;
    const totalHeadcount = employees.length;
    const hoursPerMonth = 160;

    const rows = [];
    for (let i = 1; i <= months; i++) {
      const totalHours = totalHeadcount * hoursPerMonth * forecast.laborUtilization;
      const subHours = totalHours * forecast.subcontractorShare;
      const directHours = totalHours - subHours;
      const directLabor = directHours * directAvgRate;
      const subcontractorLabor = subHours * subAvgRate;
      const indirect = directLabor * projectData.indirectCostRate;
      const total = directLabor + subcontractorLabor + indirect;
      const revenue = forecast.monthlyRevenue;
      const profit = revenue - total;
      rows.push({ month: i, revenue, directLabor, subcontractorLabor, indirect, total, profit });
    }
    return rows;
  }, [forecast, employees, projectData.indirectCostRate]);

  const StatusBadge = ({ status, variant = 'default' }) => {
    const variants = {
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      danger: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
      default: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant]}`}>{status}</span>
    );
  };

  const EditableField = ({ value, onSave, type = 'text' }) => {
    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const handleSave = () => {
      if (onSave) onSave(type === 'number' ? parseFloat(tempValue) || 0 : tempValue);
      setEditing(false);
    };
    if (!onSave) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">{type === 'currency' ? formatCurrency(value) : String(value)}</span>
          <Lock size={14} className="text-gray-300" />
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
            className="px-2 py-1 border rounded text-sm w-24"
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          />
          <button onClick={handleSave} className="text-green-600 hover:text-green-800"><Save size={14} /></button>
          <button onClick={() => setEditing(false)} className="text-red-600 hover:text-red-800"><X size={14} /></button>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-2">
        <span>{type === 'currency' ? formatCurrency(value) : String(value)}</span>
        <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-gray-600"><Edit3 size={14} /></button>
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your email" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your password" required />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={loginForm.rememberMe} onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <button onClick={() => setShowForgotPassword(true)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</button>
                  </div>
                  {loginError && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">{loginError}</div>}
                  <button onClick={handleLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50">{isLoading ? (<div className="flex items-center justify-center space-x-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Signing in...</span></div>) : ('Sign In')}</button>
                </div>
              ) : (
                <div>
                  <button onClick={() => setShowForgotPassword(false)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"><span>←</span><span>Back to login</span></button>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Forgot Password</h2>
                  <p className="text-gray-600 mb-6">Enter your email address and we'll send you instructions to reset your password.</p>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                      <input type="email" value={forgotPasswordEmail} onChange={(e) => setForgotPasswordEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your email" required />
                    </div>
                    {forgotPasswordStatus && (
                      <div className={`px-4 py-3 rounded-xl text-sm ${forgotPasswordStatus.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>{forgotPasswordStatus.message}</div>
                    )}
                    <button onClick={handleForgotPassword} disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50">{isLoading ? (<div className="flex items-center justify-center space-x-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Sending...</span></div>) : ('Send Reset Instructions')}</button>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Budget Manager</h1>
                  <p className="text-gray-500 text-sm">SEAS Project Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${currentUser?.role === 'admin' ? 'bg-blue-500' : currentUser?.role === 'manager' ? 'bg-green-500' : 'bg-gray-500'}`}>
                  {currentUser?.avatar}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{currentUser?.name}</div>
                  <div className="text-gray-500">{currentUser?.role}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors text-sm">Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          <TabButton id="overview" label="Overview" icon={TrendingUp} />
          <TabButton id="employees" label="Team" icon={Users} />
          {hasPermission('viewFinancials') && (<TabButton id="financials" label="Financials" icon={DollarSign} />)}
          {hasPermission('viewReports') && (<TabButton id="reports" label="Reports" icon={FileText} />)}
          {hasPermission('viewFinancials') && (<TabButton id="forecast" label="Forecast" icon={TrendingUp} />)}
          {hasPermission('manageUsers') && (<TabButton id="admin" label="Admin" icon={Shield} />)}
          <TabButton id="help" label="Help" icon={HelpCircle} />
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Contract Value" value={formatCurrency(projectData.contractValue)} icon={DollarSign} color="from-blue-500 to-blue-600" />
              <MetricCard title="Actual Revenue" value={formatCurrency(projectData.actualRevenue)} icon={TrendingUp} color="from-emerald-500 to-green-600" />
              <MetricCard title="Total Hours" value={projectData.actualHoursToDate.toLocaleString()} icon={Clock} color="from-purple-500 to-purple-600" />
              <MetricCard title="Active Team" value={employees.filter(e => e.status === 'active').length} subtitle={`${employees.filter(e => !e.isSubcontractor && e.status === 'active').length} employees, ${employees.filter(e => e.isSubcontractor && e.status === 'active').length} contractors`} icon={Users} color="from-orange-500 to-amber-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100"><h3 className="text-lg font-bold text-gray-900">Cost Breakdown</h3></div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between"><span className="text-gray-700">Direct Labor</span><span className="font-bold">{formatCurrency(metrics.totalDirectLabor)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-gray-700">Subcontractor Labor</span><span className="font-bold">{formatCurrency(metrics.totalSubcontractorLabor)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-gray-700">Indirect Costs</span><span className="font-bold">{formatCurrency(metrics.indirectCosts)}</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100"><h3 className="text-lg font-bold text-gray-900">Performance</h3></div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between"><span className="text-gray-700">Total Costs</span><span className="font-bold">{formatCurrency(metrics.totalCosts)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-gray-700">Profit</span><span className={`font-bold ${metrics.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(metrics.profit)}</span></div>
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
              <div className="p-6 border-b border-gray-100"><h3 className="text-lg font-bold text-gray-900">Team Members</h3></div>
              <div className="px-6 pt-4">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
                  <input type="text" value={teamQuery} onChange={(e) => setTeamQuery(e.target.value)} placeholder="Search name, role, or company" className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <select value={teamFilters.status} onChange={(e) => setTeamFilters({ ...teamFilters, status: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select value={teamFilters.type} onChange={(e) => setTeamFilters({ ...teamFilters, type: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="all">All Types</option>
                    <option value="employee">Employee</option>
                    <option value="contractor">Contractor</option>
                  </select>
                  <select value={`${teamSort.field}:${teamSort.direction}`} onChange={(e) => { const [field, direction] = e.target.value.split(':'); setTeamSort({ field, direction }); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="name:asc">Name (A→Z)</option>
                    <option value="name:desc">Name (Z→A)</option>
                    <option value="role:asc">Role (A→Z)</option>
                    <option value="role:desc">Role (Z→A)</option>
                    <option value="type:asc">Type (Emp→Ctr)</option>
                    <option value="type:desc">Type (Ctr→Emp)</option>
                    <option value="annualSalary:asc">Salary (Low→High)</option>
                    <option value="annualSalary:desc">Salary (High→Low)</option>
                    <option value="hourlyRate:asc">Rate (Low→High)</option>
                    <option value="hourlyRate:desc">Rate (High→Low)</option>
                    <option value="actualHours:asc">Hours (Low→High)</option>
                    <option value="actualHours:desc">Hours (High→Low)</option>
                    <option value="status:asc">Status (A→Z)</option>
                    <option value="status:desc">Status (Z→A)</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Comp Type</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Annual Salary</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Hourly Rate</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actual Hours</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {visibleEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${employee.isSubcontractor ? 'bg-blue-500' : 'bg-emerald-500'}`}>{employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                            <div>
                              <EditableField value={employee.name} onSave={hasPermission('editEmployees') ? (value) => handleSaveEmployee(employee.id, 'name', value) : null} />
                              {employee.company && <div className="text-xs text-gray-500">{employee.company}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><EditableField value={employee.role} onSave={hasPermission('editEmployees') ? (value) => handleSaveEmployee(employee.id, 'role', value) : null} /></td>
                        <td className="px-6 py-4"><span>{employee.isSubcontractor ? 'Contractor' : 'Employee'}</span></td>
                        <td className="px-6 py-4 text-right">
                          {hasPermission('viewSalaries') ? (
                            <EditableField value={employee.compType || (employee.isSubcontractor ? 'hourly' : 'hourly')} onSave={hasPermission('editEmployees') ? (value) => handleSaveEmployee(employee.id, 'compType', value) : null} type="text" />
                          ) : (<span className="text-gray-400">***</span>)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {hasPermission('viewSalaries') ? (
                            <EditableField value={employee.annualSalary || 0} onSave={hasPermission('editEmployees') ? (value) => handleSaveEmployee(employee.id, 'annualSalary', value) : null} type="number" />
                          ) : (<span className="text-gray-400">***</span>)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {hasPermission('viewSalaries') ? (
                            <EditableField value={employee.hourlyRate} onSave={hasPermission('editEmployees') ? (value) => handleSaveEmployee(employee.id, 'hourlyRate', value) : null} type="number" />
                          ) : (<span className="text-gray-400">***</span>)}
                        </td>
                        <td className="px-6 py-4 text-right"><EditableField value={employee.actualHours} onSave={hasPermission('editEmployees') ? (value) => handleSaveEmployee(employee.id, 'actualHours', value) : null} type="number" /></td>
                        <td className="px-6 py-4 text-center"><StatusBadge status={employee.status} variant={employee.status === 'active' ? 'success' : 'default'} /></td>
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
              <p className="text-gray-500 mt-1">Configure project financial parameters</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Project Financials</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between"><label className="text-gray-700 font-medium">Contract Value</label><EditableField value={projectData.contractValue} onSave={hasPermission('editFinancials') ? (value) => setProjectData({ ...projectData, contractValue: value }) : null} type="currency" /></div>
                <div className="flex items-center justify-between"><label className="text-gray-700 font-medium">Actual Revenue</label><EditableField value={projectData.actualRevenue} onSave={hasPermission('editFinancials') ? (value) => setProjectData({ ...projectData, actualRevenue: value }) : null} type="currency" /></div>
                <div className="flex items-center justify-between"><label className="text-gray-700 font-medium">Total Billable Hours</label><EditableField value={projectData.totalBillableHours} onSave={hasPermission('editFinancials') ? (value) => setProjectData({ ...projectData, totalBillableHours: value }) : null} type="number" /></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && hasPermission('viewReports') && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Project Reports</h2>
              <p className="text-gray-500 mt-1">Generate and export project reports</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4"><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><FileText className="text-blue-600" size={24} /></div><div><h3 className="text-lg font-bold text-gray-900">Financial Summary</h3><p className="text-gray-500 text-sm">Complete financial overview</p></div></div>
                <button onClick={() => { const rows = [['Metric','Value'], ['Contract Value', projectData.contractValue], ['Actual Revenue', projectData.actualRevenue], ['Total Billable Hours', projectData.totalBillableHours], ['Direct Labor', metrics.totalDirectLabor], ['Subcontractor Labor', metrics.totalSubcontractorLabor], ['Indirect Costs', metrics.indirectCosts], ['Total Costs', metrics.totalCosts], ['Profit', metrics.profit]]; downloadCSV(rows, 'financial-summary.csv'); }} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Generate Report</button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4"><div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><Users className="text-green-600" size={24} /></div><div><h3 className="text-lg font-bold text-gray-900">Team Utilization</h3><p className="text-gray-500 text-sm">Employee hours and productivity</p></div></div>
                <button onClick={() => { const header = ['Name','Role','Type','Hourly Rate','Actual Hours','Labor Cost']; const rows = [header].concat(visibleEmployees.map(e => [e.name, e.role, e.isSubcontractor ? 'Contractor' : 'Employee', e.hourlyRate, e.actualHours, Math.round((e.hourlyRate || 0) * (e.actualHours || 0))])); downloadCSV(rows, 'team-utilization.csv'); }} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Generate Report</button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4"><div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"><TrendingUp className="text-purple-600" size={24} /></div><div><h3 className="text-lg font-bold text-gray-900">Budget vs Actual</h3><p className="text-gray-500 text-sm">Performance analysis</p></div></div>
                <button onClick={() => { const rows = [['Category','Budget','Actual'], ['Revenue', projectData.contractValue, projectData.actualRevenue], ['Direct Labor','', metrics.totalDirectLabor], ['Subcontractor Labor','', metrics.totalSubcontractorLabor], ['Indirect Costs','', metrics.indirectCosts], ['Total Costs','', metrics.totalCosts], ['Profit','', metrics.profit]]; downloadCSV(rows, 'budget-vs-actual.csv'); }} className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Generate Report</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forecast' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Forecast</h2>
              <p className="text-gray-500 mt-1">Model future budget scenarios</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div><label className="block text-xs text-gray-500 mb-1">Months</label><input type="number" min="1" value={forecast.months} onChange={(e) => setForecast({ ...forecast, months: Math.max(1, parseInt(e.target.value || '1', 10)) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Monthly Revenue</label><input type="number" value={forecast.monthlyRevenue} onChange={(e) => setForecast({ ...forecast, monthlyRevenue: parseFloat(e.target.value || '0') })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Labor Utilization %</label><input type="number" value={Math.round(forecast.laborUtilization * 100)} onChange={(e) => setForecast({ ...forecast, laborUtilization: Math.min(1, Math.max(0, (parseFloat(e.target.value || '0') / 100))) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Subcontractor Share %</label><input type="number" value={Math.round(forecast.subcontractorShare * 100)} onChange={(e) => setForecast({ ...forecast, subcontractorShare: Math.min(1, Math.max(0, (parseFloat(e.target.value || '0') / 100))) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Annual Raise %</label><input type="number" value={Math.round(forecast.annualRaisePct * 100)} onChange={(e) => setForecast({ ...forecast, annualRaisePct: Math.max(0, (parseFloat(e.target.value || '0') / 100)) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
              </div>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Month</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Revenue</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Direct Labor</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Subcontractors</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Indirect</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total Cost</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {forecastRows.map((r) => (
                      <tr key={r.month}>
                        <td className="px-4 py-3">{r.month}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(r.revenue)}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(r.directLabor)}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(r.subcontractorLabor)}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(r.indirect)}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(r.total)}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(r.profit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={() => { const header = ['Month','Revenue','Direct Labor','Subcontractors','Indirect','Total Cost','Profit']; const rows = [header].concat(forecastRows.map(r => [r.month, r.revenue, r.directLabor, r.subcontractorLabor, r.indirect, r.total, r.profit])); downloadCSV(rows, 'forecast.csv'); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Export Forecast CSV</button>
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
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${user.role === 'admin' ? 'bg-blue-500' : user.role === 'manager' ? 'bg-green-500' : 'bg-gray-500'}`}>{user.avatar}</div>
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
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">📊 Understanding Financial Metrics</button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">👥 Managing Team Members</button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">🔐 User Permissions Guide</button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">⚙️ System Configuration</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ id, label, icon: Icon }) => (
  <button onClick={() => window.__setActiveTab?.(id)} className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200`}>
    <Icon size={20} />
    <span className="font-semibold">{label}</span>
  </button>
);

const MetricCard = ({ title, value, subtitle, icon: Icon, color }) => (
  <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <p className="text-white text-2xl font-bold mt-1">{value}</p>
        {subtitle && <p className="text-white/60 text-xs mt-1">{subtitle}</p>}
      </div>
      <div className="bg-white/20 p-3 rounded-xl"><Icon size={28} className="text-white" /></div>
    </div>
  </div>
);

export default ProjectBudgetApp;


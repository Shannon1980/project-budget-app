import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.REACT_APP_NEON_DATABASE_URL);

export const setupDatabase = async () => {
  try {
    console.log('🚀 Setting up database schema...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        await sql`${statement}`;
      }
    }
    
    console.log('✅ Database schema setup completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    return { success: false, error: error.message };
  }
};

// Run setup if called
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

// Employee operations
export const saveEmployees = async (employees) => {
  try {
    // Clear existing employees
    await sql`DELETE FROM employees`;
    
    // Insert new employees
    for (const employee of employees) {
      await sql`
        INSERT INTO employees (name, role, hourly_rate, actual_hours, status, is_subcontractor, company, forecast_data)
        VALUES (${employee.name}, ${employee.role}, ${employee.hourlyRate}, ${employee.actualHours}, ${employee.status}, ${employee.isSubcontractor}, ${employee.company}, ${JSON.stringify(employee.forecastData)})
      `;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving employees:', error);
    return { success: false, error: error.message };
  }
};

export const loadEmployees = async () => {
  try {
    const result = await sql`
      SELECT * FROM employees 
      ORDER BY name ASC
    `;
    
    // Transform database format to app format
    const employees = result.map(row => ({
      id: row.id,
      name: row.name,
      role: row.role,
      hourlyRate: parseFloat(row.hourly_rate),
      actualHours: row.actual_hours,
      status: row.status,
      isSubcontractor: row.is_subcontractor,
      company: row.company,
      forecastData: row.forecast_data || {
        expectedHoursPerMonth: 160,
        expectedUtilization: 0.85,
        expectedRateIncrease: 3.0,
        expectedProjectAssignments: [],
        notes: ""
      }
    }));
    
    return { success: true, data: employees };
  } catch (error) {
    console.error('Error loading employees:', error);
    return { success: false, error: error.message };
  }
};

// Project data operations
export const saveProjectData = async (projectData) => {
  try {
    // Check if project data exists
    const existing = await sql`
      SELECT id FROM project_data 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    if (existing.length > 0) {
      // Update existing record
      await sql`
        UPDATE project_data SET
          contract_value = ${projectData.contractValue},
          actual_revenue = ${projectData.actualRevenue},
          total_billable_hours = ${projectData.totalBillableHours},
          actual_hours_to_date = ${projectData.actualHoursToDate},
          profit_margin = ${projectData.profitMargin},
          indirect_cost_rate = ${projectData.indirectCostRate},
          updated_at = NOW()
        WHERE id = ${existing[0].id}
      `;
    } else {
      // Insert new record
      await sql`
        INSERT INTO project_data (contract_value, actual_revenue, total_billable_hours, actual_hours_to_date, profit_margin, indirect_cost_rate)
        VALUES (${projectData.contractValue}, ${projectData.actualRevenue}, ${projectData.totalBillableHours}, ${projectData.actualHoursToDate}, ${projectData.profitMargin}, ${projectData.indirectCostRate})
      `;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving project data:', error);
    return { success: false, error: error.message };
  }
};

export const loadProjectData = async () => {
  try {
    const result = await sql`
      SELECT * FROM project_data 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    if (result.length > 0) {
      const data = result[0];
      return { 
        success: true, 
        data: {
          contractValue: parseFloat(data.contract_value),
          actualRevenue: parseFloat(data.actual_revenue),
          totalBillableHours: parseFloat(data.total_billable_hours),
          actualHoursToDate: parseFloat(data.actual_hours_to_date),
          profitMargin: parseFloat(data.profit_margin),
          indirectCostRate: parseFloat(data.indirect_cost_rate)
        }
      };
    }
    
    return { success: true, data: null };
  } catch (error) {
    console.error('Error loading project data:', error);
    return { success: false, error: error.message };
  }
};

// Monthly adjustments operations
export const saveMonthlyAdjustments = async (adjustments) => {
  try {
    // Clear existing adjustments
    await sql`DELETE FROM monthly_adjustments`;
    
    // Insert new adjustments
    for (const [employeeId, years] of Object.entries(adjustments)) {
      for (const [year, months] of Object.entries(years)) {
        for (const [month, percentage] of Object.entries(months)) {
          if (percentage !== 0) {
            await sql`
              INSERT INTO monthly_adjustments (employee_id, year, month, adjustment_percentage)
              VALUES (${parseInt(employeeId)}, ${parseInt(year)}, ${parseInt(month)}, ${parseFloat(percentage)})
            `;
          }
        }
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving monthly adjustments:', error);
    return { success: false, error: error.message };
  }
};

export const loadMonthlyAdjustments = async () => {
  try {
    const result = await sql`
      SELECT * FROM monthly_adjustments 
      ORDER BY employee_id, year, month
    `;
    
    const adjustments = {};
    result.forEach(row => {
      if (!adjustments[row.employee_id]) {
        adjustments[row.employee_id] = {};
      }
      if (!adjustments[row.employee_id][row.year]) {
        adjustments[row.employee_id][row.year] = {};
      }
      adjustments[row.employee_id][row.year][row.month] = parseFloat(row.adjustment_percentage);
    });
    
    return { success: true, data: adjustments };
  } catch (error) {
    console.error('Error loading monthly adjustments:', error);
    return { success: false, error: error.message };
  }
};

// Forecast scenarios operations
export const saveForecastScenarios = async (scenarios) => {
  try {
    // Clear existing scenarios
    await sql`DELETE FROM forecast_scenarios`;
    
    // Insert new scenarios
    for (const scenario of scenarios) {
      await sql`
        INSERT INTO forecast_scenarios (name, description, salary_increase_percentage, revenue_growth_percentage, is_active)
        VALUES (${scenario.name}, ${scenario.description}, ${scenario.salaryIncreasePercentage}, ${scenario.revenueGrowthPercentage}, ${scenario.isActive})
      `;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving forecast scenarios:', error);
    return { success: false, error: error.message };
  }
};

export const loadForecastScenarios = async () => {
  try {
    const result = await sql`
      SELECT * FROM forecast_scenarios 
      ORDER BY is_active DESC, name ASC
    `;
    
    const scenarios = result.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      salaryIncreasePercentage: parseFloat(row.salary_increase_percentage),
      revenueGrowthPercentage: parseFloat(row.revenue_growth_percentage),
      isActive: row.is_active
    }));
    
    return { success: true, data: scenarios };
  } catch (error) {
    console.error('Error loading forecast scenarios:', error);
    return { success: false, error: error.message };
  }
};

// Database initialization
export const initializeDatabase = async () => {
  try {
    // This will be called once to set up the database schema
    // You can run this manually or add it to your deployment process
    console.log('Database initialization completed');
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error: error.message };
  }
};

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  hourly_rate DECIMAL(10,2),
  actual_hours INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  is_subcontractor BOOLEAN DEFAULT FALSE,
  company VARCHAR(255),
  forecast_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create project_data table
CREATE TABLE IF NOT EXISTS project_data (
  id SERIAL PRIMARY KEY,
  contract_value DECIMAL(15,2),
  actual_revenue DECIMAL(15,2),
  total_billable_hours DECIMAL(10,2),
  actual_hours_to_date DECIMAL(10,2),
  profit_margin DECIMAL(5,4),
  indirect_cost_rate DECIMAL(5,4),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create monthly_adjustments table
CREATE TABLE IF NOT EXISTS monthly_adjustments (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  adjustment_percentage DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(employee_id, year, month)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  permission_type VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create forecast_scenarios table
CREATE TABLE IF NOT EXISTS forecast_scenarios (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  salary_increase_percentage DECIMAL(5,2),
  revenue_growth_percentage DECIMAL(5,2),
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
CREATE INDEX IF NOT EXISTS idx_monthly_adjustments_employee_year ON monthly_adjustments(employee_id, year);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_forecast_scenarios_active ON forecast_scenarios(is_active);

-- Insert default forecast scenario
INSERT INTO forecast_scenarios (name, description, salary_increase_percentage, revenue_growth_percentage, is_active)
VALUES ('Default Scenario', 'Default forecasting scenario', 3.0, 5.0, true)
ON CONFLICT DO NOTHING;

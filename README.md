# Budget Management App

[![CI/CD Pipeline](https://github.com/Shannon1980/project-budget-app/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/Shannon1980/project-budget-app/actions)
[![Test Coverage](https://codecov.io/gh/Shannon1980/project-budget-app/branch/master/graph/badge.svg)](https://codecov.io/gh/Shannon1980/project-budget-app)
[![Security](https://github.com/Shannon1980/project-budget-app/workflows/Security%20Scan/badge.svg)](https://github.com/Shannon1980/project-budget-app/actions)
[![Performance](https://github.com/Shannon1980/project-budget-app/workflows/Performance%20Test/badge.svg)](https://github.com/Shannon1980/project-budget-app/actions)

A modern, role-based project budget management dashboard built with React and Tailwind CSS.

## 🚀 Features

- **🔐 Authentication System** with role-based access control
- **📊 Financial Dashboard** with real-time metrics
- **👥 Team Management** with editable employee data
- **💰 Budget Tracking** and cost analysis
- **📈 Reports & Analytics** (permission-based)
- **⚙️ Admin Panel** for user management
- **📱 Responsive Design** for all devices

## 🛠️ Tech Stack

- **React 18** - Frontend framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **JavaScript** - Programming language

## 🏗️ Project Structure

```
budget-management-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── ProjectBudgetApp.jsx
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd budget-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 Demo Credentials

### Admin Access (Full Permissions)
- **Email:** admin@company.com
- **Password:** admin123
- **Access:** All features including user management

### Manager Access (Limited Admin)
- **Email:** manager@company.com
- **Password:** manager123
- **Access:** View salaries, edit employees, view financials (no edit)

### Employee Access (View Only)
- **Email:** employee@company.com
- **Password:** employee123
- **Access:** Basic reports and limited information

## 🎨 Features by Role

### 👑 Admin
- Full dashboard access
- Employee management (create, edit, delete)
- Financial settings configuration
- User role management
- Report generation
- System administration

### 👔 Manager
- Dashboard overview
- Employee data viewing/editing
- Salary information access
- Financial data viewing
- Report generation

### 👤 Employee
- Basic dashboard view
- Limited reports access
- Personal information viewing
- Read-only access to most features

## 📊 Dashboard Sections

### Overview
- Contract value and revenue metrics
- Team size and composition
- Cost breakdown analysis
- Profit/loss calculations

### Team Management
- Employee roster with roles
- Hourly rates and hours tracking
- Contractor vs employee designation
- Status management

### Financial Settings
- Contract and revenue configuration
- Budget parameters
- Cost rate settings
- Profit margin targets

### Reports
- Financial summaries
- Team utilization reports
- Budget vs actual analysis
- Export capabilities

## 🛠️ Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:pipeline` - Run local CI/CD pipeline tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run setup-db` - Setup database schema
- `npm run verify-db` - Verify database setup
- `npm run test-db` - Test database connection
- `npm eject` - Ejects from Create React App (irreversible)

## 🎨 Customization

### Styling
The app uses Tailwind CSS for styling. To customize:

1. Edit `tailwind.config.js` for theme modifications
2. Update `src/index.css` for global styles
3. Modify component classes in `ProjectBudgetApp.jsx`

### Data
To connect to a real backend:

1. Replace mock data in the component with API calls
2. Add authentication service
3. Implement proper state management (Redux, Context API)

## 🔄 CI/CD Pipeline

This project includes a comprehensive CI/CD pipeline built with GitHub Actions:

### 🚀 Automated Workflows

- **🧪 Testing**: Automated test execution with coverage reporting
- **🏗️ Building**: Production builds with size analysis
- **🔒 Security**: Vulnerability scanning and security audits
- **⚡ Performance**: Lighthouse performance testing
- **🚀 Deployment**: Automatic deployment to Netlify
- **📦 Dependencies**: Automated dependency updates with Dependabot

### 📊 Quality Gates

- **Test Coverage**: Minimum 70% coverage required
- **Performance**: Lighthouse score ≥ 80%
- **Security**: No high-severity vulnerabilities
- **Code Quality**: ESLint and Prettier compliance

### 🔧 Local Testing

Test the CI/CD pipeline locally before pushing:

```bash
npm run test:pipeline
```

This runs all the same checks that the GitHub Actions pipeline will run.

### 📋 Pipeline Status

Check the status of the CI/CD pipeline:
- [GitHub Actions](https://github.com/Shannon1980/project-budget-app/actions)
- [Test Coverage](https://codecov.io/gh/Shannon1980/project-budget-app)
- [Security Scan](https://github.com/Shannon1980/project-budget-app/security)

## 🚀 Deployment

### Automatic Deployment
The application automatically deploys to Netlify when changes are pushed to the `master` branch.

### Manual Deployment

#### Build for Production
```bash
npm run build
```

#### Deploy Options
- **Netlify:** Connect your repo for automatic deployments
- **Vercel:** Zero-config deployment for React apps
- **GitHub Pages:** Free hosting for open source projects
- **AWS S3:** Scalable cloud hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set
- **React** team for the amazing framework
- **Create React App** for the project setup

---

**Built with ❤️ for modern budget management**
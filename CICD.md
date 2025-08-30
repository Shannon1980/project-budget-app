# CI/CD Pipeline Documentation

This document provides a comprehensive guide to the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the Project Budget Management Application.

## 🚀 Pipeline Overview

The CI/CD pipeline is built using GitHub Actions and includes the following workflows:

1. **Main CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
2. **Pull Request Checks** (`.github/workflows/pull-request.yml`)
3. **Maintenance Tasks** (`.github/workflows/maintenance.yml`)
4. **Dependabot** (`.github/dependabot.yml`)

## 📋 Workflow Details

### 1. Main CI/CD Pipeline (`ci-cd.yml`)

**Triggers:**
- Push to `master`, `main`, or `develop` branches
- Pull requests to `master` or `main` branches

**Jobs:**

#### 🧪 Test Job
- **Purpose**: Run comprehensive test suite
- **Steps**:
  - Checkout code
  - Setup Node.js 18
  - Install dependencies
  - Run ESLint
  - Run unit tests with coverage
  - Upload coverage to Codecov
  - Comment coverage on PRs

#### 🏗️ Build Job
- **Purpose**: Build the application for production
- **Dependencies**: Requires test job to pass
- **Steps**:
  - Checkout code
  - Setup Node.js 18
  - Install dependencies
  - Build application
  - Upload build artifacts
  - Analyze build size

#### 🗄️ Database Setup Job
- **Purpose**: Setup and verify database schema
- **Dependencies**: Requires test job to pass
- **Triggers**: Only on `master`/`main` branches
- **Steps**:
  - Test database connection
  - Setup database schema
  - Verify database setup

#### 🚀 Deploy Job
- **Purpose**: Deploy to Netlify
- **Dependencies**: Requires build and database setup jobs
- **Triggers**: Only on `master`/`main` branches
- **Steps**:
  - Build for production
  - Deploy to Netlify
  - Get deployment URL
  - Comment deployment URL on commit

#### 🔒 Security Job
- **Purpose**: Security scanning and vulnerability assessment
- **Steps**:
  - Run npm audit
  - Run Snyk security scan
  - Report security issues

#### ⚡ Performance Job
- **Purpose**: Performance testing with Lighthouse
- **Dependencies**: Requires build job
- **Steps**:
  - Download build artifacts
  - Run Lighthouse CI
  - Upload performance reports

### 2. Pull Request Checks (`pull-request.yml`)

**Triggers:**
- Pull requests to `master`, `main`, or `develop` branches

**Jobs:**

#### 🔍 Code Quality
- ESLint checks
- Code formatting validation
- Super Linter integration

#### 🧪 Test Coverage
- Run tests with coverage
- Generate coverage reports
- Upload to Codecov

#### 🏗️ Build Check
- Verify application builds successfully
- Check build size

#### 🔒 Security Check
- Security audit
- Vulnerability scanning

#### 📦 Dependency Check
- Check for outdated dependencies
- Validate package-lock.json

#### 💬 PR Comment
- Comment on PR with check results
- Update existing comments

### 3. Maintenance Tasks (`maintenance.yml`)

**Triggers:**
- Scheduled: Every Sunday at 2 AM UTC
- Manual: Workflow dispatch

**Jobs:**

#### 📦 Update Dependencies
- Check for outdated dependencies
- Update patch and minor versions
- Create PR for updates
- Run tests after updates

#### 🔒 Security Audit
- Run comprehensive security audit
- Snyk security scanning
- Generate security reports

#### 🔍 Code Quality Check
- ESLint analysis
- Code formatting check
- Generate quality reports

#### ⚡ Performance Check
- Lighthouse performance testing
- Performance regression detection

#### 🧹 Cleanup
- Clean up old artifacts
- Remove temporary files
- Cache cleanup

## 🔧 Configuration Files

### Lighthouse Configuration (`.lighthouserc.json`)
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "chromeFlags": "--no-sandbox --disable-dev-shm-usage"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.8}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.8}],
        "categories:pwa": ["warn", {"minScore": 0.6}]
      }
    }
  }
}
```

### Dependabot Configuration (`.github/dependabot.yml`)
- Weekly dependency updates
- Automated PR creation
- Smart ignore rules for major version updates

## 🔐 Required Secrets

To use the CI/CD pipeline, you need to configure the following GitHub Secrets:

### Required Secrets:
```bash
# Database
REACT_APP_NEON_DATABASE_URL=postgresql://...

# Netlify Deployment
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
NETLIFY_SITE_ID=your_netlify_site_id

# Optional: Security Scanning
SNYK_TOKEN=your_snyk_token
```

### How to Set Up Secrets:

1. **Go to your GitHub repository**
2. **Navigate to Settings → Secrets and variables → Actions**
3. **Click "New repository secret"**
4. **Add each secret with the exact name and value**

#### Getting Netlify Credentials:
1. **Netlify Auth Token**:
   - Go to Netlify → User settings → Applications
   - Create a new personal access token
   - Copy the token

2. **Netlify Site ID**:
   - Go to your site in Netlify
   - Navigate to Site settings → General
   - Copy the Site ID

## 🚀 Deployment Process

### Automatic Deployment:
1. **Push to `master` or `main` branch**
2. **Tests run automatically**
3. **If tests pass, build starts**
4. **Database setup runs**
5. **Application deploys to Netlify**
6. **Deployment URL is posted as commit comment**

### Manual Deployment:
1. **Go to Actions tab in GitHub**
2. **Select "CI/CD Pipeline" workflow**
3. **Click "Run workflow"**
4. **Select branch and click "Run workflow"**

## 📊 Monitoring and Alerts

### Success Notifications:
- ✅ Deployment URL posted as commit comment
- ✅ PR comments with check results
- ✅ Coverage reports uploaded to Codecov

### Failure Notifications:
- ❌ Failed builds block deployment
- ❌ Security issues reported
- ❌ Performance regressions detected

### Monitoring Dashboard:
- **GitHub Actions**: View workflow runs and logs
- **Codecov**: Track test coverage trends
- **Netlify**: Monitor deployment status
- **Snyk**: Security vulnerability tracking

## 🔄 Branch Strategy

### Main Branches:
- **`master`/`main`**: Production branch (auto-deploys)
- **`develop`**: Development branch (runs tests only)

### Feature Branches:
- **`feature/*`**: Feature development
- **`bugfix/*`**: Bug fixes
- **`hotfix/*`**: Critical production fixes

### Workflow:
1. **Create feature branch from `develop`**
2. **Make changes and push**
3. **Create pull request to `develop`**
4. **PR checks run automatically**
5. **Merge to `develop` after approval**
6. **Create PR from `develop` to `master`**
7. **Merge to `master` triggers deployment**

## 🛠️ Troubleshooting

### Common Issues:

#### 1. Build Failures
```bash
# Check build logs
# Common causes:
- Missing dependencies
- TypeScript errors
- ESLint violations
- Test failures
```

#### 2. Deployment Failures
```bash
# Check deployment logs
# Common causes:
- Missing environment variables
- Database connection issues
- Netlify configuration problems
```

#### 3. Test Failures
```bash
# Check test logs
# Common causes:
- Flaky tests
- Environment setup issues
- Mock configuration problems
```

#### 4. Security Scan Failures
```bash
# Check security logs
# Common causes:
- Vulnerable dependencies
- Security policy violations
- Snyk configuration issues
```

### Debug Commands:
```bash
# Run tests locally
npm run test:coverage

# Run build locally
npm run build

# Check for security issues
npm audit

# Run ESLint
npx eslint src/ --ext .js,.jsx
```

## 📈 Performance Metrics

### Lighthouse Scores:
- **Performance**: ≥ 80%
- **Accessibility**: ≥ 90%
- **Best Practices**: ≥ 90%
- **SEO**: ≥ 80%
- **PWA**: ≥ 60% (warning threshold)

### Build Metrics:
- **Build Time**: Monitored and optimized
- **Bundle Size**: Tracked and reported
- **Test Coverage**: ≥ 70% threshold

## 🔧 Customization

### Adding New Jobs:
1. **Edit workflow files**
2. **Add new job definitions**
3. **Configure dependencies**
4. **Test locally first**

### Modifying Triggers:
1. **Update `on` section in workflow files**
2. **Configure branch patterns**
3. **Set up event types**

### Custom Notifications:
1. **Add notification steps**
2. **Configure webhooks**
3. **Set up Slack/email alerts**

## 📚 Best Practices

### 1. Security
- ✅ Use secrets for sensitive data
- ✅ Regular security audits
- ✅ Dependency vulnerability scanning
- ✅ Least privilege access

### 2. Performance
- ✅ Parallel job execution
- ✅ Efficient caching
- ✅ Build optimization
- ✅ Performance monitoring

### 3. Reliability
- ✅ Comprehensive testing
- ✅ Rollback strategies
- ✅ Health checks
- ✅ Monitoring and alerting

### 4. Maintainability
- ✅ Clear documentation
- ✅ Consistent naming
- ✅ Modular workflows
- ✅ Regular updates

## 🎯 Success Metrics

### Deployment Success Rate: 95%+
### Test Coverage: 70%+
### Build Time: < 5 minutes
### Security Score: A+
### Performance Score: 80%+

The CI/CD pipeline ensures reliable, secure, and efficient deployment of the Project Budget Management Application! 🚀

#!/bin/bash

# CI/CD Pipeline Local Testing Script
# This script helps test the CI/CD pipeline locally before pushing to GitHub

set -e

echo "🚀 Starting CI/CD Pipeline Local Testing"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Running CI/CD pipeline tests locally..."

# Step 1: Install dependencies
print_status "Step 1: Installing dependencies..."
if npm ci; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 2: Run ESLint
print_status "Step 2: Running ESLint..."
if npx eslint src/ --ext .js,.jsx; then
    print_success "ESLint passed"
else
    print_warning "ESLint found issues (this might be expected)"
fi

# Step 3: Run tests
print_status "Step 3: Running tests..."
if npm run test:coverage; then
    print_success "Tests passed"
else
    print_error "Tests failed"
    exit 1
fi

# Step 4: Build application
print_status "Step 4: Building application..."
if npm run build; then
    print_success "Build successful"
else
    print_error "Build failed"
    exit 1
fi

# Step 5: Check build size
print_status "Step 5: Analyzing build size..."
echo "Build size analysis:"
du -sh build/
echo "Largest files:"
find build/ -type f -exec du -h {} + | sort -hr | head -10

# Step 6: Security audit
print_status "Step 6: Running security audit..."
if npm audit --audit-level=moderate; then
    print_success "Security audit passed"
else
    print_warning "Security audit found issues"
fi

# Step 7: Check for outdated dependencies
print_status "Step 7: Checking for outdated dependencies..."
npm outdated || print_warning "Some dependencies are outdated"

# Step 8: Database connection test (if environment variable is set)
if [ ! -z "$REACT_APP_NEON_DATABASE_URL" ]; then
    print_status "Step 8: Testing database connection..."
    if npm run test-db; then
        print_success "Database connection successful"
    else
        print_warning "Database connection failed (check your environment variables)"
    fi
else
    print_warning "Step 8: Skipping database test (REACT_APP_NEON_DATABASE_URL not set)"
fi

# Step 9: Performance check (if Lighthouse is available)
if command -v lighthouse &> /dev/null; then
    print_status "Step 9: Running Lighthouse performance check..."
    if lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless"; then
        print_success "Lighthouse performance check completed"
    else
        print_warning "Lighthouse performance check failed"
    fi
else
    print_warning "Step 9: Skipping Lighthouse check (lighthouse not installed)"
fi

# Summary
echo ""
echo "🎉 CI/CD Pipeline Local Testing Complete!"
echo "========================================"
print_success "All critical checks passed!"
echo ""
echo "Next steps:"
echo "1. Review any warnings above"
echo "2. Commit your changes"
echo "3. Push to GitHub to trigger the full CI/CD pipeline"
echo ""
echo "To push to GitHub:"
echo "  git add ."
echo "  git commit -m 'your commit message'"
echo "  git push origin your-branch"
echo ""
echo "To create a pull request:"
echo "  gh pr create --title 'Your PR Title' --body 'Your PR description'"
echo ""

# Cleanup
print_status "Cleaning up temporary files..."
rm -f lighthouse-report.json 2>/dev/null || true

print_success "Local testing complete! 🚀"

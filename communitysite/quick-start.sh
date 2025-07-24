#!/bin/bash

# OPENGEEK Community Quick Start Script
# This script helps you set up the complete platform quickly

set -e

echo "🚀 OPENGEEK Community Quick Start"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    echo "🔍 Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL client not found. Make sure PostgreSQL is installed."
    fi
    
    print_status "Requirements check completed"
    echo ""
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    # Backend dependencies
    print_info "Installing backend dependencies..."
    cd server
    npm install
    cd ..
    
    # Frontend dependencies
    print_info "Installing frontend dependencies..."
    cd client
    npm install
    cd ..
    
    print_status "Dependencies installed successfully"
    echo ""
}

# Setup environment files
setup_environment() {
    echo "⚙️  Setting up environment files..."
    
    # Backend environment
    if [ ! -f "server/.env" ]; then
        cp server/.env.example server/.env
        print_info "Created server/.env from template"
        print_warning "Please edit server/.env with your actual configuration"
    else
        print_info "server/.env already exists"
    fi
    
    # Frontend environment
    if [ ! -f "client/.env.local" ]; then
        print_info "Created client/.env.local from template"
        print_warning "Please edit client/.env.local with your Clerk keys"
    else
        print_info "client/.env.local already exists"
    fi
    
    print_status "Environment files setup completed"
    echo ""
}

# Setup database
setup_database() {
    echo "🗄️  Setting up database..."
    
    print_info "Make sure PostgreSQL is running and you have created the database:"
    print_info "createdb opengeek_community"
    echo ""
    
    read -p "Have you created the database? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd server
        print_info "Running database migrations..."
        npm run migrate
        
        read -p "Do you want to seed sample data? (y/n): " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Seeding sample data..."
            npm run seed
        fi
        
        cd ..
        print_status "Database setup completed"
    else
        print_warning "Please create the database first, then run this script again"
        exit 1
    fi
    
    echo ""
}

# Final instructions
show_final_instructions() {
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Configure your environment variables:"
    echo "   - Edit server/.env with your database and Clerk credentials"
    echo "   - Edit client/.env.local with your Clerk publishable key"
    echo ""
    echo "2. Start the development servers:"
    echo "   Terminal 1 (Backend):"
    echo "   cd server && npm run dev"
    echo ""
    echo "   Terminal 2 (Frontend):"
    echo "   cd client && npm run dev"
    echo ""
    echo "3. Open http://localhost:3000 in your browser"
    echo ""
    echo "📚 For detailed setup instructions, see SETUP.md"
    echo ""
    echo "🔧 Useful commands:"
    echo "   npm run migrate    - Run database migrations"
    echo "   npm run seed       - Seed sample data"
    echo "   npm run db:reset   - Reset database"
    echo ""
}

# Main execution
main() {
    check_requirements
    install_dependencies
    setup_environment
    setup_database
    show_final_instructions
}

# Run main function
main
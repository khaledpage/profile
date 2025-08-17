#!/bin/bash

# Deploy to GitHub Pages Script
# This script exports the app, prepares it for GitHub Pages, commits with random message, and pushes

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Random commit messages for variety
commit_messages=(
    "🚀 Deploy latest portfolio updates"
    "✨ Fresh deployment with new features"
    "🔄 Portfolio refresh and optimizations"
    "📦 Build and deploy updated content"
    "🎨 Updated portfolio design and content"
    "⚡ Performance improvements and fixes"
    "🌟 Latest portfolio enhancements"
    "🛠️ Technical updates and refinements"
    "📱 Mobile optimization and improvements"
    "🎯 Enhanced user experience deployment"
    "🔧 Bug fixes and feature updates"
    "💫 Portfolio modernization update"
    "🚀 Automated deployment with improvements"
    "✅ Quality updates and optimizations"
    "🎉 New portfolio features deployed"
    "🔥 Hot deployment with latest changes"
    "📈 Portfolio performance enhancements"
    "🎪 Spectacular portfolio updates"
    "⭐ Star-worthy portfolio improvements"
    "🌈 Colorful portfolio updates deployed"
)

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

# Get random commit message
get_random_commit_message() {
    local random_index=$((RANDOM % ${#commit_messages[@]}))
    echo "${commit_messages[$random_index]}"
}

# Main deployment function
deploy() {
    print_status "Starting GitHub Pages deployment process..."
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository!"
        exit 1
    fi
    
    # Check if there are uncommitted changes in source files
    if ! git diff --quiet; then
        print_warning "You have uncommitted changes. Committing them first..."
        git add .
        source_commit_msg=$(get_random_commit_message)
        git commit -m "📝 $source_commit_msg - source updates"
        print_success "Source changes committed"
    fi
    
    # Clean previous builds
    print_status "Cleaning previous builds..."
    rm -rf .next out docs
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    # Run build and export
    print_status "Building and exporting for production..."
    NODE_ENV=production npm run export
    
    if [ $? -ne 0 ]; then
        print_error "Build failed!"
        exit 1
    fi
    
    # Verify docs folder was created
    if [ ! -d "docs" ]; then
        print_error "Export failed - docs folder not created!"
        exit 1
    fi
    
    # Add custom domain file if it exists in root
    if [ -f "CNAME" ]; then
        print_status "Adding custom domain configuration..."
        cp CNAME docs/
    fi
    
    # Add robots.txt to docs if it doesn't exist
    if [ ! -f "docs/robots.txt" ]; then
        print_status "Adding robots.txt..."
        echo "User-agent: *" > docs/robots.txt
        echo "Allow: /" >> docs/robots.txt
        echo "Sitemap: https://www.alabsi.space/sitemap.xml" >> docs/robots.txt
    fi
    
    # Verify build contents
    file_count=$(find docs -type f | wc -l)
    if [ "$file_count" -lt 5 ]; then
        print_error "Build seems incomplete - only $file_count files generated!"
        exit 1
    fi
    
    # Get a random commit message
    commit_message=$(get_random_commit_message)
    
    # Stage all changes
    print_status "Staging changes for commit..."
    git add .
    
    # Check if there are changes to commit
    if git diff --cached --quiet; then
        print_warning "No changes to commit!"
        exit 0
    fi
    
    # Commit with random message
    print_status "Committing changes with message: '$commit_message'"
    git commit -m "$commit_message"
    
    # Push to remote
    print_status "Pushing to GitHub..."
    current_branch=$(git branch --show-current)
    git push origin "$current_branch"
    
    if [ $? -eq 0 ]; then
        print_success "🎉 Successfully deployed to GitHub Pages!"
        print_success "📁 Files exported to docs/ folder"
        print_success "💬 Commit message: '$commit_message'"
        print_success "🌐 Your site should be available at: https://khaledpage.github.io/profile"
        print_success "🔗 Or at your custom domain if configured"
        
        # Show some stats
        echo ""
        print_status "📊 Deployment Statistics:"
        echo "   • Files deployed: $(find docs -type f | wc -l | tr -d ' ')"
        echo "   • Total size: $(du -sh docs | cut -f1)"
        echo "   • Commit hash: $(git rev-parse --short HEAD)"
        echo "   • Branch: $current_branch"
        echo "   • Timestamp: $(date)"
    else
        print_error "Push failed!"
        exit 1
    fi
}

# Check for help flag
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    echo "GitHub Pages Deployment Script"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "This script will:"
    echo "  1. Clean previous builds"
    echo "  2. Build and export the Next.js app"
    echo "  3. Prepare files for GitHub Pages"
    echo "  4. Commit changes with a random message"
    echo "  5. Push to GitHub"
    echo ""
    echo "Options:"
    echo "  -h, --help    Show this help message"
    echo ""
    echo "Prerequisites:"
    echo "  • Must be run from the project root"
    echo "  • Git repository must be initialized"
    echo "  • Remote origin must be configured"
    echo "  • Node.js and npm must be installed"
    exit 0
fi

# Run the deployment
deploy

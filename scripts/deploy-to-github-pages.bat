@echo off
REM Deploy to GitHub Pages Script (Windows)
REM This script exports the app, prepares it for GitHub Pages, commits with random message, and pushes

setlocal enabledelayedexpansion

echo [INFO] Starting GitHub Pages deployment process...

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Not in a git repository!
    exit /b 1
)

REM Random commit messages array simulation for Windows
set /a rand=%random% %% 20
if %rand%==0 set commit_msg=🚀 Deploy latest portfolio updates
if %rand%==1 set commit_msg=✨ Fresh deployment with new features
if %rand%==2 set commit_msg=🔄 Portfolio refresh and optimizations
if %rand%==3 set commit_msg=📦 Build and deploy updated content
if %rand%==4 set commit_msg=🎨 Updated portfolio design and content
if %rand%==5 set commit_msg=⚡ Performance improvements and fixes
if %rand%==6 set commit_msg=🌟 Latest portfolio enhancements
if %rand%==7 set commit_msg=🛠️ Technical updates and refinements
if %rand%==8 set commit_msg=📱 Mobile optimization and improvements
if %rand%==9 set commit_msg=🎯 Enhanced user experience deployment
if %rand%==10 set commit_msg=🔧 Bug fixes and feature updates
if %rand%==11 set commit_msg=💫 Portfolio modernization update
if %rand%==12 set commit_msg=🚀 Automated deployment with improvements
if %rand%==13 set commit_msg=✅ Quality updates and optimizations
if %rand%==14 set commit_msg=🎉 New portfolio features deployed
if %rand%==15 set commit_msg=🔥 Hot deployment with latest changes
if %rand%==16 set commit_msg=📈 Portfolio performance enhancements
if %rand%==17 set commit_msg=🎪 Spectacular portfolio updates
if %rand%==18 set commit_msg=⭐ Star-worthy portfolio improvements
if %rand%==19 set commit_msg=🌈 Colorful portfolio updates deployed

REM Check for uncommitted changes
git diff --quiet
if errorlevel 1 (
    echo [WARNING] You have uncommitted changes. Committing them first...
    git add .
    git commit -m "📝 Source updates before deployment"
    echo [SUCCESS] Source changes committed
)

REM Clean previous builds
echo [INFO] Cleaning previous builds...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist docs rmdir /s /q docs

REM Install dependencies if needed
if not exist node_modules (
    echo [INFO] Installing dependencies...
    npm install
)

REM Run build and export
echo [INFO] Building and exporting for production...
set NODE_ENV=production
npm run export

if errorlevel 1 (
    echo [ERROR] Build failed!
    exit /b 1
)

REM Verify docs folder was created
if not exist docs (
    echo [ERROR] Export failed - docs folder not created!
    exit /b 1
)

REM Add custom domain file if it exists
if exist CNAME (
    echo [INFO] Adding custom domain configuration...
    copy CNAME docs\
)

REM Add robots.txt if it doesn't exist
if not exist docs\robots.txt (
    echo [INFO] Adding robots.txt...
    echo User-agent: * > docs\robots.txt
    echo Allow: / >> docs\robots.txt
    echo Sitemap: https://www.alabsi.space/sitemap.xml >> docs\robots.txt
)

REM Stage all changes
echo [INFO] Staging changes for commit...
git add .

REM Check if there are changes to commit
git diff --cached --quiet
if not errorlevel 1 (
    echo [WARNING] No changes to commit!
    exit /b 0
)

REM Commit with random message
echo [INFO] Committing changes with message: '%commit_msg%'
git commit -m "%commit_msg%"

REM Push to remote
echo [INFO] Pushing to GitHub...
for /f "tokens=*" %%a in ('git branch --show-current') do set current_branch=%%a
git push origin %current_branch%

if not errorlevel 1 (
    echo [SUCCESS] 🎉 Successfully deployed to GitHub Pages!
    echo [SUCCESS] 📁 Files exported to docs/ folder
    echo [SUCCESS] 💬 Commit message: '%commit_msg%'
    echo [SUCCESS] 🌐 Your site should be available at: https://khaledpage.github.io/profile
    echo [SUCCESS] 🔗 Or at your custom domain if configured
) else (
    echo [ERROR] Push failed!
    exit /b 1
)

endlocal

#!/bin/bash

# Build script for GitHub Pages deployment
# This script creates a static version suitable for GitHub Pages

set -e

echo "🚀 Starting GitHub Pages build process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf docs

# Create docs directory structure
echo "📁 Creating docs directory structure..."
mkdir -p docs

# Copy static assets from public
echo "📋 Copying public assets..."
if [ -d "public" ]; then
    cp -r public/* docs/
fi

# Create basic HTML structure for GitHub Pages
echo "🏗️  Creating static HTML files..."

# Create index.html
cat > docs/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Khaled Alabsi - Full-Stack Developer</title>
    <meta name="description" content="Full-Stack Developer specializing in React, Next.js, and modern web technologies.">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #0f0f23;
            --bg-secondary: #1a1a35;
            --text-primary: #ffffff;
            --text-secondary: #a1a1aa;
            --accent-1: #8b5cf6;
            --accent-2: #3b82f6;
        }
        body { 
            background: var(--bg-primary); 
            color: var(--text-primary); 
            font-family: 'Inter', sans-serif; 
        }
        .gradient-bg {
            background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
        }
        .glass {
            backdrop-filter: blur(12px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <div class="min-h-screen">
        <!-- Hero Section -->
        <section class="py-20 px-4 text-center">
            <div class="max-w-4xl mx-auto">
                <h1 class="text-5xl md:text-7xl font-bold mb-6">
                    Khaled Alabsi
                </h1>
                <p class="text-xl md:text-2xl text-gray-300 mb-8">
                    Full-Stack Developer
                </p>
                <p class="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
                    Passionate developer with expertise in modern web technologies, creating scalable and user-friendly applications with React, Next.js, and TypeScript.
                </p>
                <div class="flex flex-wrap gap-4 justify-center">
                    <a href="#projects" class="gradient-bg px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        View Projects
                    </a>
                    <a href="#contact" class="border border-gray-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                        Get In Touch
                    </a>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="py-20 px-4">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-4xl font-bold text-center mb-16">About Me</h2>
                <div class="grid lg:grid-cols-2 gap-12 items-center">
                    <div class="space-y-8">
                        <div class="w-64 h-64 mx-auto lg:mx-0 rounded-full gradient-bg p-2">
                            <div class="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-6xl font-bold">
                                K
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="glass rounded-xl p-4 text-center">
                                <div class="text-2xl font-bold text-purple-400">5+</div>
                                <div class="text-sm text-gray-400">Years</div>
                            </div>
                            <div class="glass rounded-xl p-4 text-center">
                                <div class="text-2xl font-bold text-purple-400">40+</div>
                                <div class="text-sm text-gray-400">Projects</div>
                            </div>
                            <div class="glass rounded-xl p-4 text-center">
                                <div class="text-2xl font-bold text-purple-400">React</div>
                                <div class="text-sm text-gray-400">Tech Focus</div>
                            </div>
                            <div class="glass rounded-xl p-4 text-center">
                                <div class="text-2xl font-bold text-purple-400">Remote</div>
                                <div class="text-sm text-gray-400">Location</div>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-8">
                        <div class="glass rounded-2xl p-8">
                            <h3 class="text-2xl font-bold mb-4">My Profile</h3>
                            <p class="text-lg leading-relaxed text-gray-300">
                                Passionate developer with expertise in modern web technologies, creating scalable and user-friendly applications with React, Next.js, and TypeScript. I combine technical expertise with creative design to deliver exceptional digital solutions.
                            </p>
                        </div>
                        <div class="glass rounded-2xl p-8">
                            <h3 class="text-2xl font-bold mb-6">Professional Experience</h3>
                            <div class="space-y-6">
                                <div class="flex gap-4">
                                    <div class="w-12 h-12 rounded-full glass flex items-center justify-center">
                                        <div class="w-6 h-6 rounded-full bg-purple-400"></div>
                                    </div>
                                    <div class="flex-1">
                                        <h4 class="font-semibold">Senior Full-Stack Developer</h4>
                                        <div class="text-sm text-purple-400 font-medium mb-2">Tech Innovation GmbH</div>
                                        <p class="text-sm text-gray-400">Lead development of modern web applications using React, Next.js, and TypeScript.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Projects Section -->
        <section id="projects" class="py-20 px-4">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-4xl font-bold text-center mb-16">Featured Projects</h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div class="glass rounded-xl overflow-hidden hover:scale-105 transition-transform">
                        <div class="h-48 bg-gradient-to-br from-purple-500 to-blue-600"></div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2">E-Commerce Platform</h3>
                            <p class="text-gray-400 mb-4">Modern e-commerce solution built with React and Node.js</p>
                            <div class="flex gap-2 flex-wrap">
                                <span class="text-xs bg-purple-600 px-2 py-1 rounded">React</span>
                                <span class="text-xs bg-blue-600 px-2 py-1 rounded">TypeScript</span>
                                <span class="text-xs bg-green-600 px-2 py-1 rounded">Node.js</span>
                            </div>
                        </div>
                    </div>
                    <div class="glass rounded-xl overflow-hidden hover:scale-105 transition-transform">
                        <div class="h-48 bg-gradient-to-br from-blue-500 to-green-600"></div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2">Smart Dashboard</h3>
                            <p class="text-gray-400 mb-4">Real-time analytics dashboard with data visualization</p>
                            <div class="flex gap-2 flex-wrap">
                                <span class="text-xs bg-purple-600 px-2 py-1 rounded">Next.js</span>
                                <span class="text-xs bg-blue-600 px-2 py-1 rounded">Chart.js</span>
                                <span class="text-xs bg-yellow-600 px-2 py-1 rounded">Socket.io</span>
                            </div>
                        </div>
                    </div>
                    <div class="glass rounded-xl overflow-hidden hover:scale-105 transition-transform">
                        <div class="h-48 bg-gradient-to-br from-green-500 to-purple-600"></div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2">Mobile Banking App</h3>
                            <p class="text-gray-400 mb-4">Secure mobile banking application with modern UI</p>
                            <div class="flex gap-2 flex-wrap">
                                <span class="text-xs bg-purple-600 px-2 py-1 rounded">React Native</span>
                                <span class="text-xs bg-blue-600 px-2 py-1 rounded">TypeScript</span>
                                <span class="text-xs bg-red-600 px-2 py-1 rounded">Security</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="py-20 px-4">
            <div class="max-w-4xl mx-auto text-center">
                <h2 class="text-4xl font-bold mb-8">Get In Touch</h2>
                <p class="text-xl text-gray-300 mb-12">
                    Ready to work together? Let's create something amazing!
                </p>
                <div class="flex flex-wrap gap-6 justify-center">
                    <a href="mailto:khaled@example.com" class="gradient-bg px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        Send Email
                    </a>
                    <a href="https://linkedin.com/in/khaled-alabsi" target="_blank" class="border border-gray-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                        LinkedIn
                    </a>
                    <a href="https://github.com/khaledalabsi" target="_blank" class="border border-gray-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                        GitHub
                    </a>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="py-12 px-4 border-t border-gray-800">
            <div class="max-w-6xl mx-auto text-center">
                <p class="text-gray-400">
                    © 2025 Khaled Alabsi. Built for GitHub Pages.
                </p>
            </div>
        </footer>
    </div>

    <script>
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>
EOF

# Create .nojekyll file to prevent Jekyll processing
echo "� Creating .nojekyll file..."
touch docs/.nojekyll

# Create README for GitHub Pages
cat > docs/README.md << 'EOF'
# Khaled Alabsi - Portfolio

This is a static version of my portfolio website, optimized for GitHub Pages.

## Features

- Responsive design
- Modern UI with glass morphism effects
- Project showcase
- About section with professional experience
- Contact information

## Technologies

- HTML5
- CSS3 (with Tailwind CSS)
- JavaScript (ES6+)
- GitHub Pages

## Contact

- Email: khaled@example.com
- LinkedIn: [linkedin.com/in/khaled-alabsi](https://linkedin.com/in/khaled-alabsi)
- GitHub: [github.com/khaledalabsi](https://github.com/khaledalabsi)
EOF

# Create deployment info
echo "📊 Creating deployment info..."
cat > docs/deployment-info.json << EOF
{
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "buildVersion": "$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')",
  "type": "static-html",
  "features": [
    "responsive-design",
    "modern-ui",
    "project-showcase",
    "contact-section",
    "glass-morphism-effects"
  ]
}
EOF

echo "✅ GitHub Pages build completed successfully!"
echo "📁 Static files are ready in the /docs directory"
echo "🌍 Your site will be available at: https://username.github.io/repository-name"
echo ""
echo "🏗️  This static build includes:"
echo "   ✓ Responsive single-page portfolio"
echo "   ✓ Modern UI with glass morphism effects"
echo "   ✓ Project showcase section"
echo "   ✓ Professional about section"
echo "   ✓ Contact information and links"
echo "   ✓ Smooth scrolling navigation"
echo ""
echo "Next steps:"
echo "1. Commit and push the /docs directory to your GitHub repository"
echo "2. Go to your repository Settings > Pages"
echo "3. Select 'Deploy from a branch' and choose 'main' branch with '/docs' folder"
echo "4. Your site will be live in a few minutes!"

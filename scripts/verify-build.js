#!/usr/bin/env node

/**
 * Build Verification Script for Vercel Deployment
 * Checks build output, bundle sizes, and configuration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`, exists ? 'green' : 'red');
  return exists;
}

function checkBuildOutput() {
  log('\n📦 Checking Build Output...', 'blue');
  
  const buildDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(buildDir, 'static');
  
  checkFile(buildDir, 'Build directory');
  checkFile(path.join(buildDir, 'BUILD_ID'), 'Build ID file');
  checkFile(staticDir, 'Static assets directory');
  checkFile(path.join(buildDir, 'server'), 'Server directory');
}

function checkBundleSize() {
  log('\n📊 Checking Bundle Sizes...', 'blue');
  
  try {
    const buildManifest = path.join(process.cwd(), '.next', 'build-manifest.json');
    if (fs.existsSync(buildManifest)) {
      const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
      const pages = manifest.pages;
      
      Object.entries(pages).forEach(([page, files]) => {
        const totalSize = files.reduce((acc, file) => {
          const filePath = path.join(process.cwd(), '.next', file);
          if (fs.existsSync(filePath)) {
            return acc + fs.statSync(filePath).size;
          }
          return acc;
        }, 0);
        
        const sizeKB = Math.round(totalSize / 1024);
        const color = sizeKB > 200 ? 'red' : sizeKB > 100 ? 'yellow' : 'green';
        log(`  ${page}: ${sizeKB}KB`, color);
      });
    }
  } catch (error) {
    log('❌ Could not analyze bundle sizes', 'red');
  }
}

function checkConfiguration() {
  log('\n⚙️  Checking Configuration...', 'blue');
  
  checkFile('vercel.json', 'Vercel configuration');
  checkFile('next.config.js', 'Next.js configuration');
  checkFile('.env.production.example', 'Production environment template');
  
  // Check vercel.json content
  try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    
    // Check permissions policy
    const headers = vercelConfig.headers || [];
    const permissionsHeader = headers.find(h => 
      h.headers && h.headers.find(header => header.key === 'Permissions-Policy')
    );
    
    if (permissionsHeader) {
      const permissionsValue = permissionsHeader.headers.find(h => h.key === 'Permissions-Policy').value;
      const hasCamera = permissionsValue.includes('camera=(self)');
      const hasMicrophone = permissionsValue.includes('microphone=(self)');
      
      log(`${hasCamera ? '✅' : '❌'} Camera permissions configured`, hasCamera ? 'green' : 'red');
      log(`${hasMicrophone ? '✅' : '❌'} Microphone permissions configured`, hasMicrophone ? 'green' : 'red');
    } else {
      log('❌ Permissions-Policy header not found', 'red');
    }
    
  } catch (error) {
    log('❌ Could not parse vercel.json', 'red');
  }
}

function checkEnvironmentVariables() {
  log('\n🔐 Checking Environment Variables...', 'blue');
  
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'GOOGLE_AI_API_KEY',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];
  
  requiredVars.forEach(varName => {
    const exists = process.env[varName] !== undefined;
    log(`${exists ? '✅' : '⚠️ '} ${varName}`, exists ? 'green' : 'yellow');
  });
  
  log('\n💡 Note: Environment variables should be set in Vercel dashboard for production', 'blue');
}

function runTypeCheck() {
  log('\n🔍 Running TypeScript Check...', 'blue');
  
  try {
    execSync('npm run typecheck', { stdio: 'pipe' });
    log('✅ TypeScript check passed', 'green');
  } catch (error) {
    log('❌ TypeScript check failed', 'red');
    console.log(error.stdout?.toString());
  }
}

function runLinting() {
  log('\n🧹 Running Linting...', 'blue');
  
  try {
    execSync('npm run lint', { stdio: 'pipe' });
    log('✅ Linting passed', 'green');
  } catch (error) {
    log('❌ Linting failed', 'red');
    console.log(error.stdout?.toString());
  }
}

function checkPackageJson() {
  log('\n📋 Checking Package.json Scripts...', 'blue');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const scripts = packageJson.scripts || {};
    
    const requiredScripts = [
      'build',
      'build:vercel',
      'start',
      'typecheck',
      'lint'
    ];
    
    requiredScripts.forEach(script => {
      const exists = scripts[script] !== undefined;
      log(`${exists ? '✅' : '❌'} ${script} script`, exists ? 'green' : 'red');
    });
    
  } catch (error) {
    log('❌ Could not parse package.json', 'red');
  }
}

function main() {
  log('🚀 Vercel Build Verification', 'blue');
  log('================================', 'blue');
  
  checkConfiguration();
  checkPackageJson();
  checkBuildOutput();
  checkBundleSize();
  checkEnvironmentVariables();
  runTypeCheck();
  runLinting();
  
  log('\n🎯 Verification Complete!', 'blue');
  log('================================', 'blue');
  log('Next steps:', 'yellow');
  log('1. Set environment variables in Vercel dashboard', 'yellow');
  log('2. Run: vercel --prod', 'yellow');
  log('3. Test the deployed application', 'yellow');
}

if (require.main === module) {
  main();
}

module.exports = {
  checkFile,
  checkBuildOutput,
  checkBundleSize,
  checkConfiguration,
  checkEnvironmentVariables,
  runTypeCheck,
  runLinting,
  checkPackageJson
};
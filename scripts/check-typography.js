#!/usr/bin/env node

/**
 * Typography and Design Consistency Scanner
 * 
 * This script scans the codebase for typography and design inconsistencies
 * by looking for:
 * 1. Inconsistent font sizes
 * 2. Inconsistent icon sizes
 * 3. Non-standard colors outside the design system
 * 4. Inconsistent spacing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SRC_DIR = path.resolve(__dirname, '../src');
const IGNORE_DIRS = ['node_modules', 'build', 'dist', '.git'];
const FILE_EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js'];

// Design system typography standards
const STANDARD_FONT_SIZES = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];
const STANDARD_ICON_SIZES = ['w-4 h-4', 'w-5 h-5', 'w-6 h-6'];
const STANDARD_COLORS = [
  'primary-50', 'primary-100', 'primary-200', 'primary-300', 'primary-400', 
  'primary-500', 'primary-600', 'primary-700', 'primary-800', 'primary-900',
  'gray-50', 'gray-100', 'gray-200', 'gray-300', 'gray-400',
  'gray-500', 'gray-600', 'gray-700', 'gray-800', 'gray-900',
  'risk-red', 'light-bg', 'light-bg-alt', 'light-border', 'light-text', 'light-text-secondary'
];

// Tracking issues
const issues = {
  nonStandardFontSizes: [],
  inconsistentIconSizes: [],
  nonStandardColors: [],
  inconsistentSpacing: []
};

/**
 * Find all files with the specified extensions in the directory
 */
function findFiles(dir, extensions, ignoreList = []) {
  if (ignoreList.some(ignored => dir.includes(ignored))) {
    return [];
  }

  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath, extensions, ignoreList));
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });

  return results;
}

/**
 * Check for non-standard font sizes
 */
function checkFontSizes(content, filePath) {
  // Find all text-size classes in the content
  const fontSizePattern = /text-(\w+)/g;
  let match;
  
  while ((match = fontSizePattern.exec(content)) !== null) {
    const fullMatch = match[0];
    if (!STANDARD_FONT_SIZES.includes(fullMatch)) {
      // Exclude the ones with dynamic values like text-[0.65rem]
      if (!fullMatch.includes('[')) {
        issues.nonStandardFontSizes.push({
          file: filePath,
          value: fullMatch
        });
      }
    }
  }
}

/**
 * Check for inconsistent icon sizes
 */
function checkIconSizes(content, filePath) {
  // Find width classes
  const widthPattern = /w-(\d+)/g;
  const heightPattern = /h-(\d+)/g;
  
  const widths = [];
  const heights = [];
  
  let match;
  while ((match = widthPattern.exec(content)) !== null) {
    widths.push(match[0]);
  }
  
  while ((match = heightPattern.exec(content)) !== null) {
    heights.push(match[0]);
  }
  
  // Check if there are widths without corresponding heights
  widths.forEach(width => {
    const size = width.split('-')[1];
    const expectedHeight = `h-${size}`;
    
    // This is a simple check and may produce false positives
    if (!heights.includes(expectedHeight)) {
      issues.inconsistentIconSizes.push({
        file: filePath,
        value: `${width} without matching ${expectedHeight}`
      });
    }
  });
}

/**
 * Check for non-standard colors
 */
function checkColors(content, filePath) {
  // Find color classes (text-*, bg-*, border-*)
  const colorPatterns = [
    /text-([a-z]+-\d+)/g,
    /bg-([a-z]+-\d+)/g,
    /border-([a-z]+-\d+)/g
  ];
  
  colorPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const colorValue = match[1];
      if (!STANDARD_COLORS.some(color => colorValue.includes(color))) {
        // Exclude dynamic values
        if (!colorValue.includes('[')) {
          issues.nonStandardColors.push({
            file: filePath,
            value: match[0]
          });
        }
      }
    }
  });
}

/**
 * Check for inconsistent spacing
 */
function checkSpacing(content, filePath) {
  // This is a simplified check that may need refinement
  const marginPattern = /m[trblxy]?-(\d+)/g;
  const paddingPattern = /p[trblxy]?-(\d+)/g;
  
  const margins = new Set();
  const paddings = new Set();
  
  let match;
  while ((match = marginPattern.exec(content)) !== null) {
    margins.add(parseInt(match[1]));
  }
  
  while ((match = paddingPattern.exec(content)) !== null) {
    paddings.add(parseInt(match[1]));
  }
  
  // Check for unusual spacing values (very subjective)
  const unusualMargins = [...margins].filter(m => m > 12);
  const unusualPaddings = [...paddings].filter(p => p > 12);
  
  if (unusualMargins.length > 0) {
    issues.inconsistentSpacing.push({
      file: filePath,
      value: `Unusual margin values: ${unusualMargins.join(', ')}`
    });
  }
  
  if (unusualPaddings.length > 0) {
    issues.inconsistentSpacing.push({
      file: filePath,
      value: `Unusual padding values: ${unusualPaddings.join(', ')}`
    });
  }
}

/**
 * Process a single file
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  checkFontSizes(content, filePath);
  checkIconSizes(content, filePath);
  checkColors(content, filePath);
  checkSpacing(content, filePath);
}

/**
 * Main execution function
 */
function main() {
  console.log('🔍 Scanning codebase for typography and design inconsistencies...');
  
  const files = findFiles(SRC_DIR, FILE_EXTENSIONS, IGNORE_DIRS);
  console.log(`Found ${files.length} files to analyze`);
  
  files.forEach(file => {
    processFile(file);
  });
  
  // Print results
  console.log('\n===== SCAN RESULTS =====\n');
  
  console.log(`🔤 Non-standard font sizes: ${issues.nonStandardFontSizes.length}`);
  if (issues.nonStandardFontSizes.length > 0) {
    console.log('  Allowed font sizes: ' + STANDARD_FONT_SIZES.join(', '));
    issues.nonStandardFontSizes.slice(0, 10).forEach(issue => {
      console.log(`  • ${issue.file}: ${issue.value}`);
    });
    if (issues.nonStandardFontSizes.length > 10) {
      console.log(`  ... and ${issues.nonStandardFontSizes.length - 10} more`);
    }
  }
  
  console.log(`\n📏 Inconsistent icon sizes: ${issues.inconsistentIconSizes.length}`);
  if (issues.inconsistentIconSizes.length > 0) {
    console.log('  Recommended icon size pairs: ' + STANDARD_ICON_SIZES.join(', '));
    issues.inconsistentIconSizes.slice(0, 10).forEach(issue => {
      console.log(`  • ${issue.file}: ${issue.value}`);
    });
    if (issues.inconsistentIconSizes.length > 10) {
      console.log(`  ... and ${issues.inconsistentIconSizes.length - 10} more`);
    }
  }
  
  console.log(`\n🎨 Non-standard colors: ${issues.nonStandardColors.length}`);
  if (issues.nonStandardColors.length > 0) {
    console.log('  Colors should use the design system palette');
    issues.nonStandardColors.slice(0, 10).forEach(issue => {
      console.log(`  • ${issue.file}: ${issue.value}`);
    });
    if (issues.nonStandardColors.length > 10) {
      console.log(`  ... and ${issues.nonStandardColors.length - 10} more`);
    }
  }
  
  console.log(`\n⚖️ Inconsistent spacing: ${issues.inconsistentSpacing.length}`);
  if (issues.inconsistentSpacing.length > 0) {
    console.log('  Spacing should be consistent throughout the app');
    issues.inconsistentSpacing.slice(0, 10).forEach(issue => {
      console.log(`  • ${issue.file}: ${issue.value}`);
    });
    if (issues.inconsistentSpacing.length > 10) {
      console.log(`  ... and ${issues.inconsistentSpacing.length - 10} more`);
    }
  }
  
  const totalIssues = 
    issues.nonStandardFontSizes.length + 
    issues.inconsistentIconSizes.length + 
    issues.nonStandardColors.length + 
    issues.inconsistentSpacing.length;
  
  console.log(`\n===== SUMMARY =====`);
  console.log(`Total files scanned: ${files.length}`);
  console.log(`Total issues found: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log('✅ No typography or design inconsistencies found!');
  } else {
    console.log('❌ Typography and design inconsistencies were found.');
    console.log('   Consider addressing these issues to improve design consistency.');
  }
}

// Run the main function
main(); 
#!/usr/bin/env node

/**
 * Script to identify remaining CommonJS patterns in scripts directory
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkCommonJSPatterns() {
  console.log('🔍 Checking for CommonJS patterns in scripts...\n');
  
  const scriptsDir = __dirname;
  const files = await fs.readdir(scriptsDir);
  const jsFiles = files.filter(file => file.endsWith('.js') && file !== 'check-commonjs-patterns.js');
  
  const commonjsPatterns = [
    /require\s*\(/,
    /module\.exports/,
    /exports\./,
    /require\.main === module/
  ];
  
  const problematicFiles = [];
  
  for (const file of jsFiles) {
    try {
      const filePath = path.join(scriptsDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      
      const foundPatterns = [];
      commonjsPatterns.forEach((pattern, index) => {
        if (pattern.test(content)) {
          const patternNames = ['require()', 'module.exports', 'exports.', 'require.main'];
          foundPatterns.push(patternNames[index]);
        }
      });
      
      if (foundPatterns.length > 0) {
        problematicFiles.push({
          file,
          patterns: foundPatterns
        });
      }
    } catch (error) {
      console.warn(`⚠️ Could not read ${file}: ${error.message}`);
    }
  }
  
  if (problematicFiles.length === 0) {
    console.log('✅ No CommonJS patterns found in scripts directory!');
  } else {
    console.log('⚠️ Files with CommonJS patterns found:');
    problematicFiles.forEach(({ file, patterns }) => {
      console.log(`  📄 ${file}: ${patterns.join(', ')}`);
    });
    console.log(`\n❗ Total files needing conversion: ${problematicFiles.length}`);
  }
  
  return problematicFiles;
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkCommonJSPatterns()
    .then((results) => {
      process.exit(results.length > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

export { checkCommonJSPatterns };

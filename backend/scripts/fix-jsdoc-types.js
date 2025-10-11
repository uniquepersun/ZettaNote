#!/usr/bin/env node

/**
 * Script to fix common JSDoc type issues
 * Converts capitalized types (Object, String, Number) to lowercase
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = await glob('src/**/*.js', { ignore: 'node_modules/**' });

let totalFixed = 0;

const typeReplacements = {
  Object: 'object',
  String: 'string',
  Number: 'number',
  Boolean: 'boolean',
  Array: 'Array', // Keep Array capitalized (it's correct)
  Function: 'Function', // Keep Function capitalized
};

console.log('🔧 Fixing JSDoc type capitalization...\n');

files.forEach((file) => {
  let content = readFileSync(file, 'utf8');
  let modified = false;
  let fileFixCount = 0;

  // Fix @param types
  content = content.replace(/@param\s+\{([^}]+)\}/g, (match, types) => {
    let newTypes = types;
    Object.entries(typeReplacements).forEach(([old, newType]) => {
      if (old !== newType && newTypes.includes(old)) {
        newTypes = newTypes.replace(new RegExp(`\\b${old}\\b`, 'g'), newType);
        modified = true;
        fileFixCount++;
      }
    });
    return `@param {${newTypes}}`;
  });

  // Fix @returns types
  content = content.replace(/@returns?\s+\{([^}]+)\}/g, (match, types) => {
    let newTypes = types;
    Object.entries(typeReplacements).forEach(([old, newType]) => {
      if (old !== newType && newTypes.includes(old)) {
        newTypes = newTypes.replace(new RegExp(`\\b${old}\\b`, 'g'), newType);
        modified = true;
        fileFixCount++;
      }
    });
    return `@returns {${newTypes}}`;
  });

  if (modified) {
    writeFileSync(file, content, 'utf8');
    console.log(`✅ Fixed ${fileFixCount} type(s) in: ${file}`);
    totalFixed += fileFixCount;
  }
});

console.log(`\n✨ Done! Fixed ${totalFixed} type capitalization issues.`);
console.log('Run "pnpm lint" to verify the changes.\n');

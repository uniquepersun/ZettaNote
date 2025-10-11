# Code Standards Enforcement Guide

## Overview

This document outlines how we enforce consistent code structure and documentation in the ZettaNote backend.

## 1. Route Documentation Standards

### Required Documentation Format

Every route MUST have JSDoc comments following this structure:

```javascript
/**
 * METHOD /path/to/endpoint
 * @description    Clear description of what this endpoint does
 * @access  Public/Private/Admin
 * @param   {Type} paramName - Description of parameter
 * @returns {Type} Description of return value
 * @throws  {ErrorType} Description of error conditions
 */
router.method(
  '/path',
  middleware,
  asyncHandler(async (req, res) => {
    // Implementation
  })
);
```

### Example from existing code:

```javascript
/**
 * POST /api/auth/signup
 * @description    Register a new user account
 * @access  Public
 * @param   {string} name - User's full name
 * @param   {string} email - User's email address
 * @param   {string} password - User's password (min 12 chars, 1 digit, 1 special char)
 * @returns {Object} User object and JWT token
 * @throws  {400} Validation error or duplicate email
 */
router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage, token } = await signup(req);

    if (token) {
      res.cookie('token', token, {
        /* ... */
      });
    }

    res.status(resStatus).json(resMessage);
  })
);
```

## 2. Controller Documentation Standards

### Required Documentation for Controllers

```javascript
/**
 * Controller Name
 * Purpose of this controller
 * @param {Object} req - Express request object
 * @returns {Object} Response object with resStatus, resMessage, and optional token
 */
export const controllerFunction = async (req) => {
  try {
    // Implementation
    return {
      resStatus: STATUS_CODES.OK,
      resMessage: { message: 'Success', data: result },
    };
  } catch (err) {
    logger.error('Error description', err);
    return {
      resStatus: STATUS_CODES.INTERNAL_SERVER_ERROR,
      resMessage: { message: MESSAGES.GENERAL.SERVER_ERROR },
    };
  }
};
```

## 3. File Structure Standards

### Folder Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── constants/        # Constants and enums
│   ├── controllers/      # Business logic
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # Route definitions
│   ├── utils/            # Utility functions
│   └── mailers/          # Email templates
├── scripts/              # Utility scripts
└── logs/                 # Log files (production)
```

### Naming Conventions

- **Files**: `kebab-case.js` (e.g., `auth.controller.js`)
- **Functions**: `camelCase` (e.g., `getUserById`)
- **Classes**: `PascalCase` (e.g., `UserModel`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `STATUS_CODES`)
- **Private functions**: `_prefixWithUnderscore`

## 4. ESLint Rules for Enforcement

### Install Required Packages

```bash
pnpm add -D eslint-plugin-jsdoc eslint-plugin-import
```

### Update `eslint.config.js`

```javascript
import js from '@eslint/js';
import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  { ignores: ['node_modules', 'dist', 'logs'] },
  {
    files: ['**/*.js'],
    plugins: {
      jsdoc,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,

      // Code Quality
      'no-console': 'error', // Force use of logger
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-debugger': 'error',

      // JSDoc Requirements
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
          contexts: ['ExportNamedDeclaration[declaration.type="FunctionDeclaration"]'],
        },
      ],
      'jsdoc/require-description': 'error',
      'jsdoc/require-param': 'error',
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-param-type': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-description': 'error',
      'jsdoc/require-returns-type': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/check-types': 'error',
      'jsdoc/valid-types': 'error',

      // Import Organization
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
        },
      ],
    },
  },
];
```

## 5. Git Hooks with Husky

### Install Husky and lint-staged

```bash
pnpm add -D husky lint-staged
```

### Initialize Husky

```bash
npx husky init
```

### Add pre-commit hook

Create `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint-staged
```

### Configure lint-staged

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write"]
  }
}
```

## 6. Code Review Checklist Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist

- [ ] All routes have proper JSDoc documentation (@route, @description, @access)
- [ ] All exported functions have JSDoc comments
- [ ] Used logger instead of console.log/error/warn
- [ ] Followed file naming conventions (kebab-case)
- [ ] Added appropriate error handling with try-catch
- [ ] Used STATUS_CODES constants for status codes
- [ ] Used MESSAGES constants for error messages
- [ ] Tested API endpoints manually
- [ ] No ESLint warnings or errors
- [ ] Code follows existing patterns in the project

## Testing

Describe how you tested these changes
```

## 7. Documentation Templates

### Route File Template

Create `templates/route.template.js`:

```javascript
import express from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { yourController } from '../controllers/your.controller.js';

const router = express.Router();

/**
 * METHOD /api/your-route/path
 * @description    Description of what this endpoint does
 * @access  Public/Private/Admin
 * @param   {Type} paramName - Description
 * @returns {Type} Description
 * @throws  {ErrorCode} Description
 */
router.method(
  '/path',
  authenticateUser, // Optional middleware
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await yourController(req);
    res.status(resStatus).json(resMessage);
  })
);

export default router;
```

### Controller File Template

Create `templates/controller.template.js`:

```javascript
import Model from '../models/YourModel.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../utils/logger.js';

/**
 * Your Controller Function
 * Description of what this controller does
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.field - Description of field
 * @returns {Object} Response object with resStatus and resMessage
 * @throws {Error} If operation fails
 */
export const yourController = async (req) => {
  try {
    // Extract and validate input
    const { field } = req.body;

    if (!field) {
      return {
        resStatus: STATUS_CODES.BAD_REQUEST,
        resMessage: { message: 'Field is required' },
      };
    }

    // Business logic
    const result = await Model.findOne({ field });

    // Return success response
    return {
      resStatus: STATUS_CODES.OK,
      resMessage: {
        message: MESSAGES.SUCCESS,
        data: result,
      },
    };
  } catch (err) {
    logger.error('Your controller error', err);
    return {
      resStatus: STATUS_CODES.INTERNAL_SERVER_ERROR,
      resMessage: { message: MESSAGES.GENERAL.SERVER_ERROR },
    };
  }
};
```

## 8. VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript"],
  "javascript.validate.enable": true,
  "javascript.suggestionActions.enabled": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 9. Pre-push Validation Script

Create `scripts/validate-code.js`:

```javascript
#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { glob } from 'glob';

console.log('🔍 Running code validation...\n');

// Check for console.log statements
console.log('1. Checking for console statements...');
try {
  const files = glob.sync('src/**/*.js');
  let hasConsole = false;

  files.forEach((file) => {
    const content = readFileSync(file, 'utf8');
    // Skip logger.js
    if (file.includes('logger.js')) return;

    if (content.match(/console\.(log|error|warn|info|debug)/)) {
      console.error(`❌ Found console statement in: ${file}`);
      hasConsole = true;
    }
  });

  if (hasConsole) {
    console.error('\n❌ Please use logger instead of console\n');
    process.exit(1);
  }
  console.log('✅ No console statements found\n');
} catch (err) {
  console.error('Error checking console statements:', err.message);
}

// Run ESLint
console.log('2. Running ESLint...');
try {
  execSync('pnpm lint', { stdio: 'inherit' });
  console.log('✅ ESLint passed\n');
} catch (err) {
  console.error('❌ ESLint failed\n');
  process.exit(1);
}

// Check for missing route documentation
console.log('3. Checking route documentation...');
try {
  const routeFiles = glob.sync('src/routes/**/*.js');
  let missingDocs = false;

  routeFiles.forEach((file) => {
    const content = readFileSync(file, 'utf8');
    const routerCalls = content.match(/router\.(get|post|put|patch|delete)\(/g) || [];
    const docComments = content.match(/\/\*\*[\s\S]*?@route[\s\S]*?\*\//g) || [];

    if (routerCalls.length > docComments.length) {
      console.error(`❌ Missing @route documentation in: ${file}`);
      missingDocs = true;
    }
  });

  if (missingDocs) {
    console.error('\n❌ Some routes are missing @route documentation\n');
    process.exit(1);
  }
  console.log('✅ All routes have documentation\n');
} catch (err) {
  console.error('Error checking route documentation:', err.message);
}

console.log('✨ All validations passed!\n');
```

Make it executable:

```bash
chmod +x scripts/validate-code.js
```

Add to `package.json`:

```json
{
  "scripts": {
    "validate": "node scripts/validate-code.js",
    "prepush": "npm run validate"
  }
}
```

## 10. CONTRIBUTING.md

Create `CONTRIBUTING.md`:

```markdown
# Contributing to ZettaNote Backend

## Code Standards

### 1. Use Logger, Not Console

❌ `console.log('User created')`
✅ `logger.info('User created', { userId: user.id })`

### 2. Document All Routes

Every route must have JSDoc documentation with @route, @description, @access tags.

### 3. Use Constants

❌ `res.status(200).json({ message: 'Success' })`
✅ `res.status(STATUS_CODES.OK).json({ message: MESSAGES.SUCCESS })`

### 4. Error Handling

Always use try-catch and logger.error() for errors.

### 5. File Naming

Use kebab-case: `user-profile.controller.js`

## Before Committing

1. Run `pnpm lint` - Fix all errors
2. Run `pnpm validate` - Pass all checks
3. Test your endpoints manually
4. Update documentation if needed

## Pull Request Process

1. Fill out the PR template completely
2. Ensure all checkboxes are marked
3. Request review from maintainers
4. Address feedback promptly
```

## Summary

To enforce code structure and documentation:

1. ✅ **Install ESLint plugins** for JSDoc validation
2. ✅ **Configure strict ESLint rules** for documentation
3. ✅ **Set up Husky + lint-staged** for pre-commit validation
4. ✅ **Create PR templates** with checklists
5. ✅ **Provide code templates** for common patterns
6. ✅ **Add validation scripts** to check before push
7. ✅ **Document standards** in CONTRIBUTING.md
8. ✅ **Configure VS Code** for automatic formatting

This ensures all contributors follow the same patterns!

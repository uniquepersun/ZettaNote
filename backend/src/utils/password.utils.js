import crypto from 'crypto';
import { z } from 'zod';

/**
 * Generate a secure random password
 * @param {number} length - Password length (default: 12)
 * @returns {string} Generated password
 */
export const generateSecurePassword = (length = 12) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
  let password = '';

  // Ensure at least one character from each category
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%&*';

  // Add one character from each category
  password += uppercase[crypto.randomInt(uppercase.length)];
  password += lowercase[crypto.randomInt(lowercase.length)];
  password += numbers[crypto.randomInt(numbers.length)];
  password += symbols[crypto.randomInt(symbols.length)];

  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += charset[crypto.randomInt(charset.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

/**
 * Generate a memorable but secure password
 * @returns {string} Generated password
 */
export const generateMemorablePassword = () => {
  const adjectives = ['Swift', 'Bright', 'Quick', 'Smart', 'Bold', 'Fast', 'Sharp', 'Clear'];
  const nouns = ['Tiger', 'Eagle', 'Falcon', 'Lion', 'Wolf', 'Hawk', 'Bear', 'Fox'];
  const numbers = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  const symbols = ['!', '@', '#', '$', '%', '&', '*'];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];

  return `${adjective}${noun}${numbers}${symbol}`;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const requirements = {
    length: password.length >= minLength,
    uppercase: hasUppercase,
    lowercase: hasLowercase,
    numbers: hasNumbers,
    specialChar: hasSpecialChar,
  };

  const score = Object.values(requirements).filter(Boolean).length;

  return {
    isValid: score >= 4 && requirements.length,
    score,
    requirements,
    strength: score >= 5 ? 'Strong' : score >= 4 ? 'Good' : score >= 3 ? 'Fair' : 'Weak',
  };
};

/**
 * Validate password using Zod schema
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with status and message
 */
export const validatePassword = (password) => {
  const passwordSchema = z
    .string()
    .trim()
    .min(12, { message: 'Password must be at least 12 characters' })
    .refine((val) => /\d/.test(val), {
      message: 'Password must have at least 1 digit',
    })
    .refine((val) => /[^a-zA-Z0-9]/.test(val), {
      message: 'Password must have at least 1 symbol',
    });

  const result = passwordSchema.safeParse(password);

  if (!result.success) {
    const errors = JSON.parse(result.error.message);
    return {
      isValid: false,
      error: errors[0]?.message || 'Invalid password',
    };
  }

  return {
    isValid: true,
    message: 'Password is valid',
  };
};

export default {
  generateSecurePassword,
  generateMemorablePassword,
  validatePasswordStrength,
  validatePassword,
};

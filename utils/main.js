/**
 * Main Utilities
 * Core utility functions for the Beer Recipe Manager application
 */

const fs = require('fs');
const path = require('path');

/**
 * Safely parse JSON without throwing exceptions
 * @param {string} jsonString - The JSON string to parse
 * @param {*} defaultValue - Default value to return if parsing fails
 * @returns {*} Parsed object or default value
 */
exports.safeJsonParse = (jsonString, defaultValue = {}) => {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('JSON parsing error:', error.message);
        return defaultValue;
    }
};

/**
 * Format a date to a readable string
 * @param {Date} date - The date to format
 * @param {boolean} includeTime - Whether to include time in the output
 * @returns {string} Formatted date string
 */
exports.formatDate = (date, includeTime = false) => {
    if (!date) return '';

    const d = new Date(date);

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }

    return d.toLocaleDateString('en-US', options);
};

/**
 * Generate a slug from a string
 * @param {string} text - The text to convert to a slug
 * @returns {string} URL-friendly slug
 */
exports.slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/&/g, '-and-')   // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

/**
 * Check if a file exists
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} Whether the file exists
 */
exports.fileExists = async (filePath) => {
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Path to the directory
 * @returns {Promise<void>}
 */
exports.ensureDirectoryExists = async (dirPath) => {
    try {
        await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
};

/**
 * Calculate ABV (Alcohol By Volume) from original and final gravity
 * @param {number} og - Original gravity
 * @param {number} fg - Final gravity
 * @returns {number} ABV percentage
 */
exports.calculateABV = (og, fg) => {
    if (!og || !fg) return 0;
    return ((og - fg) * 131.25).toFixed(1);
};

/**
 * Round a number to specified decimal places
 * @param {number} value - The number to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded number
 */
exports.round = (value, decimals = 2) => {
    if (isNaN(value)) return 0;
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email is valid
 */
exports.isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

/**
 * Convert units of measurement
 */
exports.units = {
    /**
     * Convert kilograms to pounds
     * @param {number} kg - Kilograms
     * @returns {number} Pounds
     */
    kgToLbs: (kg) => kg * 2.20462,

    /**
     * Convert pounds to kilograms
     * @param {number} lbs - Pounds
     * @returns {number} Kilograms
     */
    lbsToKg: (lbs) => lbs / 2.20462,

    /**
     * Convert liters to gallons
     * @param {number} liters - Liters
     * @returns {number} Gallons
     */
    litersToGallons: (liters) => liters * 0.264172,

    /**
     * Convert gallons to liters
     * @param {number} gallons - Gallons
     * @returns {number} Liters
     */
    gallonsToLiters: (gallons) => gallons / 0.264172,

    /**
     * Convert Celsius to Fahrenheit
     * @param {number} celsius - Celsius temperature
     * @returns {number} Fahrenheit temperature
     */
    celsiusToFahrenheit: (celsius) => (celsius * 9 / 5) + 32,

    /**
     * Convert Fahrenheit to Celsius
     * @param {number} fahrenheit - Fahrenheit temperature
     * @returns {number} Celsius temperature
     */
    fahrenheitToCelsius: (fahrenheit) => (fahrenheit - 32) * 5 / 9
};

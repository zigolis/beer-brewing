// utils/recipeHelpers.js

// Convert EBC color value to CSS color
exports.ebcToColor = function (ebc) {
    ebc = Math.max(0, Math.min(80, parseFloat(ebc) || 0));

    // Formulas based on EBC to hex conversion (similar to the GitHub repo in search result #3)
    let r = Math.round(Math.min(255, Math.max(0, 255 * (1 - (ebc / 40)))));
    let g = Math.round(Math.min(255, Math.max(0, 255 * (1 - (ebc / 20)))));
    let b = Math.round(Math.min(255, Math.max(0, 255 * (1 - (ebc / 10)))));

    // Convert to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Convert hop use to CSS color
exports.hopUseToColor = function (use) {
    switch ((use || '').toLowerCase()) {
        case 'boil':
            return '#795548'; // brown
        case 'dry hop':
            return '#388e3c'; // green
        case 'aroma':
            return '#1976d2'; // blue
        default:
            return '#bdbdbd'; // grey fallback
    }
};

// Convert yeast type to CSS color
exports.yeastTypeToColor = function (type) {
    const typeStr = (type || '').toLowerCase();

    switch (typeStr) {
        case 'ale':
            return '#FFA726'; // Orange
        case 'lager':
            return '#42A5F5'; // Blue
        case 'wheat':
            return '#FFEE58'; // Yellow
        case 'wild':
            return '#66BB6A'; // Green
        default:
            return '#BDBDBD'; // Grey fallback
    }
};

/**
 * Formats the hop addition time for display.
 * - For dry hops: if time >= 1440 min, show in days (rounded)
 * - For boil/aroma: if time == 0, show "Flame out"
 * - Otherwise: show as "X min"
 */
exports.formatHopTime = function (time, use) {
    // Defensive: ensure time is a number
    const minutes = Number(time);

    // Dry hop: show in days if time is >= 1440 min (1 day)
    if (use && use.toLowerCase().includes('dry')) {
        if (minutes >= 1440) {
            const days = Math.round(minutes / 1440);
            return `${days} day${days > 1 ? 's' : ''}`;
        }
        return `${minutes} min`;
    }

    // Boil/aroma: 0 min means "Flame out"
    if (minutes === 0) {
        return 'Flame out';
    }

    // Default: show minutes
    return `${minutes} min`;
};

exports.formatHopAmount = function (amount) {
    const grams = Number(amount) * 1000;
    return (isNaN(grams) ? '0' : grams.toFixed(1).replace(/\.0$/, '')) + ' g';
};

exports.formatYeastAmount = function (amount, type) {
    // Defensive: handle missing values
    if (!amount) return '-';

    const typeStr = (type || '').toLowerCase();

    if (typeStr.includes('liquid')) {
        // Liquid yeast: show in mL (most homebrew packs are 35 mL, 100 mL, etc.)
        const ml = Number(amount) * 1000;
        // If amount is already in mL (e.g., >10), don't multiply
        return (ml >= 10 ? ml : Number(amount)).toFixed(0) + ' mL';
    } else {
        // Dry yeast or other: show in grams
        const grams = Number(amount) * 1000;
        return (grams >= 1 ? grams : Number(amount)).toFixed(1).replace(/\.0$/, '') + ' g';
    }
};

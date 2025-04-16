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

    // Simplified SRM = EBC * 0.508
    // const srm = ebc * 0.508;

    // // Color conversion logic based on SRM value
    // if (srm <= 2) return '#FFE699'; // Very light
    // if (srm <= 3) return '#FFD878'; // Light
    // if (srm <= 4) return '#FFCA5A'; // Pale
    // if (srm <= 6) return '#FFBF42'; // Gold
    // if (srm <= 8) return '#FBB123'; // Amber
    // if (srm <= 10) return '#F8A600'; // Deep amber
    // if (srm <= 13) return '#E78A00'; // Copper
    // if (srm <= 17) return '#D47500'; // Deep copper
    // if (srm <= 20) return '#C63C00'; // Brown
    // if (srm <= 24) return '#8D2900'; // Dark brown
    // if (srm <= 29) return '#5D1900'; // Very dark brown
    // if (srm <= 35) return '#2E0E00'; // Black
    // return '#000000'; // Very black
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

    // const useType = use.toLowerCase();
    // if (useType === 'boil') return '#4CAF50'; // Green
    // if (useType === 'dry hop') return '#2196F3'; // Blue
    // if (useType === 'mash') return '#FF9800'; // Orange
    // if (useType === 'first wort') return '#9C27B0'; // Purple
    // if (useType === 'aroma') return '#00BCD4'; // Cyan
    // return '#607D8B'; // Default blue-grey
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
    // const yeastType = type.toLowerCase();
    // if (yeastType === 'ale') return '#FF9800'; // Orange
    // if (yeastType === 'lager') return '#2196F3'; // Blue
    // if (yeastType === 'wheat') return '#FFEB3B'; // Yellow
    // if (yeastType === 'wine') return '#9C27B0'; // Purple
    // if (yeastType === 'champagne') return '#00BCD4'; // Cyan
    // return '#607D8B'; // Default blue-grey
};

// Format hop time based on use
exports.formatHopTime = function (time, use) {
    const timeValue = parseFloat(time);
    if (isNaN(timeValue)) return '-';

    const useType = use ? use.toLowerCase() : 'boil';

    if (useType === 'dry hop') {
        return timeValue === 1 ? '1 day' : `${timeValue} days`;
    }

    return timeValue === 1 ? '1 min' : `${timeValue} min`;
};

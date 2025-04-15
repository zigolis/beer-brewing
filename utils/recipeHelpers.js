// utils/recipeHelpers.js

// Convert EBC color value to CSS color
exports.ebcToColor = function (ebc) {
    // Simplified SRM = EBC * 0.508
    const srm = ebc * 0.508;

    // Color conversion logic based on SRM value
    if (srm <= 2) return '#FFE699'; // Very light
    if (srm <= 3) return '#FFD878'; // Light
    if (srm <= 4) return '#FFCA5A'; // Pale
    if (srm <= 6) return '#FFBF42'; // Gold
    if (srm <= 8) return '#FBB123'; // Amber
    if (srm <= 10) return '#F8A600'; // Deep amber
    if (srm <= 13) return '#E78A00'; // Copper
    if (srm <= 17) return '#D47500'; // Deep copper
    if (srm <= 20) return '#C63C00'; // Brown
    if (srm <= 24) return '#8D2900'; // Dark brown
    if (srm <= 29) return '#5D1900'; // Very dark brown
    if (srm <= 35) return '#2E0E00'; // Black
    return '#000000'; // Very black
};

// Convert hop use to CSS color
exports.hopUseToColor = function (use) {
    const useType = use.toLowerCase();
    if (useType === 'boil') return '#4CAF50'; // Green
    if (useType === 'dry hop') return '#2196F3'; // Blue
    if (useType === 'mash') return '#FF9800'; // Orange
    if (useType === 'first wort') return '#9C27B0'; // Purple
    if (useType === 'aroma') return '#00BCD4'; // Cyan
    return '#607D8B'; // Default blue-grey
};

// Convert yeast type to CSS color
exports.yeastTypeToColor = function (type) {
    const yeastType = type.toLowerCase();
    if (yeastType === 'ale') return '#FF9800'; // Orange
    if (yeastType === 'lager') return '#2196F3'; // Blue
    if (yeastType === 'wheat') return '#FFEB3B'; // Yellow
    if (yeastType === 'wine') return '#9C27B0'; // Purple
    if (yeastType === 'champagne') return '#00BCD4'; // Cyan
    return '#607D8B'; // Default blue-grey
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

// utils/xmlParser.js
const { XMLParser } = require('fast-xml-parser');

function parseRecipeXML(xmlString) {
    const parser = new XMLParser({ ignoreAttributes: false });
    const json = parser.parse(xmlString);

    // Defensive: handle both single and multiple recipes
    const recipes = Array.isArray(json.RECIPES.RECIPE)
        ? json.RECIPES.RECIPE
        : [json.RECIPES.RECIPE];

    return recipes.map(recipe => ({
        name: recipe.NAME,
        version: recipe.VERSION,
        type: recipe.TYPE,
        brewer: recipe.BREWER,
        batch_size: recipe.BATCH_SIZE,
        boil_size: recipe.BOIL_SIZE,
        boil_time: recipe.BOIL_TIME,
        efficiency: recipe.EFFICIENCY,
        og: recipe.OG,
        fg: recipe.FG,
        style: {
            name: recipe.STYLE?.NAME,
            category: recipe.STYLE?.CATEGORY,
        },
        fermentables: recipe.FERMENTABLES?.FERMENTABLE
            ? Array.isArray(recipe.FERMENTABLES.FERMENTABLE)
                ? recipe.FERMENTABLES.FERMENTABLE
                : [recipe.FERMENTABLES.FERMENTABLE]
            : [],
        hops: recipe.HOPS?.HOP
            ? Array.isArray(recipe.HOPS.HOP)
                ? recipe.HOPS.HOP
                : [recipe.HOPS.HOP]
            : [],
        yeasts: recipe.YEASTS?.YEAST
            ? Array.isArray(recipe.YEASTS.YEAST)
                ? recipe.YEASTS.YEAST
                : [recipe.YEASTS.YEAST]
            : [],
        mash: recipe.MASH || {},
        primary_temp: recipe.PRIMARY_TEMP,
    }));
}

module.exports = { parseRecipeXML };

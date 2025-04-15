const xml2js = require('xml2js');

/**
 * XML Parser Utility
 * Provides functions for parsing BeerXML files and converting between XML and recipe objects
 */

/**
 * Parse XML string to JavaScript object
 * @param {string} xmlString - The XML string to parse
 * @returns {Promise<Object>} - Parsed JavaScript object
 */
exports.parseXml = async (xmlString) => {
    try {
        const parser = new xml2js.Parser({
            explicitArray: false,
            mergeAttrs: true
        });

        return await parser.parseStringPromise(xmlString);
    } catch (error) {
        throw new Error('Invalid XML format: ' + error.message);
    }
};

/**
 * Convert XML to recipe object
 * @param {string} xmlString - The XML string to convert
 * @returns {Promise<Object>} - Recipe object formatted for the database
 */
exports.xmlToRecipe = async (xmlString) => {
    try {
        const parsed = await this.parseXml(xmlString);

        // Handle different XML structures (RECIPES > RECIPE or just RECIPE)
        const recipe = parsed.RECIPES ? parsed.RECIPES.RECIPE : parsed.RECIPE;

        if (!recipe) {
            throw new Error('Invalid recipe format');
        }

        // Extract fermentables
        const fermentables = [];
        if (recipe.FERMENTABLES && recipe.FERMENTABLES.FERMENTABLE) {
            const fermentableList = Array.isArray(recipe.FERMENTABLES.FERMENTABLE)
                ? recipe.FERMENTABLES.FERMENTABLE
                : [recipe.FERMENTABLES.FERMENTABLE];

            fermentableList.forEach(f => {
                fermentables.push({
                    name: f.NAME || '',
                    amount: parseFloat(f.AMOUNT) || 0,
                    type: f.TYPE || '',
                    color: parseFloat(f.COLOR) || 0
                });
            });
        }

        // Extract hops
        const hops = [];
        if (recipe.HOPS && recipe.HOPS.HOP) {
            const hopList = Array.isArray(recipe.HOPS.HOP)
                ? recipe.HOPS.HOP
                : [recipe.HOPS.HOP];

            hopList.forEach(h => {
                hops.push({
                    name: h.NAME || '',
                    amount: (parseFloat(h.AMOUNT) || 0) * 1000, // Convert kg to g
                    use: h.USE || '',
                    time: parseFloat(h.TIME) || 0,
                    alpha: parseFloat(h.ALPHA) || 0
                });
            });
        }

        // Extract yeasts
        const yeasts = [];
        if (recipe.YEASTS && recipe.YEASTS.YEAST) {
            const yeastList = Array.isArray(recipe.YEASTS.YEAST)
                ? recipe.YEASTS.YEAST
                : [recipe.YEASTS.YEAST];

            yeastList.forEach(y => {
                yeasts.push({
                    name: y.NAME || '',
                    type: y.TYPE || '',
                    form: y.FORM || '',
                    laboratory: y.LABORATORY || '',
                    attenuation: parseFloat(y.ATTENUATION) || 0
                });
            });
        }

        // Extract mash steps
        const mashSteps = [];
        if (recipe.MASH && recipe.MASH.MASH_STEPS && recipe.MASH.MASH_STEPS.MASH_STEP) {
            const stepList = Array.isArray(recipe.MASH.MASH_STEPS.MASH_STEP)
                ? recipe.MASH.MASH_STEPS.MASH_STEP
                : [recipe.MASH.MASH_STEPS.MASH_STEP];

            stepList.forEach(s => {
                mashSteps.push({
                    name: s.NAME || '',
                    type: s.TYPE || '',
                    temperature: parseFloat(s.STEP_TEMP) || 0,
                    time: parseFloat(s.STEP_TIME) || 0
                });
            });
        }

        return {
            name: recipe.NAME || 'Unnamed Recipe',
            brewer: recipe.BREWER || '',
            style: recipe.STYLE?.NAME || '',
            notes: recipe.NOTES || '',
            batchSize: parseFloat(recipe.BATCH_SIZE) || 0,
            boilSize: parseFloat(recipe.BOIL_SIZE) || 0,
            efficiency: parseFloat(recipe.EFFICIENCY) || 0,
            originalGravity: parseFloat(recipe.OG) || 0,
            finalGravity: parseFloat(recipe.FG) || 0,
            ibu: parseFloat(recipe.IBU) || 0,
            abv: parseFloat(recipe.ABV) || 0,
            color: parseFloat(recipe.COLOR || recipe.EST_COLOR) || 0,
            fermentables,
            hops,
            yeasts,
            mashSteps,
            xmlContent: xmlString // Store the original XML for future reference
        };
    } catch (error) {
        throw new Error('Error processing XML: ' + error.message);
    }
};

/**
 * Convert recipe object to XML
 * @param {Object} recipe - The recipe object to convert
 * @returns {string} - XML string in BeerXML format
 */
exports.recipeToXml = (recipe) => {
    try {
        const builder = new xml2js.Builder({
            rootName: 'RECIPES',
            xmldec: { version: '1.0', encoding: 'UTF-8' }
        });

        // Transform recipe object to BeerXML format
        const beerXml = {
            RECIPE: {
                NAME: recipe.name,
                BREWER: recipe.brewer || '',
                STYLE: {
                    NAME: recipe.style || ''
                },
                BATCH_SIZE: recipe.batchSize,
                BOIL_SIZE: recipe.boilSize || recipe.batchSize,
                EFFICIENCY: recipe.efficiency || 75,
                OG: recipe.originalGravity || 1.050,
                FG: recipe.finalGravity || 1.010,
                IBU: recipe.ibu || 0,
                ABV: recipe.abv || 0,
                COLOR: recipe.color || 0,
                NOTES: recipe.notes || '',

                FERMENTABLES: {
                    FERMENTABLE: recipe.fermentables.map(f => ({
                        NAME: f.name,
                        AMOUNT: f.amount,
                        TYPE: f.type || 'Grain',
                        COLOR: f.color || 0
                    }))
                },

                MASH: {
                    MASH_STEPS: {
                        MASH_STEP: recipe.mashSteps.map(m => ({
                            NAME: m.name,
                            TYPE: m.type || 'Infusion',
                            STEP_TEMP: m.temperature,
                            STEP_TIME: m.time
                        }))
                    }
                },

                HOPS: {
                    HOP: recipe.hops.map(h => ({
                        NAME: h.name,
                        AMOUNT: h.amount / 1000, // Convert g to kg
                        USE: h.use || 'Boil',
                        TIME: h.time,
                        ALPHA: h.alpha || 0
                    }))
                },

                YEASTS: {
                    YEAST: recipe.yeasts.map(y => ({
                        NAME: y.name,
                        TYPE: y.type || 'Ale',
                        FORM: y.form || 'Dry',
                        LABORATORY: y.laboratory || '',
                        ATTENUATION: y.attenuation || 75
                    }))
                }
            }
        };

        return builder.buildObject(beerXml);
    } catch (error) {
        throw new Error('Error generating XML: ' + error.message);
    }
};

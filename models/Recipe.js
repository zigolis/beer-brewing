/**
 * Beer Recipe Manager - Recipe Model
 * Defines the schema and model for beer recipes
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Fermentable schema (sub-document)
const FermentableSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Fermentable name is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be a positive number']
    },
    type: {
        type: String,
        enum: ['Grain', 'Sugar', 'Extract', 'Dry Extract', 'Adjunct'],
        default: 'Grain'
    },
    color: {
        type: Number,
        min: [0, 'Color must be a positive number'],
        default: 0
    }
});

// Hop schema (sub-document)
const HopSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Hop name is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be a positive number']
    },
    use: {
        type: String,
        enum: ['Boil', 'Dry Hop', 'Mash', 'First Wort', 'Aroma'],
        default: 'Boil'
    },
    time: {
        type: Number,
        required: [true, 'Time is required'],
        min: [0, 'Time must be a positive number']
    },
    alpha: {
        type: Number,
        min: [0, 'Alpha acid must be a positive number'],
        max: [100, 'Alpha acid cannot exceed 100%'],
        default: 0
    }
});

// Yeast schema (sub-document)
const YeastSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Yeast name is required']
    },
    type: {
        type: String,
        enum: ['Ale', 'Lager', 'Wheat', 'Wine', 'Champagne'],
        default: 'Ale'
    },
    form: {
        type: String,
        enum: ['Liquid', 'Dry', 'Slant', 'Culture'],
        default: 'Dry'
    },
    laboratory: {
        type: String
    },
    attenuation: {
        type: Number,
        min: [0, 'Attenuation must be a positive number'],
        max: [100, 'Attenuation cannot exceed 100%'],
        default: 75
    }
});

// Mash step schema (sub-document)
const MashStepSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Step name is required']
    },
    type: {
        type: String,
        enum: ['Infusion', 'Temperature', 'Decoction'],
        default: 'Infusion'
    },
    temperature: {
        type: Number,
        required: [true, 'Temperature is required'],
        min: [0, 'Temperature must be a positive number']
    },
    time: {
        type: Number,
        required: [true, 'Time is required'],
        min: [0, 'Time must be a positive number']
    }
});

// Main recipe schema
const RecipeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Recipe name is required'],
        trim: true
    },
    brewer: {
        type: String,
        trim: true
    },
    style: {
        type: String,
        trim: true
    },
    notes: {
        type: String
    },
    batchSize: {
        type: Number,
        required: [true, 'Batch size is required'],
        min: [0, 'Batch size must be a positive number']
    },
    boilSize: {
        type: Number,
        min: [0, 'Boil size must be a positive number']
    },
    efficiency: {
        type: Number,
        min: [0, 'Efficiency must be a positive number'],
        max: [100, 'Efficiency cannot exceed 100%']
    },
    originalGravity: {
        type: Number,
        min: [1, 'Original gravity must be at least 1.000']
    },
    finalGravity: {
        type: Number,
        min: [0.980, 'Final gravity must be at least 0.980']
    },
    ibu: {
        type: Number,
        min: [0, 'IBU must be a positive number']
    },
    abv: {
        type: Number,
        min: [0, 'ABV must be a positive number']
    },
    color: {
        type: Number,
        min: [0, 'Color must be a positive number']
    },
    fermentables: [FermentableSchema],
    hops: [HopSchema],
    yeasts: [YeastSchema],
    mashSteps: [MashStepSchema],
    xmlContent: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Virtual for calculating ABV if not provided
RecipeSchema.virtual('calculatedABV').get(function () {
    if (this.abv) return this.abv;
    if (!this.originalGravity || !this.finalGravity) return null;

    return ((this.originalGravity - this.finalGravity) * 131.25).toFixed(1);
});

// Pre-save middleware to update timestamps
RecipeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Method to convert recipe to XML format
RecipeSchema.methods.toXML = async function () {
    const xmlParser = require('../utils/xmlParser');
    return await xmlParser.recipeToXml(this);
};

// Static method to create recipe from XML
RecipeSchema.statics.fromXML = async function (xmlString) {
    const xmlParser = require('../utils/xmlParser');
    const recipeData = await xmlParser.xmlToRecipe(xmlString);
    return new this(recipeData);
};

module.exports = mongoose.model('Recipe', RecipeSchema);

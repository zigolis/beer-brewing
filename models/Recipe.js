const mongoose = require('mongoose');

const FermentableSchema = new mongoose.Schema({
    NAME: String,
    VERSION: String,
    TYPE: String,
    AMOUNT: String,
    YIELD: String,
    COLOR: String,
}, { _id: false });

const HopSchema = new mongoose.Schema({
    NAME: String,
    VERSION: String,
    ORIGIN: String,
    ALPHA: String,
    AMOUNT: String,
    USE: String,
    TIME: String,
    TYPE: String,
    FORM: String,
    BETA: String,
}, { _id: false });

const YeastSchema = new mongoose.Schema({
    NAME: String,
    VERSION: String,
    TYPE: String,
    FORM: String,
    AMOUNT: String,
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
    name: String,
    version: String,
    type: String,
    brewer: String,
    batch_size: String,
    boil_size: String,
    boil_time: String,
    efficiency: String,
    og: String,
    fg: String,
    style: {
        name: String,
        category: String,
    },
    fermentables: [FermentableSchema],
    hops: [HopSchema],
    yeasts: [YeastSchema],
    mash: mongoose.Schema.Types.Mixed,
    primary_temp: String,
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);

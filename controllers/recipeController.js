/**
 * Beer Recipe Manager - Recipe Controller
 * Handles all recipe-related operations
 */

const Recipe = require('../models/Recipe');
const xmlParser = require('../utils/xmlParser');
const recipeHelpers = require('../utils/recipeHelpers');
const fs = require('fs');
const path = require('path');

// Get all recipes
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().sort({ createdAt: -1 });
        res.render('recipes', {
            title: 'My Recipes',
            recipes,
            helpers: recipeHelpers
        });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).render('error', {
            message: 'Failed to load recipes',
            error
        });
    }
};

// Get recipe by ID
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).render('error', {
                message: 'Recipe not found'
            });
        }

        res.render('view-recipe', {
            title: recipe.name,
            recipe: recipe.toObject(),
            helpers: recipeHelpers
        });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).render('error', {
            message: 'Failed to load recipe',
            error
        });
    }
};

// Show recipe creation form
exports.createRecipeForm = (req, res) => {
    res.render('create-recipe', {
        title: 'Create Recipe',
        recipe: {},
        helpers: recipeHelpers
    });
};

// Create new recipe
exports.createRecipe = async (req, res) => {
    try {
        const recipeData = req.body;

        // Create new recipe document
        const newRecipe = new Recipe(recipeData);
        await newRecipe.save();

        res.redirect(`/recipes/${newRecipe._id}`);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(400).render('create-recipe', {
            title: 'Create Recipe',
            recipe: req.body,
            helpers: recipeHelpers,
            errors: error.errors || { general: { message: error.message } }
        });
    }
};

// Show recipe edit form
exports.editRecipeForm = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).render('error', {
                message: 'Recipe not found'
            });
        }

        res.render('edit-recipe', {
            title: `Edit ${recipe.name}`,
            recipe: recipe.toObject(),
            helpers: recipeHelpers
        });
    } catch (error) {
        console.error('Error fetching recipe for edit:', error);
        res.status(500).render('error', {
            message: 'Failed to load recipe for editing',
            error
        });
    }
};

// Update recipe
exports.updateRecipe = async (req, res) => {
    try {
        const recipeData = req.body;

        const recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            recipeData,
            { new: true, runValidators: true }
        );

        if (!recipe) {
            return res.status(404).render('error', {
                message: 'Recipe not found'
            });
        }

        res.redirect(`/recipes/${recipe._id}`);
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(400).render('edit-recipe', {
            title: 'Edit Recipe',
            recipe: { ...req.body, _id: req.params.id },
            helpers: recipeHelpers,
            errors: error.errors || { general: { message: error.message } }
        });
    }
};

// Delete recipe
exports.deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);

        if (!recipe) {
            return res.status(404).render('error', {
                message: 'Recipe not found'
            });
        }

        res.redirect('/recipes');
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).render('error', {
            message: 'Failed to delete recipe',
            error
        });
    }
};

// Upload and process XML file
exports.uploadXmlFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Read the uploaded file
        const xmlFilePath = req.file.path;
        const xmlContent = fs.readFileSync(xmlFilePath, 'utf8');

        // Parse XML to recipe object
        const recipeData = await xmlParser.xmlToRecipe(xmlContent);

        // Create new recipe document
        const newRecipe = new Recipe({
            ...recipeData,
            xmlContent // Store original XML for potential download
        });

        await newRecipe.save();

        // Clean up the uploaded file
        fs.unlinkSync(xmlFilePath);

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Recipe uploaded successfully',
            recipeId: newRecipe._id
        });
    } catch (error) {
        console.error('Error processing XML file:', error);

        // Clean up the uploaded file if it exists
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
            error: error.message || 'Failed to process XML file'
        });
    }
};

// Download recipe as XML
exports.downloadRecipeXml = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).render('error', {
                message: 'Recipe not found'
            });
        }

        // If we have stored XML content, use that
        if (recipe.xmlContent) {
            res.setHeader('Content-Type', 'text/xml');
            res.setHeader('Content-Disposition', `attachment; filename="${recipe.name.replace(/\s+/g, '_')}.xml"`);
            return res.send(recipe.xmlContent);
        }

        // Otherwise, generate XML from the recipe data
        const xmlContent = await recipe.toXML();

        res.setHeader('Content-Type', 'text/xml');
        res.setHeader('Content-Disposition', `attachment; filename="${recipe.name.replace(/\s+/g, '_')}.xml"`);
        res.send(xmlContent);
    } catch (error) {
        console.error('Error downloading recipe XML:', error);
        res.status(500).render('error', {
            message: 'Failed to download recipe as XML',
            error
        });
    }
};

/**
 * Beer Recipe Manager - Recipe Routes
 * Defines all routes related to recipes
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const recipeController = require('../controllers/recipeController');
const fileUpload = require('../middlewares/fileUpload');

// GET /recipes - Display all recipes
router.get('/', recipeController.getAllRecipes);

// GET /recipes/create - Show recipe creation form
router.get('/create', recipeController.createRecipeForm);

// POST /recipes - Create a new recipe
router.post('/', recipeController.createRecipe);

// GET /recipes/:id - View a specific recipe
router.get('/:id', recipeController.getRecipeById);

// GET /recipes/:id/edit - Show recipe edit form
router.get('/:id/edit', recipeController.editRecipeForm);

// PUT /recipes/:id - Update a recipe
router.put('/:id', recipeController.updateRecipe);

// DELETE /recipes/:id - Delete a recipe
router.delete('/:id', recipeController.deleteRecipe);

// POST /recipes/upload - Upload and process XML recipe file
router.post('/upload', upload.single('file'), recipeController.uploadRecipe);

// GET /recipes/:id/download - Download recipe as XML
router.get('/:id/download', recipeController.downloadRecipeXml);

module.exports = router;

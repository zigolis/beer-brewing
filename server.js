/**
 * Beer Recipe Manager - Server
 * Main application entry point
 */

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const { connectDB } = require('./config/database');
const recipeRoutes = require('./routes/recipes');
require('dotenv').config();

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method')); // For PUT and DELETE requests

// Pass recipe helpers to all views
app.use((req, res, next) => {
    res.locals.helpers = require('./utils/recipeHelpers');
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Beer Recipe Manager' });
});

app.use('/recipes', recipeRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Page Not Found',
        message: 'The page you requested does not exist.'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Server Error',
        message: 'Something went wrong on our end.',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

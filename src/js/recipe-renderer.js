/**
 * Recipe Renderer
 * Handles the rendering of beer recipe data in the UI
 */
document.addEventListener('DOMContentLoaded', function () {
    // Configuration
    const CONFIG = {
        colors: {
            stats: {
                volume: '#3f51b5',    // Indigo for volume measurements
                process: '#8d6e63',   // Brown for process values
                gravity: '#d4a14b',   // Amber for gravity readings
                results: '#4CAF50',   // Green for results (ABV, IBU)
                other: '#b87333'      // Copper for other stats
            }
        }
    };

    /**
     * Main renderer object
     */
    const RecipeRenderer = {
        /**
         * Render the entire recipe
         * @param {Object} recipe - The recipe object to render
         */
        render(recipe) {
            this.renderGeneral(recipe);
            this.renderStats(recipe);
            this.renderFermentables(recipe);
            this.renderHops(recipe);
            this.renderYeasts(recipe);
            this.renderMash(recipe);
        },

        /**
         * Render general recipe information
         * @param {Object} recipe - The recipe object
         */
        renderGeneral(recipe) {
            setTextContent('name', recipe.name);
            setTextContent('brewer', recipe.brewer);
            setTextContent('type', recipe.style);
            setTextContent('notes', recipe.notes);
        },

        /**
         * Render recipe statistics
         * @param {Object} recipe - The recipe object
         */
        renderStats(recipe) {
            const statsData = [
                { name: 'Batch Size', value: `${recipe.batchSize} L`, color: CONFIG.colors.stats.volume },
                { name: 'Boil Size', value: `${recipe.boilSize} L`, color: CONFIG.colors.stats.volume },
                { name: 'Efficiency', value: `${recipe.efficiency}%`, color: CONFIG.colors.stats.process },
                { name: 'OG', value: recipe.originalGravity, color: CONFIG.colors.stats.gravity },
                { name: 'FG', value: recipe.finalGravity, color: CONFIG.colors.stats.gravity },
                { name: 'IBU', value: recipe.ibu, color: CONFIG.colors.stats.results },
                { name: 'ABV', value: `${recipe.abv}%`, color: CONFIG.colors.stats.results },
                { name: 'Color', value: `${recipe.color} EBC`, color: CONFIG.colors.stats.other }
            ];

            const statsList = document.getElementById('stats');
            if (!statsList) return;

            statsList.innerHTML = '';
            statsData.forEach(stat => {
                if (!stat.value) return; // Skip empty values

                const card = createElement('div', 'stat-card');
                const indicator = createElement('div', 'stat-indicator');
                indicator.style.backgroundColor = stat.color;
                const content = createElement('div', 'stat-content');
                const nameElement = createElement('div', 'stat-name', stat.name);
                const valueElement = createElement('div', 'stat-value', stat.value);

                content.appendChild(nameElement);
                content.appendChild(valueElement);
                card.appendChild(indicator);
                card.appendChild(content);
                statsList.appendChild(card);
            });
        },

        /**
         * Render fermentables section
         * @param {Object} recipe - The recipe object
         */
        renderFermentables(recipe) {
            const fermentablesList = document.getElementById('fermentables-list');
            if (!fermentablesList || !recipe.fermentables) return;

            fermentablesList.innerHTML = '';
            recipe.fermentables.forEach(fermentable => {
                const card = createElement('div', 'fermentable-card');
                const colorIndicator = createElement('div', 'color-indicator');
                colorIndicator.style.backgroundColor = ebcToColor(parseFloat(fermentable.color));

                const content = createElement('div', 'fermentable-content');
                const nameElement = createElement('div', 'fermentable-name', fermentable.name);
                const details = createElement('div', 'fermentable-details');

                const amountSpan = createElement('span', 'amount', `${fermentable.amount} kg`);
                details.appendChild(amountSpan);

                if (fermentable.type) {
                    const typeSpan = createElement('span', 'type', fermentable.type);
                    details.appendChild(typeSpan);
                }

                if (fermentable.color) {
                    const colorSpan = createElement('span', 'color', `${fermentable.color} EBC`);
                    details.appendChild(colorSpan);
                }

                content.appendChild(nameElement);
                content.appendChild(details);
                card.appendChild(colorIndicator);
                card.appendChild(content);
                fermentablesList.appendChild(card);
            });
        },

        /**
         * Render hops section
         * @param {Object} recipe - The recipe object
         */
        renderHops(recipe) {
            const hopsList = document.getElementById('hops-list');
            if (!hopsList || !recipe.hops) return;

            hopsList.innerHTML = '';

            // Group hops by use
            const hopGroups = {};
            recipe.hops.forEach(hop => {
                if (!hopGroups[hop.use]) {
                    hopGroups[hop.use] = [];
                }
                hopGroups[hop.use].push(hop);
            });

            // Create a section for each hop use type
            Object.keys(hopGroups).forEach(useType => {
                const useContainer = createElement('div', 'hop-group');
                const title = createElement('h3', 'hop-group-title', `${useType} Hops`);
                const cardsContainer = createElement('div', 'hop-cards');

                useContainer.appendChild(title);
                useContainer.appendChild(cardsContainer);

                hopGroups[useType].forEach(hop => {
                    const card = createElement('div', 'hop-card');
                    const useIndicator = createElement('div', 'use-indicator');
                    useIndicator.style.backgroundColor = hopUseToColor(hop.use);

                    const content = createElement('div', 'hop-content');
                    const nameElement = createElement('div', 'hop-name', hop.name);
                    const details = createElement('div', 'hop-details');

                    const amountSpan = createElement('span', 'amount', `${hop.amount} g`);
                    const timeSpan = createElement('span', 'time', formatHopTime(hop.time, hop.use));
                    details.appendChild(amountSpan);
                    details.appendChild(timeSpan);

                    if (hop.alpha) {
                        const alphaSpan = createElement('span', 'alpha', `${hop.alpha}% AA`);
                        details.appendChild(alphaSpan);
                    }

                    content.appendChild(nameElement);
                    content.appendChild(details);
                    card.appendChild(useIndicator);
                    card.appendChild(content);
                    cardsContainer.appendChild(card);
                });

                hopsList.appendChild(useContainer);
            });
        },

        /**
         * Render yeasts section
         * @param {Object} recipe - The recipe object
         */
        renderYeasts(recipe) {
            const yeastList = document.getElementById('yeast-list');
            if (!yeastList || !recipe.yeasts) return;

            yeastList.innerHTML = '';
            const yeastContainer = createElement('div', 'yeast-group');

            recipe.yeasts.forEach(yeast => {
                const card = createElement('div', 'yeast-card');
                const typeIndicator = createElement('div', 'type-indicator');
                typeIndicator.style.backgroundColor = yeastTypeToColor(yeast.type);

                const content = createElement('div', 'yeast-content');
                const nameElement = createElement('div', 'yeast-name', yeast.name);
                const details = createElement('div', 'yeast-details');

                if (yeast.laboratory) {
                    const labSpan = createElement('span', 'laboratory', yeast.laboratory);
                    details.appendChild(labSpan);
                }

                if (yeast.type) {
                    const typeSpan = createElement('span', 'type', yeast.type);
                    details.appendChild(typeSpan);
                }

                if (yeast.form) {
                    const formSpan = createElement('span', 'form', yeast.form);
                    details.appendChild(formSpan);
                }

                if (yeast.attenuation) {
                    const attSpan = createElement('span', 'attenuation', `${yeast.attenuation}% attenuation`);
                    details.appendChild(attSpan);
                }

                content.appendChild(nameElement);
                content.appendChild(details);
                card.appendChild(typeIndicator);
                card.appendChild(content);
                yeastContainer.appendChild(card);
            });

            yeastList.appendChild(yeastContainer);
        },

        /**
         * Render mash schedule section
         * @param {Object} recipe - The recipe object
         */
        renderMash(recipe) {
            const mashList = document.getElementById('mash-list');
            if (!mashList || !recipe.mashSteps) return;

            mashList.innerHTML = '';

            recipe.mashSteps.forEach((step, index) => {
                const stepCard = createElement('div', 'mash-step');
                const stepIndicator = createElement('div', 'step-indicator');
                stepIndicator.textContent = index + 1;

                const content = createElement('div', 'mash-content');
                const nameElement = createElement('div', 'step-name', step.name);
                const details = createElement('div', 'step-details');

                const tempSpan = createElement('span', 'temperature', `${step.temperature}°C`);
                const timeSpan = createElement('span', 'step-time', `${step.time} min`);
                details.appendChild(tempSpan);
                details.appendChild(timeSpan);

                if (step.type) {
                    const typeSpan = createElement('span', 'step-type', step.type);
                    details.appendChild(typeSpan);
                }

                content.appendChild(nameElement);
                content.appendChild(details);
                stepCard.appendChild(stepIndicator);
                stepCard.appendChild(content);
                mashList.appendChild(stepCard);
            });
        }
    };

    // Expose the renderer to the global scope
    window.RecipeRenderer = RecipeRenderer;

    /**
     * Helper function to set text content of an element by ID
     * @param {string} id - Element ID
     * @param {string} text - Text to set
     */
    function setTextContent(id, text) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text || '';
        }
    }

    /**
     * Helper function to create an element with class and optional text
     * @param {string} tag - HTML tag name
     * @param {string} className - CSS class name
     * @param {string} [text] - Optional text content
     * @returns {HTMLElement} The created element
     */
    function createElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        if (text) {
            element.textContent = text;
        }
        return element;
    }

    /**
     * Convert EBC color value to CSS color
     * @param {number} ebc - EBC color value
     * @returns {string} CSS color
     */
    function ebcToColor(ebc) {
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
    }

    /**
     * Convert hop use to CSS color
     * @param {string} use - Hop use type
     * @returns {string} CSS color
     */
    function hopUseToColor(use) {
        const useType = use.toLowerCase();
        if (useType === 'boil') return '#4CAF50'; // Green
        if (useType === 'dry hop') return '#2196F3'; // Blue
        if (useType === 'mash') return '#FF9800'; // Orange
        if (useType === 'first wort') return '#9C27B0'; // Purple
        if (useType === 'aroma') return '#00BCD4'; // Cyan
        return '#607D8B'; // Default blue-grey
    }

    /**
     * Convert yeast type to CSS color
     * @param {string} type - Yeast type
     * @returns {string} CSS color
     */
    function yeastTypeToColor(type) {
        const yeastType = type.toLowerCase();
        if (yeastType === 'ale') return '#FF9800'; // Orange
        if (yeastType === 'lager') return '#2196F3'; // Blue
        if (yeastType === 'wheat') return '#FFEB3B'; // Yellow
        if (yeastType === 'wine') return '#9C27B0'; // Purple
        if (yeastType === 'champagne') return '#00BCD4'; // Cyan
        return '#607D8B'; // Default blue-grey
    }

    /**
     * Format hop time based on use
     * @param {number} time - Time value
     * @param {string} use - Hop use type
     * @returns {string} Formatted time string
     */
    function formatHopTime(time, use) {
        const timeValue = parseFloat(time);
        if (isNaN(timeValue)) return '-';

        const useType = use ? use.toLowerCase() : 'boil';

        if (useType === 'dry hop') {
            return timeValue === 1 ? '1 day' : `${timeValue} days`;
        }

        return timeValue === 1 ? '1 min' : `${timeValue} min`;
    }

    // Initialize any recipe data that might be present on the page
    const recipeElement = document.getElementById('recipe-data');
    if (recipeElement && recipeElement.dataset.recipe) {
        try {
            const recipe = JSON.parse(recipeElement.dataset.recipe);
            RecipeRenderer.render(recipe);
        } catch (error) {
            console.error('Error parsing recipe data:', error);
        }
    }
});

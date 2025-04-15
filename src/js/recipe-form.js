/**
 * Recipe Form Handler
 * Manages the dynamic addition and removal of recipe ingredients and steps
 */
document.addEventListener('DOMContentLoaded', function () {
  // Counters for dynamic fields
  let fermentableCount = 0;
  let hopCount = 0;
  let yeastCount = 0;
  let mashStepCount = 0;

  // Add ingredient buttons
  const addFermentableBtn = document.getElementById('add-fermentable');
  const addHopBtn = document.getElementById('add-hop');
  const addYeastBtn = document.getElementById('add-yeast');
  const addMashStepBtn = document.getElementById('add-mash-step');

  // Add event listeners if elements exist
  if (addFermentableBtn) {
    addFermentableBtn.addEventListener('click', addFermentable);
  }

  if (addHopBtn) {
    addHopBtn.addEventListener('click', addHop);
  }

  if (addYeastBtn) {
    addYeastBtn.addEventListener('click', addYeast);
  }

  if (addMashStepBtn) {
    addMashStepBtn.addEventListener('click', addMashStep);
  }

  // Add at least one of each ingredient type on page load
  // Only if we're on the create recipe page
  if (document.getElementById('recipe-form')) {
    addFermentable();
    addHop();
    addYeast();
    addMashStep();
  }

  /**
   * Add a new fermentable ingredient to the form
   */
  function addFermentable() {
    const container = document.getElementById('fermentables-container');
    if (!container) return;

    const fermentableHtml = `
      <div class="fermentable-item">
        <button type="button" class="remove-item" onclick="this.parentElement.remove()">×</button>
        <div class="form-group">
          <label for="fermentable-name-${fermentableCount}">Name*</label>
          <input type="text" id="fermentable-name-${fermentableCount}" name="fermentables[${fermentableCount}][name]" required>
        </div>
        <div class="form-group">
          <label for="fermentable-amount-${fermentableCount}">Amount (kg)*</label>
          <input type="number" id="fermentable-amount-${fermentableCount}" name="fermentables[${fermentableCount}][amount]" step="0.001" min="0" required>
        </div>
        <div class="form-group">
          <label for="fermentable-type-${fermentableCount}">Type</label>
          <select id="fermentable-type-${fermentableCount}" name="fermentables[${fermentableCount}][type]">
            <option value="Grain">Grain</option>
            <option value="Sugar">Sugar</option>
            <option value="Extract">Extract</option>
            <option value="Dry Extract">Dry Extract</option>
            <option value="Adjunct">Adjunct</option>
          </select>
        </div>
        <div class="form-group">
          <label for="fermentable-color-${fermentableCount}">Color (EBC)</label>
          <input type="number" id="fermentable-color-${fermentableCount}" name="fermentables[${fermentableCount}][color]" step="0.1" min="0">
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', fermentableHtml);
    fermentableCount++;
  }

  /**
   * Add a new hop to the form
   */
  function addHop() {
    const container = document.getElementById('hops-container');
    if (!container) return;

    const hopHtml = `
      <div class="hop-item">
        <button type="button" class="remove-item" onclick="this.parentElement.remove()">×</button>
        <div class="form-group">
          <label for="hop-name-${hopCount}">Name*</label>
          <input type="text" id="hop-name-${hopCount}" name="hops[${hopCount}][name]" required>
        </div>
        <div class="form-group">
          <label for="hop-amount-${hopCount}">Amount (g)*</label>
          <input type="number" id="hop-amount-${hopCount}" name="hops[${hopCount}][amount]" step="0.1" min="0" required>
        </div>
        <div class="form-group">
          <label for="hop-use-${hopCount}">Use</label>
          <select id="hop-use-${hopCount}" name="hops[${hopCount}][use]">
            <option value="Boil">Boil</option>
            <option value="Dry Hop">Dry Hop</option>
            <option value="Mash">Mash</option>
            <option value="First Wort">First Wort</option>
            <option value="Aroma">Aroma</option>
          </select>
        </div>
        <div class="form-group">
          <label for="hop-time-${hopCount}">Time (min/days)*</label>
          <input type="number" id="hop-time-${hopCount}" name="hops[${hopCount}][time]" min="0" required>
        </div>
        <div class="form-group">
          <label for="hop-alpha-${hopCount}">Alpha Acid (%)</label>
          <input type="number" id="hop-alpha-${hopCount}" name="hops[${hopCount}][alpha]" step="0.1" min="0" max="100">
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', hopHtml);
    hopCount++;
  }

  /**
   * Add a new yeast to the form
   */
  function addYeast() {
    const container = document.getElementById('yeasts-container');
    if (!container) return;

    const yeastHtml = `
      <div class="yeast-item">
        <button type="button" class="remove-item" onclick="this.parentElement.remove()">×</button>
        <div class="form-group">
          <label for="yeast-name-${yeastCount}">Name*</label>
          <input type="text" id="yeast-name-${yeastCount}" name="yeasts[${yeastCount}][name]" required>
        </div>
        <div class="form-group">
          <label for="yeast-type-${yeastCount}">Type</label>
          <select id="yeast-type-${yeastCount}" name="yeasts[${yeastCount}][type]">
            <option value="Ale">Ale</option>
            <option value="Lager">Lager</option>
            <option value="Wheat">Wheat</option>
            <option value="Wine">Wine</option>
            <option value="Champagne">Champagne</option>
          </select>
        </div>
        <div class="form-group">
          <label for="yeast-form-${yeastCount}">Form</label>
          <select id="yeast-form-${yeastCount}" name="yeasts[${yeastCount}][form]">
            <option value="Liquid">Liquid</option>
            <option value="Dry">Dry</option>
            <option value="Slant">Slant</option>
            <option value="Culture">Culture</option>
          </select>
        </div>
        <div class="form-group">
          <label for="yeast-laboratory-${yeastCount}">Laboratory</label>
          <input type="text" id="yeast-laboratory-${yeastCount}" name="yeasts[${yeastCount}][laboratory]">
        </div>
        <div class="form-group">
          <label for="yeast-attenuation-${yeastCount}">Attenuation (%)</label>
          <input type="number" id="yeast-attenuation-${yeastCount}" name="yeasts[${yeastCount}][attenuation]" min="0" max="100">
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', yeastHtml);
    yeastCount++;
  }

  /**
   * Add a new mash step to the form
   */
  function addMashStep() {
    const container = document.getElementById('mash-steps-container');
    if (!container) return;

    const mashStepHtml = `
      <div class="mash-step-item">
        <button type="button" class="remove-item" onclick="this.parentElement.remove()">×</button>
        <div class="form-group">
          <label for="mash-name-${mashStepCount}">Name*</label>
          <input type="text" id="mash-name-${mashStepCount}" name="mashSteps[${mashStepCount}][name]" required>
        </div>
        <div class="form-group">
          <label for="mash-type-${mashStepCount}">Type</label>
          <select id="mash-type-${mashStepCount}" name="mashSteps[${mashStepCount}][type]">
            <option value="Infusion">Infusion</option>
            <option value="Temperature">Temperature</option>
            <option value="Decoction">Decoction</option>
          </select>
        </div>
        <div class="form-group">
          <label for="mash-temp-${mashStepCount}">Temperature (°C)*</label>
          <input type="number" id="mash-temp-${mashStepCount}" name="mashSteps[${mashStepCount}][temperature]" min="0" required>
        </div>
        <div class="form-group">
          <label for="mash-time-${mashStepCount}">Time (min)*</label>
          <input type="number" id="mash-time-${mashStepCount}" name="mashSteps[${mashStepCount}][time]" min="0" required>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', mashStepHtml);
    mashStepCount++;
  }
});

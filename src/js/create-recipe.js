document.addEventListener('DOMContentLoaded', function () {
    // Fermentables
    const fermentablesList = document.getElementById('fermentables-list');
    document.getElementById('add-fermentable').onclick = function () {
        const idx = fermentablesList.children.length;
        fermentablesList.insertAdjacentHTML('beforeend', `
        <div class="ingredient-row">
          <input name="fermentables[${idx}][NAME]" required placeholder="Name">
          <input name="fermentables[${idx}][AMOUNT]" type="number" step="0.01" required placeholder="Amount (kg)">
          <input name="fermentables[${idx}][COLOR]" type="number" step="1" placeholder="Color (EBC)">
          <input name="fermentables[${idx}][TYPE]" placeholder="Type">
          <button type="button" class="remove-btn" onclick="this.parentNode.remove()">Remove</button>
        </div>
      `);
    };

    // Hops
    const hopsList = document.getElementById('hops-list');
    document.getElementById('add-hop').onclick = function () {
        const idx = hopsList.children.length;
        hopsList.insertAdjacentHTML('beforeend', `
        <div class="ingredient-row">
          <input name="hops[${idx}][NAME]" required placeholder="Name">
          <input name="hops[${idx}][AMOUNT]" type="number" step="0.001" required placeholder="Amount (kg)">
          <input name="hops[${idx}][ALPHA]" type="number" step="0.01" placeholder="Alpha (%)">
          <input name="hops[${idx}][BETA]" type="number" step="0.01" placeholder="Beta (%)">
          <input name="hops[${idx}][USE]" placeholder="Use (Boil, Dry Hop)">
          <input name="hops[${idx}][TIME]" type="number" step="1" placeholder="Time (min)">
          <input name="hops[${idx}][FORM]" placeholder="Form (Pellet, Leaf)">
          <button type="button" class="remove-btn" onclick="this.parentNode.remove()">Remove</button>
        </div>
      `);
    };

    // Yeasts
    const yeastsList = document.getElementById('yeasts-list');
    document.getElementById('add-yeast').onclick = function () {
        const idx = yeastsList.children.length;
        yeastsList.insertAdjacentHTML('beforeend', `
        <div class="ingredient-row">
          <input name="yeasts[${idx}][NAME]" required placeholder="Name">
          <input name="yeasts[${idx}][TYPE]" placeholder="Type">
          <input name="yeasts[${idx}][FORM]" placeholder="Form">
          <input name="yeasts[${idx}][AMOUNT]" type="number" step="0.001" placeholder="Amount (L)">
          <input name="yeasts[${idx}][VERSION]" type="number" step="1" placeholder="Version">
          <button type="button" class="remove-btn" onclick="this.parentNode.remove()">Remove</button>
        </div>
      `);
    };

    // Mash Steps
    const mashStepsList = document.getElementById('mash-steps-list');
    document.getElementById('add-mash-step').onclick = function () {
        const idx = mashStepsList.children.length;
        mashStepsList.insertAdjacentHTML('beforeend', `
        <div class="ingredient-row">
          <input name="mash[MASH_STEPS][${idx}][NAME]" required placeholder="Step Name">
          <input name="mash[MASH_STEPS][${idx}][STEP_TEMP]" type="number" step="0.1" required placeholder="Temp (°C)">
          <input name="mash[MASH_STEPS][${idx}][STEP_TIME]" type="number" step="1" required placeholder="Time (min)">
          <input name="mash[MASH_STEPS][${idx}][TYPE]" placeholder="Type">
          <button type="button" class="remove-btn" onclick="this.parentNode.remove()">Remove</button>
        </div>
      `);
    };
});

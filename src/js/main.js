// Theme toggle
document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const dropzone = document.getElementById('upload-dropzone');
    const fileInput = document.getElementById('file-input');
    const browseButton = document.getElementById('browse-button');
    const uploadSuccess = document.getElementById('upload-success');
    const uploadError = document.getElementById('upload-error');
    const recipeDetails = document.getElementById('recipe-details');
    const recipeGeneral = document.getElementById('recipe-general-section');

    // Theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            document.body.classList.toggle('dark-theme');
            // Save preference
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });

        // On load, set theme from localStorage
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }

    // Helper: Show/hide status messages
    function showStatus(type, message) {
        if (uploadSuccess) uploadSuccess.style.display = 'none';
        if (uploadError) uploadError.style.display = 'none';
        if (type === 'success' && uploadSuccess && uploadSuccess.querySelector('span')) {
            uploadSuccess.style.display = 'flex';
            uploadSuccess.querySelector('span').textContent = message;
        }
        if (type === 'error' && uploadError && uploadError.querySelector('span')) {
            uploadError.style.display = 'flex';
            uploadError.querySelector('span').textContent = message;
        }
    }

    // Browse button triggers file input
    if (browseButton && fileInput) {
        browseButton.addEventListener('click', () => fileInput.click());
    }

    // Drag & drop logic
    if (dropzone && fileInput) {
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('drag-over');
        });
        dropzone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-over');
        });
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-over');
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                fileInput.dispatchEvent(new Event('change'));
            }
        });
    }

    // File input change: AJAX upload
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (!file) return;
            if (!file.name.endsWith('.xml')) {
                showStatus('error', 'Please select a valid XML file.');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            fetch('/recipes/upload', {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.recipes && data.recipes.length > 0) {
                        showStatus('success', 'Recipe loaded successfully!');
                        renderRecipe(data.recipes[0]);
                    } else {
                        showStatus('error', data.error || 'Upload failed.');
                    }
                })
                .catch(() => {
                    showStatus('error', 'An error occurred during upload.');
                });
        });
    }

    // Render recipe details in the DOM
    function renderRecipe(recipe) {
        if (!recipeDetails) return;
        recipeDetails.innerHTML = `
          <div class="recipe-card">
            <h2>${recipe.name}</h2>
            <p><strong>Brewer:</strong> ${recipe.brewer || ''}</p>
            <p><strong>Type:</strong> ${recipe.type || ''}</p>
            <p><strong>Batch Size:</strong> ${recipe.batch_size || ''} L</p>
            <p><strong>OG:</strong> ${recipe.og || ''} | <strong>FG:</strong> ${recipe.fg || ''}</p>
            <p><strong>Style:</strong> ${recipe.style?.name || ''}</p>
            <h3>Fermentables</h3>
            <ul>
              ${(recipe.fermentables || []).map(f => `<li>${f.NAME} (${f.AMOUNT} kg)</li>`).join('')}
            </ul>
            <h3>Hops</h3>
            <ul>
              ${(recipe.hops || []).map(h => `<li>${h.NAME} (${h.AMOUNT} kg, ${h.USE}, ${h.TIME} min)</li>`).join('')}
            </ul>
            <h3>Yeasts</h3>
            <ul>
              ${(recipe.yeasts || []).map(y => `<li>${y.NAME} (${y.TYPE})</li>`).join('')}
            </ul>
          </div>
        `;
    }
});

/**
 * Recipe Loader
 * Handles the loading and uploading of beer recipes
 */
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('xml-file-input');
    const uploadButton = document.getElementById('upload-button');
    const uploadSuccess = document.getElementById('upload-success');
    const uploadError = document.getElementById('upload-error');

    // Initialize file upload functionality if elements exist
    if (uploadArea && fileInput) {
        // Handle click on upload area
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // Handle drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Add/remove highlight class during drag
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.remove('drag-over');
            });
        });

        // Handle file drop
        uploadArea.addEventListener('drop', (e) => {
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFiles(e.dataTransfer.files);
            }
        });

        // Handle file selection via input
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length) {
                handleFiles(fileInput.files);
            }
        });

        // Upload button click
        if (uploadButton) {
            uploadButton.addEventListener('click', () => {
                fileInput.click();
            });
        }
    }

    /**
     * Process the selected files
     * @param {FileList} files - The files to process
     */
    function handleFiles(files) {
        const file = files[0]; // Only process the first file

        // Validate file type
        if (file.type === 'text/xml' || file.name.endsWith('.xml')) {
            uploadFile(file);
        } else {
            showStatus(false, 'Please select a valid XML file.');
        }
    }

    /**
     * Upload the file to the server
     * @param {File} file - The file to upload
     */
    function uploadFile(file) {
        // Create FormData object
        const formData = new FormData();
        formData.append('xmlFile', file);

        // Show loading state
        showStatus(true, 'Uploading recipe...');

        // Send the file to the server
        fetch('/recipes/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Server error: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }

                showStatus(true, 'Recipe uploaded successfully!');

                // Redirect to the recipe page after a short delay
                setTimeout(() => {
                    window.location.href = `/recipes/${data.recipeId}`;
                }, 1500);
            })
            .catch(error => {
                console.error('Upload error:', error);
                showStatus(false, error.message || 'Error uploading recipe. Please try again.');
            });
    }

    /**
     * Display status message to the user
     * @param {boolean} success - Whether the operation was successful
     * @param {string} message - The message to display
     */
    function showStatus(success, message) {
        if (success) {
            if (uploadSuccess) {
                uploadSuccess.textContent = message;
                uploadSuccess.style.display = 'block';
            }
            if (uploadError) {
                uploadError.style.display = 'none';
            }
        } else {
            if (uploadError) {
                uploadError.textContent = message;
                uploadError.style.display = 'block';
            }
            if (uploadSuccess) {
                uploadSuccess.style.display = 'none';
            }
        }
    }

    // Load recent recipes from localStorage if available
    function loadRecentRecipes() {
        const recipeHistory = document.getElementById('recipe-history');
        if (!recipeHistory) return;

        // This will be replaced by server-side rendering in the Node.js version,
        // but keeping the function as a placeholder for any client-side history manipulation
    }

    // Initialize
    loadRecentRecipes();
});

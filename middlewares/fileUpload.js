/**
 * Beer Recipe Manager - File Upload Middleware
 * Handles file uploads for XML recipe files
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename with timestamp and original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'recipe-' + uniqueSuffix + ext);
    }
});

// File filter to only allow XML files
const fileFilter = (req, file, cb) => {
    // Accept only XML files
    if (file.mimetype === 'text/xml' || file.originalname.toLowerCase().endsWith('.xml')) {
        cb(null, true);
    } else {
        cb(new Error('Only XML files are allowed'), false);
    }
};

// Configure upload limits
const limits = {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1 // Only allow 1 file at a time
};

// Create multer instance with configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({ error: err.message });
    } else if (err) {
        // An unknown error occurred
        return res.status(500).json({ error: err.message });
    }

    // No error occurred, continue
    next();
};

module.exports = {
    upload,
    handleUploadError,
    single: function (fieldName) {
        return [
            upload.single(fieldName),
            handleUploadError
        ];
    }
};

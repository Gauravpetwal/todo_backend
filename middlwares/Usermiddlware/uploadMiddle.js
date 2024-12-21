
const multer = require('multer');
const path = require('path');
const sharp = require('sharp'); // To read image dimensions

// Configure storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// File type and size validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/; // Allowed file types
    const isValidType = allowedTypes.test(path.extname(file.originalname).toLowerCase()) && 
                        allowedTypes.test(file.mimetype);

    if (!isValidType) {
        return cb(new Error('Error: File type not allowed!'));
    }

    // Limit file size to 2MB
    if (file.size > 2 * 1024 * 1024) {
        return cb(new Error('Error: File size exceeds 2MB!'));
    }

    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
    fileFilter: fileFilter,
});


const validateImageDimensions = async (req, res, next) => {
    if (!req.file) return next(); 

    try {
        const { width, height } = await sharp(req.file.path).metadata();
        
       
        const maxWidth = 1920;
        const maxHeight = 1080;

        if (width > maxWidth || height > maxHeight) {
            return res.status(400).json({
                message: `Image dimensions exceed the allowed ${maxWidth}x${maxHeight}px`
            });
        }

        next(); 
    } catch (error) {
        return res.status(500).json({ message: 'Error processing image dimensions', error });
    }
};

module.exports = { upload, validateImageDimensions };

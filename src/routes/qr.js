const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });
const { generatePNG, generateDataUrl, getImages, uploadImage, getDummy, uploadDummyFile } = require('../controllers/qrController');

const router = express.Router();

// Return PNG image
router.get('/', generatePNG);

// Return data URL JSON
router.get('/dataurl', generateDataUrl);

// Return a dummy image URL for testing uploads
router.get('/dummy', getDummy);

// Upload a file via multipart/form-data (field name: file), optional description & title
router.post('/dummy', upload.single('file'), uploadDummyFile);

// Return JSON list of images: [{ imageUrl, description }]
router.get('/images', getImages);

// Upload an image record { imageUrl, description }
router.post('/upload', uploadImage);

module.exports = router;

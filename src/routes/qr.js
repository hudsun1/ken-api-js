const express = require('express');
const { generatePNG, generateDataUrl, getImages, uploadImage } = require('../controllers/qrController');

const router = express.Router();

// Return PNG image
router.get('/', generatePNG);

// Return data URL JSON
router.get('/dataurl', generateDataUrl);

// Return JSON list of images: [{ imageUrl, description }]
router.get('/images', getImages);

// Upload an image record { imageUrl, description }
router.post('/upload', uploadImage);

module.exports = router;

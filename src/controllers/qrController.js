const QRCode = require('qrcode');
const { addImage, listImages, listQrTest } = require('../services/imageStore');

exports.generatePNG = async (req, res, next) => {
  const text = req.query.text || req.query.data || 'Hello, QR!';
  const size = parseInt(req.query.size, 10) || 300;
  try {
    const buffer = await QRCode.toBuffer(text, { type: 'png', width: size });
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};

exports.generateDataUrl = async (req, res, next) => {
  const text = req.query.text || req.query.data || 'Hello, QR!';
  try {
    const dataUrl = await QRCode.toDataURL(text);
    res.json({ dataUrl });
  } catch (err) {
    next(err);
  }
};

// POST /qr/upload
// Accept { imageUrl, description } in JSON and store it in DB
exports.uploadImage = async (req, res, next) => {
  try {
    // Accept either camelCase or snake_case keys
    const body = req.body || {};
    const image_url = body.image_url || body.imageUrl;
    const description = body.description === undefined ? null : body.description;
    const title = body.title === undefined ? null : body.title;

    if (!image_url || typeof image_url !== 'string') {
      return res.status(400).json({ error: '`image_url` is required and must be a string' });
    }

    // Validate URL
    try {
      new URL(image_url);
    } catch (e) {
      return res.status(400).json({ error: '`image_url` must be a valid URL' });
    }

    const item = await addImage({ imageUrl: image_url, description, title });
    return res.status(201).json({ image: item });
  } catch (err) {
    next(err);
  }
};

// GET /qr/dummy
// Returns a placeholder image URL to use for testing uploads
exports.getDummy = (req, res) => {
  const url = 'https://via.placeholder.com/300.png?text=QR+Test';
  res.json({ image_url: url, description: 'Dummy QR test image' });
};

// POST /qr/dummy
// Accepts multipart/form-data { file: <image>, description, title }
// Stores the file in /uploads and inserts a row into qr_test with image_url pointing to the uploaded file
exports.uploadDummyFile = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'file is required (field name: file)' });

    const description = req.body.description === undefined ? null : req.body.description;
    const title = req.body.title === undefined ? null : req.body.title;

    // Build accessible URL for the uploaded file
    const image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const item = await addImage({ imageUrl: image_url, description, title });
    return res.status(201).json({ image: item });
  } catch (err) {
    next(err);
  }
};

// GET /qr/images
// Return rows from qr_test (SELECT * FROM qr_test)
exports.getImages = async (req, res, next) => {
  try {
    const limit = Math.max(1, Math.min(1000, parseInt(req.query.limit, 10) || 100));
    const rows = await listQrTest(limit);
    return res.json({ images: rows });
  } catch (err) {
    next(err);
  }
};

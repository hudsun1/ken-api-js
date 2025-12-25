const QRCode = require('qrcode');
const { addImage, listImages } = require('../services/imageStore');

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
// Accept { imageUrl, description } in JSON and store it in-memory
exports.uploadImage = (req, res, next) => {
  try {
    const { imageUrl, description } = req.body || {};
    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(400).json({ error: '`imageUrl` is required and must be a string' });
    }
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: '`description` is required and must be a string' });
    }

    // simple url validation
    try {
      new URL(imageUrl);
    } catch (e) {
      return res.status(400).json({ error: '`imageUrl` must be a valid URL' });
    }

    const item = addImage({ imageUrl, description });
    return res.status(201).json({ image: item });
  } catch (err) {
    next(err);
  }
};

// GET /qr/images
// Returns both stored images and generated QR image URLs
exports.getImages = (req, res, next) => {
  try {
    const q = req.query.q || req.query.text || 'Hello, QR!';
    const count = Math.max(1, Math.min(10, parseInt(req.query.count, 10) || 3));
    const host = req.protocol + '://' + req.get('host');

    const generated = Array.from({ length: count }).map((_, i) => {
      const text = count === 1 ? q : `${q} ${i + 1}`;
      const imageUrl = `${host}/qr?text=${encodeURIComponent(text)}&size=300`;
      const description = `QR for: ${text}`;
      return { imageUrl, description };
    });

    // stored images (newest first)
    const stored = listImages();

    res.json({ images: [...stored, ...generated] });
  } catch (err) {
    next(err);
  }
};

const db = require('../db');

async function addImage({ imageUrl, description, title }) {
  // Insert into qr_test so uploaded items are visible via GET /qr/images
  const text = 'INSERT INTO qr_test (image_url, description, title) VALUES ($1, $2, $3) RETURNING *';
  const res = await db.query(text, [imageUrl, description || null, title || null]);
  const row = res.rows[0];
  return { ...row };
}

async function listImages(limit = 100) {
  const text = 'SELECT id, image_url, description, created_at FROM images ORDER BY created_at DESC LIMIT $1';
  const res = await db.query(text, [limit]);
  return res.rows.map(r => ({ id: r.id, image_url: r.image_url, description: r.description, created_at: r.created_at }));
}

// New: read directly from qr_test table
async function listQrTest(limit = 100) {
  const text = 'SELECT * FROM qr_test ORDER BY id DESC LIMIT $1';
  const res = await db.query(text, [limit]);
  // return rows as-is (columns come from the table; may include title, image_url, description, id)
  return res.rows.map(r => ({ ...r }));
}

module.exports = { addImage, listImages, listQrTest };

require('dotenv').config();
const { pool } = require('../src/db');

async function seed() {
  try {
    const res = await pool.query("INSERT INTO qr_test (image_url, description) VALUES ($1, $2) RETURNING id", ['https://seed.example/img.png', 'Seeded image']);
    console.log('Inserted id', res.rows[0].id);
  } catch (err) {
    console.error('Seed failed', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();

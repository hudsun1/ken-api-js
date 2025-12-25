require('dotenv').config();
const { pool } = require('../src/db');

async function check() {
  try {
    const res = await pool.query('SELECT id, image_url, description, created_at FROM images ORDER BY created_at DESC LIMIT 50');
    if (!res.rows.length) {
      console.log('No rows found in images table.');
    } else {
      console.table(res.rows);
    }
  } catch (err) {
    console.error('DB check failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

check();

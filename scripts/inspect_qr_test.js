require('dotenv').config();
const { pool } = require('../src/db');

async function inspect() {
  try {
    const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='qr_test'");
    console.table(res.rows);
  } catch (err) {
    console.error('Inspect failed', err.message);
  } finally {
    await pool.end();
  }
}

inspect();

require('dotenv').config();
const { pool } = require('../src/db');

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);
    console.log('Migration applied: images table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS qr_test (
        id SERIAL PRIMARY KEY,
        image_url TEXT,
        description TEXT,
        title TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);
    console.log('Migration applied: qr_test table ready (columns: image_url, description, title, created_at, updated_at)');

    // Ensure columns exist even if table was created earlier without them
    await pool.query(`ALTER TABLE qr_test ADD COLUMN IF NOT EXISTS title TEXT;`);
    await pool.query(`ALTER TABLE qr_test ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();`);
    // Optionally make image_url NOT NULL in a safe manner if there are no nulls
    const res = await pool.query("SELECT COUNT(*) AS null_count FROM qr_test WHERE image_url IS NULL");
    if (Number(res.rows[0].null_count) === 0) {
      await pool.query(`ALTER TABLE qr_test ALTER COLUMN image_url SET NOT NULL;`);
      console.log('Set qr_test.image_url NOT NULL');
    } else {
      console.log('Skipped setting qr_test.image_url NOT NULL because there are existing NULLs');
    }
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();

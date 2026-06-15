import pg from 'pg';
import fs from 'fs';
import path from 'path';
import "dotenv/config"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigration = async () => {
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

  try {
    await client.connect();
    const sql = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
    await client.query(sql);
    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
};

runMigration();

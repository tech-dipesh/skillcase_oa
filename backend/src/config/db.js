import pg from 'pg';
import "dotenv/config"

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

(async () => { 
  try { 
    await pool.connect(); 
    console.log("Database is connected"); 
  } catch (err) { 
    console.log(err)
  } 
})();
export default pool;

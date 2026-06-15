import pool from '../config/db.js';

export const createVideo = async (userId, title, description, category, filePath) => {
  const result = await pool.query(
    `INSERT INTO videos (user_id, title, description, category, file_path)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, title, description, category, filePath]
  );
  return result.rows[0];
};

export const getAllVideos = async () => {
  const result = await pool.query(
    `SELECT v.*, u.name as user_name
     FROM videos v
     JOIN users u ON v.user_id = u.id
     ORDER BY v.created_at DESC`
  );
  return result.rows;
};

export const getVideoById = async (id) => {
  const result = await pool.query(
    `SELECT v.*, u.name as user_name
     FROM videos v
     JOIN users u ON v.user_id = u.id
     WHERE v.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const incrementLikeCount = async (videoId, client) => {
  const db = client || pool;
  await db.query('UPDATE videos SET like_count = like_count + 1 WHERE id = $1', [videoId]);
};

export const decrementLikeCount = async (videoId, client) => {
  const db = client || pool;
  await db.query('UPDATE videos SET like_count = like_count - 1 WHERE id = $1', [videoId]);
};

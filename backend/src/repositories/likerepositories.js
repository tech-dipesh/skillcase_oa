import pool from '../config/db.js';

export const findLike = async (userId, videoId) => {
  const result = await pool.query(
    'SELECT * FROM likes WHERE user_id = $1 AND video_id = $2',
    [userId, videoId]
  );
  return result.rows[0];
};

export const addLike = async (userId, videoId, client) => {
  const db = client || pool;
  await db.query(
    'INSERT INTO likes (user_id, video_id) VALUES ($1, $2)',
    [userId, videoId]
  );
};

export const removeLike = async (userId, videoId, client) => {
  const db = client || pool;
  await db.query(
    'DELETE FROM likes WHERE user_id = $1 AND video_id = $2',
    [userId, videoId]
  );
};

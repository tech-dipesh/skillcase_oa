import pool from '../config/db.js';

export const findBookmark = async (userId, videoId) => {
  const result = await pool.query(
    'SELECT * FROM bookmarks WHERE user_id = $1 AND video_id = $2',
    [userId, videoId]
  );
  return result.rows[0];
};

export const addBookmark = async (userId, videoId, client) => {
  const db = client || pool;
  await db.query(
    'INSERT INTO bookmarks (user_id, video_id) VALUES ($1, $2)',
    [userId, videoId]
  );
};

export const removeBookmark = async (userId, videoId, client) => {
  const db = client || pool;
  await db.query(
    'DELETE FROM bookmarks WHERE user_id = $1 AND video_id = $2',
    [userId, videoId]
  );
};

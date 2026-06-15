import pool from '../config/db.js';

export const addComment = async (userId, videoId, content) => {
  const result = await pool.query(
    `INSERT INTO comments (user_id, video_id, content)
     VALUES ($1, $2, $3) RETURNING id, user_id, video_id, content, created_at`,
    [userId, videoId, content]
  );
  return result.rows[0];
};

export const getCommentsByVideoId = async (videoId) => {
  const result = await pool.query(
    `SELECT c.*, u.name as user_name
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.video_id = $1
     ORDER BY c.created_at ASC`,
    [videoId]
  );
  return result.rows;
};

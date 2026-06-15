import pool from '../config/db.js';
import * as videoRepository from '../repositories/videorepositories.js';
import * as likeRepository from '../repositories/likerepositories.js';
import * as bookmarkRepository from '../repositories/bookmarkrepositories.js';
import * as commentRepository from '../repositories/commentrepositories.js';

export const createVideo = async (userId, title, description, category, filePath) => {
  if (!title || !category) {
    const err = new Error('Title and category are required');
    err.status = 400;
    throw err;
  }
  const video = await videoRepository.createVideo(userId, title, description, category, filePath);
  return video;
};

export const getAllVideos = async () => {
  return await videoRepository.getAllVideos();
};

export const getVideoById = async (id) => {
  const video = await videoRepository.getVideoById(id);
  if (!video) {
    const err = new Error('Video not found');
    err.status = 404;
    throw err;
  }
  return video;
};

export const toggleLike = async (userId, videoId) => {
  const video = await videoRepository.getVideoById(videoId);
  if (!video) {
    const err = new Error('Video not found');
    err.status = 404;
    throw err;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await likeRepository.findLike(userId, videoId);
    if (existing) {
      await likeRepository.removeLike(userId, videoId, client);
      await videoRepository.decrementLikeCount(videoId, client);
    } else {
      await likeRepository.addLike(userId, videoId, client);
      await videoRepository.incrementLikeCount(videoId, client);
    }
    await client.query('COMMIT');
    const updatedVideo = await videoRepository.getVideoById(videoId);
    return { liked: !existing, likeCount: updatedVideo.like_count };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const addComment = async (userId, videoId, content) => {
  if (!content || content.trim() === '') {
    const err = new Error('Comment content cannot be empty');
    err.status = 400;
    throw err;
  }
  const video = await videoRepository.getVideoById(videoId);
  if (!video) {
    const err = new Error('Video not found');
    err.status = 404;
    throw err;
  }
  const comment = await commentRepository.addComment(userId, videoId, content);
  const user = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
  return { ...comment, user_name: user.rows[0].name };
};

export const getComments = async (videoId) => {
  const video = await videoRepository.getVideoById(videoId);
  if (!video) {
    const err = new Error('Video not found');
    err.status = 404;
    throw err;
  }
  return await commentRepository.getCommentsByVideoId(videoId);
};

export const toggleBookmark = async (userId, videoId) => {
  const video = await videoRepository.getVideoById(videoId);
  if (!video) {
    const err = new Error('Video not found');
    err.status = 404;
    throw err;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await bookmarkRepository.findBookmark(userId, videoId);
    if (existing) {
      await bookmarkRepository.removeBookmark(userId, videoId, client);
    } else {
      await bookmarkRepository.addBookmark(userId, videoId, client);
    }
    await client.query('COMMIT');
    return { bookmarked: !existing };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

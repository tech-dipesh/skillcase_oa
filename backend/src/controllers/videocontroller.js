import * as videoService from '../services/videoservices.js';

export const createVideo = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const filePath = req.file.path;
    const video = await videoService.createVideo(req.userId, title, description, category, filePath);
    res.status(201).json(video);
  } catch (err) {
    next(err);
  }
};

export const getAllVideos = async (req, res, next) => {
  try {
    const videos = await videoService.getAllVideos();
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const getVideoById = async (req, res, next) => {
  try {
    const video = await videoService.getVideoById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const result = await videoService.toggleLike(req.userId, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await videoService.addComment(req.userId, req.params.id, content);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await videoService.getComments(req.params.id);
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

export const toggleBookmark = async (req, res, next) => {
  try {
    const result = await videoService.toggleBookmark(req.userId, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

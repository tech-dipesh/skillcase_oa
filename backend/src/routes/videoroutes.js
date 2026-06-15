import express from 'express';
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { upload } from '../middlewares/uploadmiddleware.js';
import { validate, videoUploadValidation, commentValidation, idParamValidation } from '../utils/validators.js';
import {
  createVideo,
  getAllVideos,
  getVideoById,
  toggleLike,
  addComment,
  getComments,
  toggleBookmark
} from '../controllers/videocontroller.js';

const router = express.Router();

router.post('/', authMiddleware, upload.single('video'), validate(videoUploadValidation), createVideo);
router.get('/', getAllVideos);
router.get('/:id', validate(idParamValidation), getVideoById);
router.post('/:id/like', authMiddleware, validate(idParamValidation), toggleLike);
router.post('/:id/comment', authMiddleware, validate([...idParamValidation, ...commentValidation]), addComment);
router.get('/:id/comments', validate(idParamValidation), getComments);
router.post('/:id/bookmark', authMiddleware, validate(idParamValidation), toggleBookmark);

export default router;

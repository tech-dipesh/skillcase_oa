import { createSlice } from '@reduxjs/toolkit';
import api from '../api/Axios';

const initialState = {
  videos: [],
  currentVideoIndex: 0,
  isLoading: false,
  error: null,
  comments: {},
  commentLoading: {}
};

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.isLoading = false;
      state.videos = action.payload;
    },
    fetchError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setCurrentIndex: (state, action) => {
      state.currentVideoIndex = action.payload;
    },
    optimisticLike: (state, action) => {
      const { videoId, liked } = action.payload;
      const video = state.videos.find(v => v.id == videoId);
      if (video) {
        if (liked) {
          video.like_count += 1;
          video.userLiked = true;
        } else {
          video.like_count -= 1;
          video.userLiked = false;
        }
      }
    },
    setComments: (state, action) => {
      const { videoId, comments } = action.payload;
      state.comments[videoId] = comments;
    },
    addCommentLocal: (state, action) => {
      const { videoId, comment } = action.payload;
      if (state.comments[videoId]) {
        state.comments[videoId].unshift(comment);
      } else {
        state.comments[videoId] = [comment];
      }
    },
    setCommentLoading: (state, action) => {
      const { videoId, loading } = action.payload;
      state.commentLoading[videoId] = loading;
    },
    toggleBookmarkLocal: (state, action) => {
      const { videoId, bookmarked } = action.payload;
      const video = state.videos.find(v => v.id == videoId);
      if (video) {
        video.userBookmarked = bookmarked;
      }
    }
  }
});

export const {
  fetchStart,
  fetchSuccess,
  fetchError,
  setCurrentIndex,
  optimisticLike,
  setComments,
  addCommentLocal,
  setCommentLoading,
  toggleBookmarkLocal
} = videoSlice.actions;

export const fetchVideos = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await api.get('/videos');
    const videos = res.data.map(v => ({ ...v, userLiked: false, userBookmarked: false }));
    dispatch(fetchSuccess(videos));
  } catch (err) {
    dispatch(fetchError(err.response?.data?.error || 'Failed to load videos'));
  }
};

export const toggleLike = (videoId, currentLikedState) => async (dispatch) => {
  dispatch(optimisticLike({ videoId, liked: !currentLikedState }));
  try {
    await api.post(`/videos/${videoId}/like`);
  } catch (err) {
    dispatch(optimisticLike({ videoId, liked: currentLikedState }));
    console.error('Like failed', err);
  }
};

export const fetchComments = (videoId) => async (dispatch) => {
  dispatch(setCommentLoading({ videoId, loading: true }));
  try {
    const res = await api.get(`/videos/${videoId}/comments`);
    dispatch(setComments({ videoId, comments: res.data }));
  } catch (err) {
    console.error('Failed to load comments', err);
  } finally {
    dispatch(setCommentLoading({ videoId, loading: false }));
  }
};

export const postComment = (videoId, content) => async (dispatch) => {
  try {
    const res = await api.post(`/videos/${videoId}/comment`, { content });
    dispatch(addCommentLocal({ videoId, comment: res.data }));
  } catch (err) {
    console.error('Failed to post comment', err);
  }
};

export const toggleBookmark = (videoId, currentState) => async (dispatch) => {
  dispatch(toggleBookmarkLocal({ videoId, bookmarked: !currentState }));
  try {
    await api.post(`/videos/${videoId}/bookmark`);
  } catch (err) {
    dispatch(toggleBookmarkLocal({ videoId, bookmarked: currentState }));
    console.error('Bookmark failed', err);
  }
};

export default videoSlice.reducer;

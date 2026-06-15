import { createSlice } from '@reduxjs/toolkit';
import api from '../api/Axios';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setUser: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
    },
    setError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    }
  }
});

export const { setLoading, setUser, setError, logout } = authSlice.actions;

export const register = (userData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const res = await api.post('/auth/register', userData);
    dispatch(setUser({ user: res.data.user, token: res.data.token }));
    return true;
  } catch (err) {
    dispatch(setError(err.response?.data?.error || 'Registration failed'));
    return false;
  }
};

export const login = (credentials) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const res = await api.post('/auth/login', credentials);
    dispatch(setUser({ user: res.data.user, token: res.data.token }));
    return true;
  } catch (err) {
    dispatch(setError(err.response?.data?.error || 'Login failed'));
    return false;
  }
};

export const fetchMe = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  if (!token) return;
  try {
    const res = await api.get('/auth/me');
    dispatch(setUser({ user: res.data.user, token }));
  } catch {
    dispatch(logout());
  }
};

export default authSlice.reducer;

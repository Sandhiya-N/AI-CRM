import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  global: false,
  chat: false,
  history: false,
  form: false,
  doctors: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      if (key in state) {
        state[key] = value;
      }
    },
    setGlobalLoading: (state, action) => {
      state.global = action.payload;
    },
    resetLoading: () => initialState,
  },
});

export const { setLoading, setGlobalLoading, resetLoading } =
  loadingSlice.actions;

export default loadingSlice.reducer;

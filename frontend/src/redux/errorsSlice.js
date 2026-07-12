import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  global: null,
  chat: null,
  history: null,
  form: null,
  doctors: null,
};

const errorsSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    setError: (state, action) => {
      const { key, value } = action.payload;
      if (key in state) {
        state[key] = value;
      }
    },
    clearError: (state, action) => {
      const key = action.payload;
      if (key in state) {
        state[key] = null;
      }
    },
    clearAllErrors: () => initialState,
  },
});

export const { setError, clearError, clearAllErrors } = errorsSlice.actions;

export default errorsSlice.reducer;

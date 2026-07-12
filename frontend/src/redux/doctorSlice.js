import { createSlice } from '@reduxjs/toolkit';
import { doctors } from '../data/mockData';

const initialState = {
  list: doctors,
  selected: null,
  searchQuery: '',
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    setSelectedDoctor: (state, action) => {
      state.selected = action.payload;
    },
    clearSelectedDoctor: (state) => {
      state.selected = null;
    },
    setDoctorSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addDoctor: (state, action) => {
      state.list.push(action.payload);
    },
    updateDoctor: (state, action) => {
      const index = state.list.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeDoctor: (state, action) => {
      state.list = state.list.filter((d) => d.id !== action.payload);
    },
  },
});

export const {
  setSelectedDoctor,
  clearSelectedDoctor,
  setDoctorSearchQuery,
  addDoctor,
  updateDoctor,
  removeDoctor,
} = doctorSlice.actions;

export default doctorSlice.reducer;

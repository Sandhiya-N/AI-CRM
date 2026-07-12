import { configureStore } from '@reduxjs/toolkit';
import doctorReducer from './doctorSlice';
import interactionReducer from './interactionSlice';
import historyReducer from './historySlice';
import chatReducer from './chatSlice';
import loadingReducer from './loadingSlice';
import errorsReducer from './errorsSlice';

export const store = configureStore({
  reducer: {
    doctor: doctorReducer,
    interaction: interactionReducer,
    history: historyReducer,
    chat: chatReducer,
    loading: loadingReducer,
    errors: errorsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

import { configureStore } from '@reduxjs/toolkit';
import initialReducer from './initialReducer';

export default configureStore({
  reducer: initialReducer,
});

import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../pages/board/task/taskSlice';
import labelReducer from '../pages/board/labels/labelsSlice';
import modalReducer from './modalSlice';
import { apiSlice } from 'api/ApiSlice';
export default configureStore({
  reducer: {
    tasks: taskReducer,
    labels: labelReducer,
    modal: modalReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

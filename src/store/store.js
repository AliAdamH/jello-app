import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../pages/board/task/taskSlice';
import boardReducer from '../pages/board/boardSlice';
import labelReducer from '../pages/board/labels/labelsSlice';
import { apiSlice } from 'api/ApiSlice';
export default configureStore({
  reducer: {
    tasks: taskReducer,
    boards: boardReducer,
    labels: labelReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

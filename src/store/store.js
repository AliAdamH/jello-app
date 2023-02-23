import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../pages/board/task/taskSlice';
import boardReducer from '../pages/board/boardSlice';
import labelReducer from '../pages/board/labels/labelsSlice';
export default configureStore({
  reducer: {
    tasks: taskReducer,
    boards: boardReducer,
    labels: labelReducer,
  },
});

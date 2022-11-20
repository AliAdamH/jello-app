import { configureStore } from '@reduxjs/toolkit';
import initialReducer from './initialReducer';
import taskReducer from '../components/card/taskSlice';
import boardReducer from '../components/board/boardSlice';
import labelReducer from '../components/labels/labelsSlice';
export default configureStore({
  reducer: {
    tasks: taskReducer,
    boards: boardReducer,
    labels: labelReducer,
  },
});

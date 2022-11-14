import { configureStore } from '@reduxjs/toolkit';
import initialReducer from './initialReducer';
import taskReducer from '../components/card/taskSlice';
import boardReducer from '../components/board/boardSlice';
export default configureStore({
  reducer: {
    tasks: taskReducer,
    boards: boardReducer,
  },
});

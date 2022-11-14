import { configureStore } from '@reduxjs/toolkit';
import initialReducer from './initialReducer';
import taskReducer from '../components/card/taskSlice';
export default configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

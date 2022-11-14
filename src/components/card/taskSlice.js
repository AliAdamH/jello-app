import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
});

export const fetchTask = createAsyncThunk(
  'tasks/fetchTask',
  async (taskId, _) => {
    const response = await fetch(
      `http://localhost:3000/api/v1/tasks/${taskId}`
    );
    const taskData = await response.json();
    console.log('Task successfully received', taskData);
    return taskData;
  }
);

// 1 - Add the update task thunk.

export const {} = taskSlice.actions;

export default taskSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { taskTitleUpdate } from '../board/boardSlice';

const initialState = {
  task: null,
  status: 'idle',
  errors: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    resetTaskState(state) {
      Object.assign(state, initialState);
    },
    handleTitleChange(state, action) {
      state.task.title = action.payload;
      console.log(state.task.title);
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchTask.fulfilled, (state, action) => {
      state.task = action.payload;
      state.status = 'successful';
    });
  },
});

export const fetchTask = createAsyncThunk(
  'tasks/fetchTask',
  async (taskId, _) => {
    const response = await fetch(
      `http://localhost:3000/api/v1/tasks/${taskId}`
    );
    const taskData = await response.json();
    console.log('Task successfully received', taskData);
    console.log('Will update task slice state.');
    return taskData;
  }
);

// 1 - Add the update task thunk.
export const updateTask = createAsyncThunk(
  'tasks/updateTaskTitle',
  async (_, { dispatch, getState }) => {
    const currentTask = getState().tasks.task;
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: currentTask,
      }),
    };
    await fetch('http://localhost:3000/api/v1/tasks', requestOptions);
    dispatch(taskTitleUpdate(currentTask));
  }
);
export const { handleTitleChange, resetTaskState } = taskSlice.actions;

export default taskSlice.reducer;

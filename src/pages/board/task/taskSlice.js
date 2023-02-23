import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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
    },
    handleDescriptionChange(state, action) {
      state.task.description = action.payload;
    },
    handleCoverColorChange(state, action) {
      let { newCoverColor, newCoverTextColor } = action.payload;
      state.task.coverColor = newCoverColor;
      state.task.coverTextColor = newCoverTextColor;
    },
    handleLabelAssignment(state, action) {
      let { id } = action.payload;
      state.task.labels[id] = action.payload;
    },
    handleLabelRemoval(state, action) {
      let { id } = action.payload;
      const { [id]: _, ...rest } = state.task.labels;
      state.task.labels = rest;
    },
    handleDueDate(state, action) {
      let { dueDate, dueDateStatus } = action.payload;
      state.task.dueDate = dueDate;
      state.task.dueDateStatus = dueDateStatus;
      // state.task.dueDateReminder = dueDateReminder;
    },
    handleDueDateExceeded(state, _) {
      state.task.dueDateStatus = 'overdue';
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
    return taskData;
  }
);

// 1 - Add the update task thunk.
export const updateTask = createAsyncThunk(
  'tasks/updateTaskTitle',
  async (_, { getState }) => {
    const currentTask = getState().tasks.task;
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: currentTask,
      }),
    };
    await fetch('http://localhost:3000/api/v1/tasks', requestOptions);
  }
);

export const {
  handleTitleChange,
  resetTaskState,
  handleDescriptionChange,
  handleCoverColorChange,
  handleLabelAssignment,
  handleLabelRemoval,
  handleDueDate,
  handleDueDateExceeded,
} = taskSlice.actions;

export default taskSlice.reducer;

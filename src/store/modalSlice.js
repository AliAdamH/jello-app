import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},
  open: false,
  errors: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setOpenTaskId(state, action) {
      state.data.taskId = action.payload;
      state.open = true;
    },
    removeOpenTask(state, action) {
      state.open = false;
    },
  },
});

export const { setOpenTaskId, removeOpenTask } = modalSlice.actions;

export default modalSlice.reducer;

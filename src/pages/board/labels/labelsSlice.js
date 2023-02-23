import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: {},
  status: 'idle',
  errors: null,
};

const labelsSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    optimisticLabelUpdate(state, action) {
      const updatedLabel = action.payload;
      state.items[updatedLabel.id] = updatedLabel;
    },
    optimisticLabelDeletion(state, action) {
      const { id } = action.payload;
      const { [id]: _discard, ...rest } = state.items;
      state.items = rest;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchLabelsOfBoard.fulfilled, (state, action) => {
        state.items = action.payload.labels;
      })
      .addCase(createLabel.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.items[id] = action.payload;
      });
  },
});

export const { optimisticLabelUpdate, optimisticLabelDeletion } =
  labelsSlice.actions;

export const fetchLabelsOfBoard = createAsyncThunk(
  'labels/fetchLabelsOfBoard',
  async (boardId, _) => {
    const response = await fetch(
      // TODO: Make sure you get  the board Id from the route params instead.
      // Applicable for the board.js component as well as it's fetchBoardData thunk.
      'http://localhost:3000/api/v1/labels?board=' + 1
    );
    return await response.json();
  }
);

export const createLabel = createAsyncThunk(
  'labels/createLabel',
  async (newLabel, { getState }) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: {
          name: newLabel.name,
          board_id: getState().boards.data.id,
          color: newLabel.color,
        },
      }),
    };
    const response = await fetch(
      'http://localhost:3000/api/v1/labels',
      requestOptions
    );

    return await response.json();
  }
);

export const updateLabel = createAsyncThunk(
  'labels/updateLabel',
  async (label, { dispatch }) => {
    console.log(label);
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label,
      }),
    };

    await fetch('http://localhost:3000/api/v1/labels', requestOptions).catch(
      (error) => console.error(error)
    );
  }
);

export const assignLabel = createAsyncThunk(
  'labels',
  async (label, { getState }) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label_id: label.id,
        task_id: getState().tasks.task.id,
      }),
    };
    const response = await fetch(
      'http://localhost:3000/api/v1/task_labels',
      requestOptions
    );

    return await response.json();
  }
);

export const removeAssignedLabel = createAsyncThunk(
  'labels/removeAssignedLabel',
  async (label, { getState }) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label_id: label.id,
        task_id: getState().tasks.task.id,
      }),
    };

    await fetch(
      'http://localhost:3000/api/v1/task_labels',
      requestOptions
    ).catch((error) => console.error(error));
  }
);

export const deleteLabel = createAsyncThunk(
  'labels/deleteLabel',
  async (label, _) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label,
      }),
    };

    await fetch('http://localhost:3000/api/v1/labels', requestOptions).catch(
      (error) => console.error(error)
    );
  }
);

export default labelsSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {};

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {},
});

export const updateColumnOrder = createAsyncThunk(
  'boards/updateColumnOrder',
  async ({ boardId, newColOrderIds }, _) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        board: {
          id: boardId,
          col_order_ids: newColOrderIds,
        },
      }),
    };
    await fetch(
      'http://localhost:3000/api/v1/order_columns/' + boardId,
      requestOptions
    ).catch((error) => console.error(error));
    console.log('WOOO COL UPDATE !');
  }
);

export const {} = boardSlice.actions;

export default boardSlice.reducer;

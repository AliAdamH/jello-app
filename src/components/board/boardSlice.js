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

export const taskInnerReorder = createAsyncThunk(
  'boards/TaskInnerReorder',
  async ({ columnId, taskOrderIds }, _) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        column: {
          id: columnId,
          task_orders: taskOrderIds,
        },
      }),
    };
    await fetch(
      'http://localhost:3000/api/v1/order_tasks/' + columnId,
      requestOptions
    ).catch((error) => console.error(error));

    console.log('WOO INNER ASK REORDER');
  }
);

export const fullTaskMovement = createAsyncThunk(
  'board/fullTaskMovement',
  async ({ taskId, targetColumn, initialColumn }, _) => {
    const requestBody = {
      to_col: {
        id: targetColumn.id,
        task_orders: targetColumn.taskOrders,
      },
      from_col: {
        id: initialColumn.id,
        task_orders: initialColumn.taskOrders,
      },
    };
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    };
    await fetch(
      'http://localhost:3000/api/v1/tasks/' + taskId,
      requestOptions
    ).catch((error) => console.error(error));

    console.log('WOO full task movement');
  }
);

export const {} = boardSlice.actions;

export default boardSlice.reducer;

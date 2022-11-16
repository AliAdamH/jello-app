import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},
  status: 'idle',
  errors: null,
};

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    optimisticColumnDrag(state, action) {
      state.data.colOrderIds = action.payload;
    },
    optimisticInnerTaskReorder(state, action) {
      const { columnId, newTaskOrders } = action.payload;
      state.data.columns[columnId].taskOrders = newTaskOrders;
    },
    optimisticFullTaskReorder(state, action) {
      const { startColumnId, finishColumnId, updatedStart, updatedFinish } =
        action.payload;
      state.data.columns[startColumnId] = updatedStart;
      state.data.columns[finishColumnId] = updatedFinish;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBoardData.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchBoardData.fulfilled, (state, action) => {
        state.status = 'success';
        state.data = action.payload;
      })
      .addCase(newColumn.fulfilled, (state, action) => {
        const columnId = action.payload.id;
        state.data.columns[columnId] = action.payload;
        state.data.colOrderIds.push(columnId);
      })
      .addCase(createTask.fulfilled, (state, action) => {
        const { columnId, id } = action.payload;
        state.data.columns[columnId].tasks[id] = action.payload;
        state.data.columns[columnId].taskOrders.push(id);
      });
  },
});

export const createTask = createAsyncThunk(
  'boards/CreateTask',
  async ({ title, columnId }, _) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: { column_id: columnId, title: title },
      }),
    };

    let apiTaskResponse = await fetch(
      'http://localhost:3000/api/v1/tasks',
      requestOptions
    );
    console.log('WOO Created the task !');
    return await apiTaskResponse.json();
  }
);

export const newColumn = createAsyncThunk(
  'boards/newColumn',
  async ({ columnTitle, boardId }, _) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        column: { title: columnTitle, board_id: boardId },
      }),
    };

    const response = await fetch(
      'http://localhost:3000/api/v1/columns',
      requestOptions
    );

    return await response.json();
  }
);

export const fetchBoardData = createAsyncThunk(
  'boards/fetchBoardData',
  async (boardId, _) => {
    const response = await fetch(`http://localhost:3000/api/v1/boards`);
    return await response.json();
  }
);

export const updateColumnOrder = createAsyncThunk(
  'boards/updateColumnOrder',
  async ({ boardId, newColOrderIds }, _) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // remove duplicated boardId ?
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

export const {
  optimisticColumnDrag,
  optimisticInnerTaskReorder,
  optimisticFullTaskReorder,
} = boardSlice.actions;

export default boardSlice.reducer;

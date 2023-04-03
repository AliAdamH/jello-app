import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/v1' }),
  tagTypes: ['Board'],
  endpoints: (builder) => ({
    getBoardData: builder.query({
      query: () => '/boards',
      providesTags: ['Board'],
    }),
    getBoardLabels: builder.query({
      query: (boardId) => `/labels?board=${boardId}`,
    }),
    getTask: builder.query({
      query: (taskId) => `/tasks/${taskId}`,
    }),
    createTask: builder.mutation({
      query: (taskData) => ({
        url: '/tasks',
        method: 'POST',
        body: taskData,
      }),
      async onQueryStarted(taskData, { dispatch, queryFulfilled }) {
        const { data: newTask } = await queryFulfilled;
        dispatch(
          apiSlice.util.updateQueryData('getBoardData', undefined, (draft) => {
            return Object.assign(draft, {
              ...draft,
              columns: {
                ...draft.columns,
                [newTask.columnId]: {
                  ...draft.columns[newTask.columnId],
                  taskOrders: [
                    ...draft.columns[newTask.columnId].taskOrders,
                    Number(newTask.id),
                  ],
                },
              },
              tasks: {
                ...draft.tasks,
                [newTask.id]: newTask,
              },
            });
          })
        );
      },
    }),
    createColumn: builder.mutation({
      query: (columnData) => ({
        url: '/columns',
        method: 'POST',
        body: columnData,
      }),
      async onQueryStarted(columnData, { dispatch, queryFulfilled }) {
        const { data: newColumn } = await queryFulfilled;

        dispatch(
          apiSlice.util.updateQueryData(
            'getBoardData',
            undefined,
            (boardData) => {
              Object.assign(boardData, {
                ...boardData,
                colOrderIds: [...boardData.colOrderIds, Number(newColumn.id)],
                columns: {
                  ...boardData.columns,
                  [newColumn.id]: { ...newColumn },
                },
              });
            }
          )
        );
      },
    }),
    deleteColumn: builder.mutation({
      query: ({ columnId }) => ({
        url: '/columns',
        method: 'DELETE',
        body: { id: columnId },
      }),
      async onQueryStarted({ columnId }, { dispatch, queryFulfilled }) {
        /*
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            'getBoardData',
            undefined,
            (boardData) => {
              const newTasks = Object.entries(boardData.tasks).filter(
                ([id, task]) => {
                  return Number(task.columnId) !== columnId;
                }
              );

              const newColumns = Object.entries(boardData.columns).filter(
                ([id, column]) => {
                  console.log(id)
                  return Number(id) !== columnId;
                }
              );
              // const { [columnId]: _discard, ...restOfColumns } =
              //   boardData.columns;
              // console.log(restOfColumns);
              Object.assign(boardData, {
                ...boardData,
                columns: Object.fromEntries(newColumns),
                colOrderIds: boardData.colOrderIds.filter(
                  (id) => id !== columnId
                ),
                tasks: Object.fromEntries(newTasks),
              });
              console.log(Object.entries(boardData.columns));
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
        */
        await queryFulfilled;
        dispatch(
          apiSlice.util.updateQueryData(
            'getBoardData',
            undefined,
            (boardData) => {
              const newTasks = Object.entries(boardData.tasks).filter(
                ([id, task]) => {
                  return Number(task.columnId) !== Number(columnId);
                }
              );
              const { [columnId]: _discard, ...restOfColumns } =
                boardData.columns;
              boardData.columns = restOfColumns;
              boardData.colOrderIds = boardData.colOrderIds.filter(
                (id) => id !== Number(columnId)
              );
              boardData.tasks = Object.fromEntries(newTasks);
            }
          )
        );
      },
    }),
    deleteTask: builder.mutation({
      query: (task) => ({
        url: '/tasks',
        method: 'DELETE',
        body: { id: task.id },
      }),
      async onQueryStarted(task, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getBoardData', undefined, (result) => {
            // remove the task from the tasks
            delete result.tasks[task.id];
            // remove the taskId from the taskOrders.
            result.columns[task.columnId].taskOrders = result.columns[
              task.columnId
            ].taskOrders.filter((taskId) => taskId !== Number(task.id));
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
    updateColumn: builder.mutation({
      query: ({ columnId, title }) => ({
        url: '/columns',
        method: 'PUT',
        body: { column: { id: columnId, title } },
      }),
      async onQueryStarted({ columnId, title }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getBoardData', undefined, (result) => {
            result.columns[columnId].title = title;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateColumnOrder: builder.mutation({
      query: ({ boardId, newColOrderIds }) => ({
        url: '/order_columns',
        method: 'PUT',
        body: {
          board: {
            id: boardId,
            col_order_ids: newColOrderIds,
          },
        },
      }),
      async onQueryStarted(
        { boardId, newColOrderIds },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getBoardData', undefined, (result) => {
            result.colOrderIds = newColOrderIds;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetBoardDataQuery,
  useGetBoardLabelsQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useCreateColumnMutation,
  useDeleteColumnMutation,
  useDeleteTaskMutation,
  useUpdateColumnMutation,
  useUpdateColumnOrderMutation,
} = apiSlice;

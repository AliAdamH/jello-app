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
      providesTags: (result, error, arg) => {
        return [{ type: 'Task', id: result.id }];
      },
    }),
    getBoardTasks: builder.query({
      query: (boardId) => `/tasks?board=${boardId}`,
      providesTags: (result, error, arg) => {
        return Object.keys(result).map((id) => {
          return { type: 'Task', id };
        });
      },
    }),
    createTask: builder.mutation({
      query: ({ task, boardId }) => ({
        url: '/tasks',
        method: 'POST',
        body: { task },
      }),
      async onQueryStarted({ task, boardId }, { dispatch, queryFulfilled }) {
        const { data: newTask } = await queryFulfilled;
        dispatch(
          apiSlice.util.updateQueryData('getBoardTasks', boardId, (result) => {
            result[newTask.id] = newTask;
          })
        );

        dispatch(
          apiSlice.util.updateQueryData('getBoardData', undefined, (result) => {
            result.columns[newTask.columnId].taskOrders.push(
              Number(newTask.id)
            );
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
      query: ({ columnId, boardId }) => ({
        url: '/columns',
        method: 'DELETE',
        body: { id: columnId },
      }),
      async onQueryStarted(
        { columnId, boardId },
        { dispatch, queryFulfilled }
      ) {
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
        // remove the column
        dispatch(
          apiSlice.util.updateQueryData(
            'getBoardData',
            undefined,
            (boardData) => {
              boardData.colOrderIds = boardData.colOrderIds.filter(
                (id) => id !== Number(columnId)
              );
              delete boardData.columns[columnId];
            }
          )
        );
        // remove the tasks.
        dispatch(
          apiSlice.util.updateQueryData('getBoardTasks', boardId, (result) => {
            Object.keys(result).forEach((taskId) => {
              if (result[taskId].columnId === columnId) {
                delete result[taskId];
              }
            });
          })
        );
      },
    }),
    deleteTask: builder.mutation({
      query: ({ task, boardId }) => ({
        url: '/tasks',
        method: 'DELETE',
        body: { id: task.id },
      }),
      async onQueryStarted({ task, boardId }, { dispatch, queryFulfilled }) {
        // remove from colOrders then remove from task query cache
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getBoardData', undefined, (result) => {
            // remove the taskId from the taskOrders.
            result.columns[task.columnId].taskOrders = result.columns[
              task.columnId
            ].taskOrders.filter((taskId) => taskId !== Number(task.id));
          })
        );
        const taskPatchResult = dispatch(
          apiSlice.util.updateQueryData('getBoardTasks', boardId, (result) => {
            delete result[task.id];
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          taskPatchResult.undo();
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
    updateTaskVerticalOrder: builder.mutation({
      query: ({ columnId, newTaskIds }) => ({
        url: '/order_tasks',
        method: 'PUT',
        body: {
          column: {
            id: columnId,
            task_orders: newTaskIds,
          },
        },
      }),
      async onQueryStarted(
        { columnId, newTaskIds },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getBoardData', undefined, (result) => {
            result.columns[columnId].taskOrders = newTaskIds;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateTaskHorizontalOrder: builder.mutation({
      query: ({ initialColumn, targetColumn, taskId, boardId }) => ({
        url: '/move_tasks',
        method: 'PUT',
        body: {
          id: taskId,
          to_col: {
            id: targetColumn.id,
            task_orders: targetColumn.taskOrders,
          },
          from_col: {
            id: initialColumn.id,
            task_orders: initialColumn.taskOrders,
          },
        },
      }),
      async onQueryStarted(
        { initialColumn, targetColumn, taskId, boardId },
        { dispatch, queryFulfilled }
      ) {
        // update the columns
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getBoardData', undefined, (result) => {
            result.columns[initialColumn.id].taskOrders =
              initialColumn.taskOrders;
            result.columns[targetColumn.id].taskOrders =
              targetColumn.taskOrders;
          })
        );
        // update the tasks
        const taskPatchResult = dispatch(
          apiSlice.util.updateQueryData('getBoardTasks', boardId, (result) => {
            result[taskId].columnId = targetColumn.id;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          taskPatchResult.undo();
        }
      },
    }),
    updateTaskData: builder.mutation({
      query: ({ task, boardId }) => ({
        url: '/tasks',
        method: 'PUT',
        body: { task },
      }),
      async onQueryStarted({ task, boardId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getTask', task.id, (result) => {
            result = task;
          })
        );
        const taskBoardPatchResult = dispatch(
          apiSlice.util.updateQueryData('getBoardTasks', boardId, (result) => {
            result[task.id] = task;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, arg) => {
        return [{ type: 'Task', id: arg.id }];
      },
    }),
  }),
});

export const {
  useGetBoardDataQuery,
  useGetBoardLabelsQuery,
  useGetTaskQuery,
  useGetBoardTasksQuery,
  useCreateTaskMutation,
  useCreateColumnMutation,
  useDeleteColumnMutation,
  useDeleteTaskMutation,
  useUpdateColumnMutation,
  useUpdateColumnOrderMutation,
  useUpdateTaskVerticalOrderMutation,
  useUpdateTaskHorizontalOrderMutation,
  useUpdateTaskDataMutation,
} = apiSlice;

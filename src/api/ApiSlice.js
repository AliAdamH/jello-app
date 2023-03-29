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
  }),
});

export const {
  useGetBoardDataQuery,
  useGetBoardLabelsQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useCreateColumnMutation,
} = apiSlice;

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
        console.log('hey');
        const { data: newTask } = await queryFulfilled;
        console.log('Yea ?');
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
        console.log('No ?');
      },
    }),
  }),
});

export const {
  useGetBoardDataQuery,
  useGetBoardLabelsQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
} = apiSlice;

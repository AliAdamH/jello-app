import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/v1' }),
  endpoints: (builder) => ({
    getBoardData: builder.query({
      query: () => '/boards',
    }),
    getBoardLabels: builder.query({
      query: (boardId) => `/labels?board=${boardId}`,
    }),
    getTask: builder.query({
      query: (taskId) => `/tasks/${taskId}`,
    }),
    createTask: builder.mutation({
      query: (data) => ({
        url: '/tasks',
        method: 'PUT',
        body: data,
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        const patchResult = () => void 0;
      },
    }),
  }),
});

export const { useGetBoardDataQuery, useGetBoardLabelsQuery, useGetTaskQuery } =
  apiSlice;

import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "./customFetchBase";
import { setUser } from "../features/userSlice";
import { IUser, IGetmeResponse, IGenericResponse } from "./types";
import { NewStaffSaveSchema } from "../../components/modals/staff.modal";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: customFetchBase,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMe: builder.query<IUser, null>({
      query() {
        return {
          url: "users/me",
          credentials: "include",
        };
      },
      transformResponse: (result: IGetmeResponse) => result.user,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {}
      },
    }),
    addStaff: builder.mutation<IGenericResponse, NewStaffSaveSchema>({
      query(data) {
        return {
          method: "POST",
          url: "/users",
          body: data,
          credentials: "include",
        };
      },
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    getStaff: builder.query<
      {
        total_counts: number;
        users: { name: string; role: string; createdAt: string }[];
      },
      { page: number; rowsPerPage: number }
    >({
      query({ page, rowsPerPage }) {
        return {
          url: `/users?page=${page}&rowsPerPage=${rowsPerPage}`,
          credentials: "include",
        };
      },
      providesTags: [{ type: "User", id: "LIST" }],
    }),
    updateMe: builder.mutation<
      IGenericResponse,
      { email?: string; mobile?: string; password?: string }
    >({
      query(data) {
        return {
          method: "PATCH",
          url: "/users",
          body: data,
          credentials: "include",
        };
      },
    }),
    getSales: builder.query<IUser[], void>({
      query() {
        return {
          url: "/users/sales",
          credentials: "include",
        };
      },
      transformResponse: (result: { data: IUser[] }) => result.data,
    }),
  }),
});

export const {
  useAddStaffMutation,
  useLazyGetStaffQuery,
  useUpdateMeMutation,
  useLazyGetSalesQuery,
} = userApi;

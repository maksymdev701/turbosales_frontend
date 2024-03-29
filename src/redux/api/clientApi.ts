import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "./customFetchBase";
import { NewClientSaveInput } from "../../components/modals/client.modal";
import { IClient, IClientTableItem, IGenericResponse } from "./types";

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: customFetchBase,
  tagTypes: ["Client"],
  endpoints: (builder) => ({
    addClient: builder.mutation<IGenericResponse, NewClientSaveInput>({
      query(data) {
        return {
          url: "clients",
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
      invalidatesTags: [{ type: "Client", id: "LIST" }],
    }),
    getClients: builder.query<IClient[], void>({
      query() {
        return {
          url: "clients",
          method: "GET",
          credentials: "include",
        };
      },
      transformResponse: (result: { data: IClient[] }) => result.data,
      providesTags: [{ type: "Client", id: "LIST" }],
    }),
    filterClients: builder.query<
      {
        total_counts: number;
        filtered_counts: number;
        clients: IClientTableItem[];
      },
      {
        page: number;
        rowsPerPage: number;
        country: string;
        center: string;
        search: string;
      }
    >({
      query({ page, rowsPerPage, country, center, search }) {
        return {
          url: `/clients/filter?page=${page}&rowsperPage=${rowsPerPage}&country=${country}&center=${center}&search=${search}`,
          credentials: "include",
        };
      },
      transformResponse: (result: {
        data: {
          total_counts: number;
          filtered_counts: number;
          clients: IClientTableItem[];
        };
      }) => result.data,
    }),
  }),
});

export const {
  useAddClientMutation,
  useGetClientsQuery,
  useLazyFilterClientsQuery,
} = clientApi;

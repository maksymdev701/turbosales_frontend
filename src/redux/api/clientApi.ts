import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "./customFetchBase";
import { NewClientSaveInput } from "../../components/modals/client.modal";
import { IClient, IGenericResponse } from "./types";

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: customFetchBase,
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
    }),
  }),
});

export const { useAddClientMutation, useGetClientsQuery } = clientApi;

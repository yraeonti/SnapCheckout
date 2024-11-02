import { IClient } from "@/types/client.dto";

import axios from "axios";

export const getClients = async (): Promise<IClient[]> => {
  const response = await axios.get("/api/client");

  return response.data.data;
};

export type ClientPayload = {
  id?: string;
  email: string;
  phone: string;
  name: string;
};
export const addClient = async (data: ClientPayload) => {
  const response = await axios.post(`/api/client`, data);

  return response;
};

export const updateClient = async (id?: string, data?: ClientPayload) => {
  const response = await axios.patch(`/api/client/${id}`, data);

  return response;
};

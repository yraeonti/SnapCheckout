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

export const deleteClient = async (id?: string): Promise<any> => {
  const response = await axios.delete(`/api/client/${id}`);

  return response;
};

export type CheckoutItemPayload = {
  product_id: string;
  client_id: string;
  quantity: number;
};

export const addCheckoutItem = async (data: CheckoutItemPayload) => {
  const response = await axios.post(`/api/checkout/`, data);
  return response;
};

export type ClientLinkPayload = {
  email: string;
  name?: string;
  phone?: string;
  location: string;
  client_link: string;
};

export const getClientLink = async (data: ClientLinkPayload) => {
  const response = await axios.post(`/api/client/checkout_link`, data);
  return response;
};

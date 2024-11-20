import { IStore } from "@/types/store.dto";
import axios from "axios";

export const getStoreItems = async (): Promise<IStore[]> => {
  const response = await axios.get("/api/store");

  return response.data.data;
};

export const addStoreItem = async (data: FormData) => {
  const response = await axios.post("/api/store", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateStoreItem = async (item_id?: string, data?: FormData) => {
  const response = await axios.patch(`/api/store/${item_id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const getStoreItem = async (item_id: string): Promise<IStore> => {
  const response = await axios.get(`/api/store/${item_id}`);

  return response.data.data;
};

export const deleteStoreItem = async (item_id?: string) => {
  const response = await axios.delete(`/api/store/${item_id}`);

  return response;
};

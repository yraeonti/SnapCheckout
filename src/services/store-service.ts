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

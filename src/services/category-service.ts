import { ICategory } from "@/types/store.dto";
import axios from "axios";

export const addCategory = async (data: { category: string }) => {
  const response = await axios.post("/api/category", data);

  return response.data;
};

export const getCategories = async (): Promise<ICategory[]> => {
  const response = await axios.get("/api/category");

  return response.data.data;
};

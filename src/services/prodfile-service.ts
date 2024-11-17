import { IProfileSettings } from "@/types/profile.dto";
import axios from "axios";

export const getProfile = async (): Promise<IProfileSettings> => {
  const response = await axios.get("/api/profile");

  return response.data.data;
};

export const updateProfile = async (data: FormData) => {
  const response = await axios.patch("/api/profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const createClientLink = async () => {
  const response = await axios.patch("/api/profile/client_link");

  return response.data;
};

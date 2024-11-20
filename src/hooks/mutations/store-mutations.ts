"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  addStoreItem,
  deleteStoreItem,
  getStoreItem,
  getStoreItems,
} from "@/services/store-service";
import { useRouter } from "next/navigation";

export const useGetStoreItems = () => {
  return useQuery({
    queryKey: ["storeItems"],
    queryFn: () => getStoreItems(),
  });
};

export const useStoreMutation = (id?: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      // if(id) {
      //   const response = await updateStoreItem(id, data);
      //   return response.data;

      // }else {

      const response = await addStoreItem(data);
      return response.data;

      // }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["storeItems"],
      });

      router.push("/store");

      toast.success(`Store Item created successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.message);
      console.log(error?.message);
    },
  });

  return mutation;
};

export const useGetStoreItem = (item_id: string) => {
  return useQuery({
    queryKey: ["storeItem", item_id],
    queryFn: () => getStoreItem(item_id),
  });
};

export const useDeleteStoreItem = (
  item_id?: string,
  closeModal?: () => void
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await deleteStoreItem(item_id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["storeItems"],
      });

      toast.success("Store Item deleted successfully");

      closeModal && closeModal();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data.message);
      console.log(error?.response?.data);
    },
  });

  return mutation;
};

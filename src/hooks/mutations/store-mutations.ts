"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IStore } from "@/types/store.dto";
import { addStoreItem, getStoreItems } from "@/services/store-service";
import { useRouter } from "next/navigation";

export const useGetStoreItems = () => {
  return useQuery({
    queryKey: ["storeItems"],
    queryFn: () => getStoreItems(),
  });
};

export const useStoreMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await addStoreItem(data);
      return response.data;
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

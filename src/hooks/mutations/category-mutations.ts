"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ICategory, IStore } from "@/types/store.dto";
import { addStoreItem, getStoreItems } from "@/services/store-service";
import { useRouter } from "next/navigation";
import { addCategory, getCategories } from "@/services/category-service";

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
};

export const useCategoryMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { category: string }) => {
      const response = await addCategory(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      toast.success(`Category created successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  return mutation;
};

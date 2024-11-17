"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/services/prodfile-service";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
  });
};

export const useProfileMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await updateProfile(data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      toast.success(`Profile updated successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.message);
      console.log(error?.message);
    },
  });

  return mutation;
};

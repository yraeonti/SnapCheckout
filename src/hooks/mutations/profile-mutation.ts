"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createClientLink,
  getProfile,
  updateProfile,
} from "@/services/prodfile-service";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
  });
};

export const useProfileMutation = (closeModal?: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await updateProfile(data);
      const clientLinkResponse = await createClientLink();

      return {
        profile: response.data,
        clientLink: clientLinkResponse,
      };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      toast.success(`Profile updated successfully`);
      closeModal && closeModal();
    },
    onError: (error: any) => {
      toast.error(error?.message);
      console.log(error?.message);
    },
  });

  return mutation;
};

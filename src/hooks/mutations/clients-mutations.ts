import {
  addClient,
  ClientPayload,
  getClients,
  updateClient,
} from "@/services/clients-service";
import { IClient } from "@/types/client.dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(),
  });
};

export const useClientMutation = (id?: string, closeModal?: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: ClientPayload) => {
      const { id, ...rest } = data;

      if (id) {
        const response = await updateClient(id, rest);
        return response;
      } else {
        const response = await addClient(data);
        return response;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: variables.id ? ["clients", variables.id] : ["clients"],
      });

      closeModal && closeModal();

      toast.success(`Client ${id ? "updated" : "added"} successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  return mutation;
};

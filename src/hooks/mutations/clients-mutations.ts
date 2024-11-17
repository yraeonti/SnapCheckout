import {
  addClient,
  ClientPayload,
  deleteClient,
  getClients,
  updateClient,
  CheckoutItemPayload,
  addCheckoutItem,
  ClientLinkPayload,
  getClientLink,
} from "@/services/clients-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
        queryKey: ["clients"],
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

export const useDeleteClientMutation = (
  id?: string,
  closeModal?: () => void
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await deleteClient(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      toast.success("Client deleted successfully");

      closeModal && closeModal();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data.message);
      console.log(error?.response?.data);
    },
  });

  return mutation;
};

export const addCheckoutItemMutation = (closeModal?: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CheckoutItemPayload) => {
      const response = await addCheckoutItem(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      toast.success(`Checkout Item add successful`);
      closeModal && closeModal();
    },
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  return mutation;
};

export const useGetClientLink = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: ClientLinkPayload) => {
      const response = await getClientLink(data);
      return response.data;
    },
    onSuccess: (data) => {
      // route origin location to the link
      const { short_link } = data?.data;
      // redirect to checkou
      router.push(`/checkout/${short_link}`);

      toast.success(`successful`);
    },
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  return mutation;
};

import {
  getOrders,
  OrderStatusUpdatePayload,
  updateOrderStatus,
} from "@/services/orders-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });
};

export const useEditOrderStatusMutation = (closeModal?: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: OrderStatusUpdatePayload) => {
      const response = await updateOrderStatus(data);
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      closeModal && closeModal();
      toast.success(`Order status updated successfully to ${data.status}`);
    },
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  return mutation;
};

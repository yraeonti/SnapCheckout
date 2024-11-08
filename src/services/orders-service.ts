import { IOrder } from "@/types/order.dto";

import axios from "axios";

export const getOrders = async (): Promise<IOrder[]> => {
  const response = await axios.get("/api/order");

  return response.data.data;
};

export type OrderStatusUpdatePayload = {
  order_id: string;
  status: "PENDING" | "ONGOING" | "COMPLETED" | "FAILED";
};

export const updateOrderStatus = async (data: OrderStatusUpdatePayload) => {
  const response = await axios.patch(`/api/order`, data);

  return response;
};

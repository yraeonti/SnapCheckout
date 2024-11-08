import { ICheckout, ICheckoutItems } from "./client.dto";

export enum ORDER_STATUS {
  PENDING,
  ONGOING,
  COMPLETED,
  FAILED,
}

export interface IOrder {
  id: string;
  checkout_items: ICheckoutItems[];
  status: ORDER_STATUS;
  checkout_id: string;
  tx_reference: string;
  created_at: Date;
  updatedAt: Date;
}

import { IStore } from "./store.dto";

export enum PaymentStatus {
  PENDING = "PENDING",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

// Interface for Client
export interface IClient {
  id?: string;
  email: string;
  phone: string | null;
  name: string | null;
  link?: string;
  short_link?: string;
  user_id?: string;
  checkout?: ICheckout | null;
  created_at: Date;
  updatedAt: Date;
}

// Interface for CheckoutItems
export interface ICheckoutItems {
  id: string;
  item_name: string;
  image: string;
  item_price: number;
  quantity: number;
  product_id: string;
  product: IStore;
  paid: boolean;
  checkout_id: string;
  checkout: ICheckout;
  created_at: Date;
  updatedAt: Date;
}

// Interface for Checkout
export interface ICheckout {
  id: string;
  items: ICheckoutItems[];
  client_id: string;
  client: IClient;
  user_id: string;
  discount: number;
  delivery: number;
  payment_status: PaymentStatus;
  created_at: Date;
  updatedAt: Date;
}

export interface IStore {
  id?: string;
  item_name: string;
  category: string;
  item_price: string;
  item_quantity?: number;
  image?: string;
  description: string;
}

export interface ICategory {
  id: string;
  category: string;
}

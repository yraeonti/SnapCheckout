"use client";

import { DataTable } from "@/components/ui/data-table";

import { useGetOrders } from "@/hooks/mutations/orders-mutations";
import { orders_column } from "./orders-columns";

export const OrdersTable = () => {
  const { data, isLoading } = useGetOrders();
  return (
    <section className="p-2 bg-white w-full font-workSans">
      <DataTable
        columns={orders_column}
        data={data ?? []}
        isSearch
        searchKey="tx_reference"
        loading={isLoading}
      />
    </section>
  );
};

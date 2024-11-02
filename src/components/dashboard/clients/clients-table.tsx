"use client";

import { DataTable } from "@/components/ui/data-table";
import { clients_column } from "./clients-columns";
import { useGetClients } from "@/hooks/mutations/clients-mutations";

export const ClientsTable = () => {
  const { data, isLoading } = useGetClients();
  return (
    <section className="p-2 bg-white w-full font-workSans">
      <DataTable
        columns={clients_column}
        data={data ?? []}
        isSearch
        searchKey="name"
        loading={isLoading}
      />
    </section>
  );
};

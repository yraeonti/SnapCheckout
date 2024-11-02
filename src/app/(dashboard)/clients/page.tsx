import { ClientsHeader } from "@/components/dashboard/clients/clients-header";
import { ClientsTable } from "@/components/dashboard/clients/clients-table";

export default function Clients() {
  return (
    <>
      <ClientsHeader />
      <main className="">
        <ClientsTable />
      </main>
    </>
  );
}

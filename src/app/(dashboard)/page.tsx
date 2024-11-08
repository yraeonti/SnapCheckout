import { OrdersHeader } from "@/components/dashboard/orders/orders-header";
import { OrdersTable } from "@/components/dashboard/orders/orders-table";

export default function Dashboard() {
  return (
    <>
      <OrdersHeader />
      <main>
        {/* order analytics */}

        {/* order table */}
        <OrdersTable />
      </main>
    </>
  );
}
